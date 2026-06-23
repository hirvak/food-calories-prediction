from sqlmodel import SQLModel, Field
from typing import Optional

class Nutrition(SQLModel, table=True):

    id: Optional[int] = Field(default=None, primary_key=True)
    food_name: str = Field(index=True, unique=True)
    calories_per_100g: float
    protein: float
    fat: float
    carbohydrates: float
    fiber: float
    sugar: float