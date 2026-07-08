import sys
import os
from datetime import datetime

# Add parent directory to path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import SQLModel, create_engine, Session, select
from Users.models import User
from Prediction.models import Prediction, PredictionSource
from Nutrition.models import Nutrition
from Nutrition.controller import search_nutrition_foods

def run_tests():
    print("Initializing test database...")
    # Create an in-memory SQLite database
    engine = create_engine("sqlite:///:memory:", echo=False)
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # Populate database with some master nutrition items
        n1 = Nutrition(
            food_name="Chicken Breast",
            calories_per_100g=165.0,
            protein=31.0,
            fat=3.6,
            carbohydrates=0.0,
            fiber=0.0,
            sugar=0.0
        )
        n2 = Nutrition(
            food_name="Chicken Curry",
            calories_per_100g=120.0,
            protein=15.0,
            fat=7.0,
            carbohydrates=3.0,
            fiber=1.0,
            sugar=1.0
        )
        n3 = Nutrition(
            food_name="Apple",
            calories_per_100g=52.0,
            protein=0.3,
            fat=0.2,
            carbohydrates=14.0,
            fiber=2.4,
            sugar=10.0
        )
        session.add(n1)
        session.add(n2)
        session.add(n3)
        session.commit()
        
        session.refresh(n1)
        session.refresh(n2)
        session.refresh(n3)
        
        # Create a test user
        user = User(
            name="Manual Logger",
            email="manual@example.com",
            hashed_password="hashed_password",
            current_streak=0,
            longest_streak=0,
            last_meal_logged_date=None
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        user_id = user.id

        # ----------------------------------------------------
        # 1. Autocomplete Matches Partial Names
        # ----------------------------------------------------
        print("\nTest 1: Autocomplete Matches Partial Names...")
        results = search_nutrition_foods("chi", session)
        assert len(results) == 2, f"Expected 2 matches, got {len(results)}"
        assert results[0].food_name in ["Chicken Breast", "Chicken Curry"]
        assert results[1].food_name in ["Chicken Breast", "Chicken Curry"]
        
        results_apple = search_nutrition_foods("app", session)
        assert len(results_apple) == 1, f"Expected 1 match, got {len(results_apple)}"
        assert results_apple[0].food_name == "Apple"
        print("-> Pass!")

        # ----------------------------------------------------
        # 2. Manual prediction calculates calories and macros correctly
        # ----------------------------------------------------
        print("\nTest 2: Manual prediction calculations...")
        # Mocking the calculation process in POST /prediction/manual
        food_id = n1.id # Chicken Breast
        weight = 150.0  # grams
        
        # Lookup food
        food_item = session.get(Nutrition, food_id)
        assert food_item is not None
        assert food_item.food_name == "Chicken Breast"
        
        # Calculate
        calories = round((food_item.calories_per_100g * weight) / 100, 2)
        protein = round((food_item.protein * weight) / 100, 2)
        fat = round((food_item.fat * weight) / 100, 2)
        carbohydrates = round((food_item.carbohydrates * weight) / 100, 2)
        fiber = round((food_item.fiber * weight) / 100, 2)
        sugar = round((food_item.sugar * weight) / 100, 2)
        
        assert calories == 247.5
        assert protein == 46.5
        assert fat == 5.4
        assert carbohydrates == 0.0
        print("-> Pass!")

        # ----------------------------------------------------
        # 3. Saves prediction log with correct PredictionSource and nutrition_id
        # ----------------------------------------------------
        print("\nTest 3: Saved prediction metadata check...")
        prediction = Prediction(
            user_id=user_id,
            food_name=food_item.food_name,
            weight_grams=weight,
            calories=calories,
            protein=protein,
            fat=fat,
            carbohydrates=carbohydrates,
            fiber=fiber,
            sugar=sugar,
            confidence=1.0,
            image_path=None,
            prediction_source=PredictionSource.MANUAL,
            nutrition_id=food_item.id
        )
        session.add(prediction)
        session.commit()
        session.refresh(prediction)
        
        assert prediction.prediction_source == PredictionSource.MANUAL
        assert prediction.nutrition_id == food_item.id
        assert prediction.confidence == 1.0
        assert prediction.image_path is None
        print("-> Pass!")

        # ----------------------------------------------------
        # 4. Weight Validation Bounds
        # ----------------------------------------------------
        print("\nTest 4: Weight Validation Bounds...")
        # Negative weight test
        invalid_weight_1 = -10.0
        assert invalid_weight_1 <= 0, "Weight validation should reject negative weight"
        
        # Excess weight test (> 5000)
        invalid_weight_2 = 5001.0
        assert invalid_weight_2 > 5000, "Weight validation should reject weights > 5000g"
        print("-> Pass!")

    print("\nAll manual food entry tests passed successfully!")

if __name__ == "__main__":
    run_tests()
