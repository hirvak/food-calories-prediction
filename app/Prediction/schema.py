from pydantic import BaseModel,Field
from typing import List


class PredictionResponse(BaseModel):
    food_name: str
    confidence: float
    calories: float

class PredictionUpdate(BaseModel):
    food_name: str
    weight: float = Field(gt=0, description="Weight in grams")

class ManualPredictionCreate(BaseModel):
    food_id: int
    weight_grams: float = Field(gt=0, le=5000, description="Weight in grams")

# ---------------- Weekly Trend ----------------

class WeeklyTrend(BaseModel):
    day: str
    calories: float


# ---------------- Macronutrients ----------------

class Macronutrients(BaseModel):
    protein: float
    fat: float
    carbohydrates: float

# ---------------- Meal ----------------

class MealSummary(BaseModel):
    food: str
    calories: float

# ---------------- Dashboard Statistics ----------------

class DashboardStatistics(BaseModel):
    total_predictions: int
    average_calories: float
    average_confidence: float
    highest_calorie_meal: MealSummary
    lowest_calorie_meal: MealSummary


# ---------------- Recent Activity ----------------

class RecentActivity(BaseModel):
    food: str
    calories: float
    confidence: float
    time: str


from datetime import date

class DashboardAnalyticsResponse(BaseModel):
    weekly_trend: List[WeeklyTrend]
    macronutrients: Macronutrients
    statistics: DashboardStatistics
    recent_activity: List[RecentActivity]
    top_foods: list
    current_streak: int
    longest_streak: int
    last_meal_logged_date: date | None