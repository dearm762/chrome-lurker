from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status

from src.routes.auth import auth
from src.routes.auth.schemas import UserOut
from src.routes.ticket.models import Ticket
from src.routes.category.models import Category
from src.routes.websocket.router import manager
from src.routes.ticket.schemas import TicketOut


async def create_ticket(db: AsyncSession, ticket_data):
    lang = None
    if ticket_data['language'] == 'ru':
        lang = 'Русский'
    elif ticket_data['language'] == 'kz':
        lang = 'Қазақ'
    elif ticket_data['language'] == 'en':
        lang = 'English'

    ticket_data['language'] = lang

    new_ticket = Ticket(**ticket_data, number="0")

    db.add(new_ticket)
    await db.flush() 

    new_ticket.number = f"{new_ticket.id:03d}"

    await db.commit()
    await db.refresh(new_ticket)

    await manager.broadcast({
        "action": "new_ticket",
        "category_id": new_ticket.category_id,
        "data": TicketOut.from_orm(new_ticket).dict()
    })

    return new_ticket


async def update_ticket(db: AsyncSession, ticket_id: int, ticket_data):
    result = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    db_ticket = result.scalars().first()

    if not db_ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    for key, value in ticket_data.dict(exclude_unset=True).items():
        setattr(db_ticket, key, value)

    db.add(db_ticket)
    await db.commit()
    await db.refresh(db_ticket)

    # Notify via WebSocket for the category
    await manager.broadcast({
        "action": "update_ticket",
        "category_id": db_ticket.category_id,
        "data": TicketOut.from_orm(db_ticket).dict()
    })

    return db_ticket


async def delete_ticket(db: AsyncSession, ticket_id: int):
    result = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    db_ticket = result.scalars().first()

    if not db_ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    await db.delete(db_ticket)
    await db.commit()

    # Notify via WebSocket for the category
    await manager.broadcast({
        "action": "delete_ticket",
        "data": {"ticket_id": ticket_id}
    }, db_ticket.category_id)
    # Notify via WebSocket for the general queue
    await update_general_queue(db)

    return {"message": "Ticket deleted successfully"}


async def get_tickets(db: AsyncSession):
    result = await db.execute(select(Ticket))
    tickets = result.scalars().all()
    return tickets


async def get_ticket(db: AsyncSession, ticket_id: int):
    result = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = result.scalars().first()

    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    return ticket


async def get_current_ticket(db: AsyncSession, ticket_id: int):
    result = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = result.scalars().first()

    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    return ticket


async def update_general_queue(db: AsyncSession):
    result = await db.execute(select(Ticket).where(Ticket.status == "wait").order_by(Ticket.created_at))
    tickets = result.scalars().all()
    await manager.broadcast({
        "action": "general_queue",
        "data": [TicketOut.from_orm(ticket).dict() for ticket in tickets]
    })
