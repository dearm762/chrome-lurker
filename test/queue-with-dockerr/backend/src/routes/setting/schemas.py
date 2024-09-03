from pydantic import BaseModel
from datetime import time


class SettingsCreate(BaseModel):
    fromm: time
    to: time


class SettingsUpdate(BaseModel):
    fromm: time
    to: time


class SettingsDelete(BaseModel):
    id: int


class SettingsResponse(BaseModel):
    id: int
    permission: bool
    fromm: time
    to: time

    class Config:
        orm_mode = True
