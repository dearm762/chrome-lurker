from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from src.database import Base
from src.routes.auth.models import User
from src.routes.category.models import Category
from datetime import datetime, timedelta

def current_time_plus_5():
    return datetime.utcnow() + timedelta(hours=5)

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, unique=False, nullable=False)
    phone_number = Column(String, unique=False, nullable=False)
    created_at = Column(DateTime, default=current_time_plus_5)
    category_id = Column(Integer, ForeignKey(Category.id), nullable=False)
    status = Column(String, nullable=False, default="wait")
    number = Column(String, nullable=False)
    language = Column(String, nullable=False, default="Русский")
    worker_id = Column(Integer, ForeignKey(User.id), nullable=True, default=None)

    category = relationship("Category", back_populates="tickets")
    user = relationship("User", back_populates="tickets")
