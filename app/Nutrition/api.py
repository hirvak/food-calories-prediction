from Nutrition.schema import BMICalculatorRequest,BMICalculatorResponse
from Nutrition.controller import NutritionController, search_nutrition_foods
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session
from Utils.utils import get_session

router = APIRouter(prefix="/nutrition",tags=["Nutrition"])

@router.get("/search", summary="Search food items in the database")
def search_food(query: str = Query(..., min_length=1), session: Session = Depends(get_session)):
    results = search_nutrition_foods(query, session)
    return [
        {
            "id": food.id,
            "food_name": food.food_name,
            "calories_per_100g": food.calories_per_100g,
            "protein": food.protein,
            "fat": food.fat,
            "carbohydrates": food.carbohydrates,
            "fiber": food.fiber,
            "sugar": food.sugar
        }
        for food in results
    ]

@router.post("/bmi-calculator",response_model=BMICalculatorResponse,summary="Calculate BMI and Daily Calorie Recommendation",)
def calculate_bmi(request: BMICalculatorRequest,) -> BMICalculatorResponse:
    """
    Calculate BMI, BMI category, maintenance calories,
    weight loss calories, and weight gain calories.
    """
    return NutritionController.calculate_bmi(request)