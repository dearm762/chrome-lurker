from fastapi import Depends, HTTPException, status, APIRouter, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.database import get_async_session
from src.routes.auth import auth
from src.routes.category.schemas import CategoryCreate, CategoryOutput, CategoryUpdate
from src.routes.category.models import Category
from src.routes.auth.models import User
from src.routes.auth.schemas import UserOut
from src.routes.ticket.models import Ticket
from src.routes.ticket.schemas import TicketOut
from src.routes.ticket.ticket import create_ticket, update_ticket, delete_ticket, get_tickets, get_ticket
from src.routes.websocket.router import manager  
from src.schemas import CurrentTicketWorker

router = APIRouter(
    prefix="/category",
    tags=["category"],
)


@router.post("/", response_model=CategoryOutput, status_code=status.HTTP_201_CREATED)
async def create_category(category: CategoryCreate, db: AsyncSession = Depends(get_async_session)):
    new_category = Category(**category.dict())
    db.add(new_category)
    await db.commit()
    await db.refresh(new_category)
    return new_category


@router.put("/{category_id}", response_model=CategoryOutput)
async def update_category(category_id: int, category: CategoryUpdate, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Category).where(Category.id == category_id))
    db_category = result.scalars().first()

    if db_category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    for key, value in category.dict(exclude_unset=True).items():
        setattr(db_category, key, value)

    db.add(db_category)
    await db.commit()
    await db.refresh(db_category)
    return db_category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(category_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Category).where(Category.id == category_id))
    db_category = result.scalars().first()

    if db_category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    await db.delete(db_category)
    await db.commit()
    return {"message": "Category deleted successfully"}


@router.get("/", response_model=list[CategoryOutput])
async def get_categories(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Category))
    categories = result.scalars().all()
    return categories


@router.get("/{category_id}", response_model=CategoryOutput)
async def get_category(category_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalars().first()

    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    return category


@router.get("/all/users", response_model=list[dict])
async def get_all_users(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Category))
    categories = result.scalars().all()

    response = []
    for category in categories:
        users = await db.execute(select(User).where(User.category_id == category.id))
        users = users.scalars().all()
        response.append({
            "category": CategoryOutput.from_orm(category).dict(),
            "users": [UserOut.from_orm(user).dict() for user in users]
        })

    return response


@router.get("/{category_id}/users", response_model=list[UserOut])
async def get_users_by_id(category_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(User).where(User.category_id == category_id))
    users = result.scalars().all()
    return [UserOut.from_orm(user) for user in users]


@router.get("/{category_id}/tickets", response_model=list[TicketOut])
async def get_tickets_by_id(category_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(Ticket).order_by(Ticket.id).where(Ticket.category_id == category_id, Ticket.status == "wait"))
    tickets = result.scalars().all()
    return [TicketOut.from_orm(ticket) for ticket in tickets]


@router.post("/ticket/next", response_model=CurrentTicketWorker)
async def get_next_ticket(request: Request,
                          db: AsyncSession = Depends(get_async_session)) -> CurrentTicketWorker:
    data = await request.json()
    worker_token = data.get("token")
    if worker_token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    worker: UserOut = await auth.get_current_user(db, worker_token)

    current_ticket = await db.execute(
        select(Ticket).where(Ticket.worker_id == worker.id, Ticket.status == "invited")
    )
    current_ticket = current_ticket.scalars().first()

    if current_ticket:
        current_ticket.status = "completed"
        db.add(current_ticket)
        await db.commit()
        await db.refresh(current_ticket)

        # Уведомляем через WebSocket о завершении текущего тикета
        await manager.broadcast({
            "action": "complete_ticket",
            "category_id": worker.category_id,
            "data": TicketOut.from_orm(current_ticket).dict()
        })

    next_ticket = await db.execute(
        select(Ticket).where(Ticket.category_id == worker.category_id, Ticket.status == "wait",
                             Ticket.worker_id == None)
    )
    next_ticket = next_ticket.scalars().first()

    if next_ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No available tickets")

    next_ticket.status = "invited"
    next_ticket.worker_id = worker.id

    db.add(next_ticket)
    await db.commit()
    await db.refresh(next_ticket)

    category = await db.execute(select(Category).where(Category.id == next_ticket.category_id))
    category = category.scalars().first()

    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    # Notify via WebSocket about the next ticket
    await manager.broadcast({
        "action": "next_ticket",
        "category_id": worker.category_id,
        "data": {"ticket": TicketOut.from_orm(next_ticket).dict(), "window": worker.window}
    })

    return CurrentTicketWorker(
        ticket_data=TicketOut.from_orm(next_ticket),
        ticket_id=next_ticket.id,
        ticket_number=int(next_ticket.number),
        category_name=category.name,
        ticket_created_time=next_ticket.created_at.strftime("%d.%m.%Y %H:%M"),
        ticket_language=next_ticket.language,
        ticket_full_name=next_ticket.full_name,
        ticket_phone_number=next_ticket.phone_number
    )
