from datetime import datetime as dt
import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from .models import Settings
from .schemas import SettingsCreate, SettingsUpdate


async def create_settings(db: AsyncSession, settings: SettingsCreate):
    db_settings = Settings(fromm=settings.fromm, to=settings.to)
    db.add(db_settings)
    await db.commit()
    await db.refresh(db_settings)

    now = dt.now().time()

    if db_settings.fromm <= now <= db_settings.to:
        return {"permission": True, "fromm": db_settings.fromm, "to": db_settings.to, "id": db_settings.id}
    else:
        return {"permission": False, "fromm": db_settings.fromm, "to": db_settings.to, "id": db_settings.id}


async def update_settings(db: AsyncSession, settings_id: int, settings: SettingsUpdate):
    result = await db.execute(select(Settings).filter(Settings.id == settings_id))
    db_settings = result.scalars().first()
    if db_settings is None:
        return None
    db_settings.fromm = settings.fromm
    db_settings.to = settings.to
    await db.commit()
    await db.refresh(db_settings)
    now = dt.now().time()

    if db_settings.fromm <= now <= db_settings.to:
        return {"permission": True, "fromm": db_settings.fromm, "to": db_settings.to, "id": db_settings.id}
    else:
        return {"permission": False, "fromm": db_settings.fromm, "to": db_settings.to, "id": db_settings.id}


async def delete_settings(db: AsyncSession, settings_id: int):
    result = await db.execute(select(Settings).filter(Settings.id == settings_id))
    db_settings = result.scalars().first()
    if db_settings is None:
        return None
    await db.delete(db_settings)
    await db.commit()
    return db_settings


async def get_settings(db: AsyncSession):
    result = await db.execute(select(Settings))
    settings = result.scalars().first()

    if settings is None:
        return  {
            "id": 0,  
            "permission": False,
            "fromm": datetime.time(0, 0), 
            "to": datetime.time(0, 0)
        }

    now = dt.now().time()

    if settings.fromm <= now <= settings.to:
        return {"permission": True, "frommm": settings.fromm, "to": settings.to, "id": settings.id}
    else:
        return {"permission": False, "fromm": settings.fromm, "to": settings.to, "id": settings.id}
