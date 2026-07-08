from sqlmodel import SQLModel, Field
from datetime import datetime, date
from typing import Optional


class User(SQLModel, table=True):

    id: Optional[int] = Field(default=None,primary_key=True)
    name: str
    email: str = Field(unique=True,index=True)
    hashed_password: str
    role: str = Field(default="user")
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    current_streak: int = Field(default=0)
    longest_streak: int = Field(default=0)
    last_meal_logged_date: Optional[date] = Field(default=None)