from sqlmodel import Session, select, col

from Utils.utils import engine
from Nutrition.models import Nutrition

from Nutrition.schema import BMICalculatorRequest,BMICalculatorResponse
from Nutrition.service import NutritionService

def get_nutrition_by_food(food_name: str):

    with Session(engine) as session:
        statement = select(Nutrition).where(Nutrition.food_name == food_name)
        return session.exec(statement).first()

def search_nutrition_foods(query: str, session: Session, limit: int = 10):
    statement = select(Nutrition).where(col(Nutrition.food_name).ilike(f"%{query}%")).limit(limit)
    return session.exec(statement).all()
    
class NutritionController:

    @staticmethod
    def calculate_bmi(data: BMICalculatorRequest) -> BMICalculatorResponse:
        """
        Calculate BMI and daily calorie recommendations.
        """
        return NutritionService.calculate_bmi(data)
    
    @staticmethod
    def calculate_bmi(data: BMICalculatorRequest) -> BMICalculatorResponse:
        return NutritionService.calculate_bmi(data)