from Nutrition.schema import BMICalculatorRequest,BMICalculatorResponse
from Nutrition.controller import NutritionController
from fastapi import APIRouter
router = APIRouter(prefix="/nutrition",tags=["Nutrition"])
@router.post("/bmi-calculator",response_model=BMICalculatorResponse,summary="Calculate BMI and Daily Calorie Recommendation",)
def calculate_bmi(request: BMICalculatorRequest,) -> BMICalculatorResponse:
    """
    Calculate BMI, BMI category, maintenance calories,
    weight loss calories, and weight gain calories.
    """
    return NutritionController.calculate_bmi(request)