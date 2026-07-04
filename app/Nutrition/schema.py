from pydantic import BaseModel, Field
from typing import Literal


class BMICalculatorRequest(BaseModel):
    age: int = Field(..., gt=0, le=120)
    gender: Literal["male", "female"]
    height_cm: float = Field(..., gt=50, le=300)
    weight_kg: float = Field(..., gt=10, le=500)
    activity_level: Literal[
        "sedentary",
        "light",
        "moderate",
        "active",
        "very_active",
    ]


class BMICalculatorResponse(BaseModel):
    bmi: float
    bmi_category: str
    maintenance_calories: int
    weight_loss_calories: int
    weight_gain_calories: int