from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class PredictionSource(str, Enum):
    IMAGE = "IMAGE"
    MANUAL = "MANUAL"
    BARCODE = "BARCODE"


class Prediction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    food_name: str
    weight_grams: float
    calories: float
    protein: float
    fat: float
    carbohydrates: float
    fiber: float
    sugar: float
    confidence: float
    image_path: str | None = None
    prediction_source: PredictionSource = Field(default=PredictionSource.IMAGE)
    nutrition_id: Optional[int] = Field(default=None, foreign_key="nutrition.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)