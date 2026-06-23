from sqlmodel import Session, select

from Utils.utils import engine
from Nutrition.models import Nutrition


def get_nutrition_by_food(food_name: str):

    with Session(engine) as session:

        statement = select(Nutrition).where(
            Nutrition.food_name == food_name
        )

        return session.exec(statement).first()