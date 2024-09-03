import random
import string
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from src import database
import src.routes.auth.models as models
from src.utils.mail import send_new_pass


def create_random_pass():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=8))

def create_token():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=32))

async def get_user(db: AsyncSession, token: str):
    result = await db.execute(select(models.User).where(models.User.token == token))
    return result.scalars().first()

async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(models.User).where(models.User.email == email))
    return result.scalars().first()

async def get_user_by_id(db: AsyncSession, id: int):
    result = await db.execute(select(models.User).where(models.User.id == id))
    return result.scalars().first()

async def authenticate_user(db: AsyncSession, email: str, password: str):
    user = await get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

async def get_current_user(db: AsyncSession = Depends(database.get_async_session), token: str = Depends()):
    result = await db.execute(select(models.User).where(models.User.token == token))
    user = result.scalars().first()
    print(f"--- USER: {user}")
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def verify_password(plain_password, hashed_password):
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.hash(password)

async def create_reset_token(db: AsyncSession, email: str):
    user = await get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    reset_token = create_token()
    user.reset_token = reset_token
    db.add(user)
    await db.commit()
    await db.refresh(user)
    await send_new_pass(
        email,
        reset_token,
    )
    return reset_token

async def verify_reset_token(db: AsyncSession, reset_token: str):
    result = await db.execute(select(models.User).where(models.User.reset_token == reset_token))
    user = result.scalars().first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token",
        )
    return user