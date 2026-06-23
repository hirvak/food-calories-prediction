# Prediction/models.py

from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Prediction(SQLModel, table=True):

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    food_name: str
    weight_grams: float
    calories: float
    confidence: float
    image_path: str
    created_at: datetime = Field(default_factory=datetime.utcnow)