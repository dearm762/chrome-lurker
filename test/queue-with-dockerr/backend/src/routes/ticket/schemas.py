from pydantic import BaseModel, root_validator, validator
from typing import Optional
from datetime import datetime

class TicketCreate(BaseModel):
    full_name: str
    phone_number: str
    category_id: int
    language: Optional[str]

class TicketUpdate(BaseModel):
    status: str

    @validator('status')
    def validate_status(cls, v):
        if v not in ["wait", "invited", "completed", "skipped", "cancelled"]:
            raise ValueError("Invalid status")
        return v

class TicketOut(BaseModel):
    id: int
    full_name: str
    phone_number: str
    created_at: str
    category_id: int
    status: str
    number: str
    worker_id: Optional[int]
    language: str

    @validator('created_at', pre=True)
    def format_datetime(cls, v):
        if isinstance(v, datetime):
            return v.strftime("%Y-%m-%d %H:%M:%S")
        return v

    class Config:
        orm_mode = True
        from_attributes = True


