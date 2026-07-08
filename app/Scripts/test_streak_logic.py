import sys
import os
from datetime import datetime, date, timedelta, timezone

# Add parent directory to path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import SQLModel, create_engine, Session, select
from Users.models import User
from Prediction.models import Prediction
from Nutrition.models import Nutrition
from Users.services.streak_service import (
    get_local_date,
    get_active_streak_state,
    update_streak,
    recalculate_streak,
)

def run_tests():
    print("Initializing test database...")
    # Create an in-memory SQLite database
    engine = create_engine("sqlite:///:memory:", echo=False)
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # Create a test user
        user = User(
            name="Test User",
            email="test@example.com",
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
        # 1. First meal ever logged
        # ----------------------------------------------------
        print("\nTest 1: First meal ever logged...")
        day1 = datetime.utcnow() - timedelta(days=9)
        p1 = Prediction(
            user_id=user_id,
            food_name="Apple",
            weight_grams=100.0,
            calories=52.0,
            protein=0.3,
            fat=0.2,
            carbohydrates=14.0,
            fiber=2.4,
            sugar=10.0,
            confidence=0.9,
            created_at=day1
        )
        session.add(p1)
        session.commit()
        session.refresh(p1)
        
        updated = update_streak(user, day1, session)
        assert updated is True, "First log should return True"
        assert user.current_streak == 1, "First streak should be 1"
        assert user.longest_streak == 1, "Longest streak should be 1"
        assert user.last_meal_logged_date == get_local_date(day1), "Last meal date should match Day 1"
        print("-> Pass!")

        # ----------------------------------------------------
        # 2. Multiple meals logged on the same day
        # ----------------------------------------------------
        print("\nTest 2: Multiple meals logged on the same day...")
        p2 = Prediction(
            user_id=user_id,
            food_name="Banana",
            weight_grams=100.0,
            calories=89.0,
            protein=1.1,
            fat=0.3,
            carbohydrates=23.0,
            fiber=2.6,
            sugar=12.0,
            confidence=0.95,
            created_at=day1 + timedelta(hours=2)  # same day
        )
        session.add(p2)
        session.commit()
        
        updated = update_streak(user, day1 + timedelta(hours=2), session)
        assert updated is False, "Same day log should return False"
        assert user.current_streak == 1, "Streak should remain 1"
        print("-> Pass!")

        # ----------------------------------------------------
        # 3. Consecutive daily logging
        # ----------------------------------------------------
        print("\nTest 3: Consecutive daily logging...")
        day2 = day1 + timedelta(days=1)
        p3 = Prediction(
            user_id=user_id,
            food_name="Orange",
            weight_grams=100.0,
            calories=47.0,
            protein=0.9,
            fat=0.1,
            carbohydrates=12.0,
            fiber=2.4,
            sugar=9.0,
            confidence=0.85,
            created_at=day2
        )
        session.add(p3)
        session.commit()
        
        updated = update_streak(user, day2, session)
        assert updated is True, "Consecutive log should return True"
        assert user.current_streak == 2, "Streak should increment to 2"
        assert user.longest_streak == 2, "Longest streak should update to 2"
        print("-> Pass!")

        # ----------------------------------------------------
        # 4. Missing one day (and then logging)
        # ----------------------------------------------------
        print("\nTest 4: Missing one day...")
        # We logged Day 1 and Day 2. We skip Day 3 and log Day 4.
        day4 = day2 + timedelta(days=2)
        p4 = Prediction(
            user_id=user_id,
            food_name="Grape",
            weight_grams=100.0,
            calories=69.0,
            protein=0.7,
            fat=0.2,
            carbohydrates=18.0,
            fiber=0.9,
            sugar=16.0,
            confidence=0.88,
            created_at=day4
        )
        session.add(p4)
        session.commit()
        
        updated = update_streak(user, day4, session)
        assert updated is True, "Logging after missing day should return True"
        assert user.current_streak == 1, "Streak should reset to 1"
        assert user.longest_streak == 2, "Longest streak should remain 2"
        print("-> Pass!")

        # ----------------------------------------------------
        # 5. Missing multiple days
        # ----------------------------------------------------
        print("\nTest 5: Missing multiple days...")
        # We logged Day 4. We skip Days 5, 6, 7 and log Day 8.
        day8 = day4 + timedelta(days=4)
        p5 = Prediction(
            user_id=user_id,
            food_name="Peach",
            weight_grams=100.0,
            calories=39.0,
            protein=0.9,
            fat=0.3,
            carbohydrates=10.0,
            fiber=1.5,
            sugar=8.0,
            confidence=0.92,
            created_at=day8
        )
        session.add(p5)
        session.commit()
        
        updated = update_streak(user, day8, session)
        assert updated is True, "Logging after missing multiple days should return True"
        assert user.current_streak == 1, "Streak should reset to 1"
        print("-> Pass!")

        # ----------------------------------------------------
        # 6. Deleting today's meal (only meal of that day)
        # ----------------------------------------------------
        print("\nTest 6: Deleting today's meal...")
        # Currently we have a streak of 1 at Day 8.
        # Let's add Day 9 to make it streak of 2.
        day9 = day8 + timedelta(days=1)
        p6 = Prediction(
            user_id=user_id,
            food_name="Plum",
            weight_grams=100.0,
            calories=46.0,
            protein=0.7,
            fat=0.3,
            carbohydrates=11.0,
            fiber=1.4,
            sugar=10.0,
            confidence=0.87,
            created_at=day9
        )
        session.add(p6)
        session.commit()
        update_streak(user, day9, session)
        assert user.current_streak == 2, "Streak should be 2"
        
        # Now delete Day 9 prediction (p6)
        session.delete(p6)
        session.commit()
        
        # Run recalculate_streak as done in delete_prediction
        recalculate_streak(user_id, session)
        # Day 8 is a past date, so today's date should determine if streak is active.
        # Since today is much later than Day 8, current_streak should reset to 0 in recalculate.
        assert user.current_streak == 0, f"Expected current streak to reset to 0 after deleting last meal, got {user.current_streak}"
        print("-> Pass!")

        # ----------------------------------------------------
        # 7. Longest streak updates correctly
        # ----------------------------------------------------
        print("\nTest 7: Longest streak updates correctly...")
        # Let's add predictions for consecutive days: Today-2, Today-1, Today.
        today = datetime.utcnow()
        t_minus_2 = today - timedelta(days=2)
        t_minus_1 = today - timedelta(days=1)
        
        # Clear predictions
        for p in session.exec(select(Prediction).where(Prediction.user_id == user_id)).all():
            session.delete(p)
        session.commit()
        
        p_t2 = Prediction(user_id=user_id, food_name="Apple", weight_grams=100, calories=50, protein=0, fat=0, carbohydrates=0, fiber=0, sugar=0, confidence=1, created_at=t_minus_2)
        p_t1 = Prediction(user_id=user_id, food_name="Apple", weight_grams=100, calories=50, protein=0, fat=0, carbohydrates=0, fiber=0, sugar=0, confidence=1, created_at=t_minus_1)
        p_t0 = Prediction(user_id=user_id, food_name="Apple", weight_grams=100, calories=50, protein=0, fat=0, carbohydrates=0, fiber=0, sugar=0, confidence=1, created_at=today)
        
        session.add(p_t2)
        session.add(p_t1)
        session.add(p_t0)
        session.commit()
        
        recalculate_streak(user_id, session)
        
        assert user.current_streak == 3, f"Expected current streak of 3, got {user.current_streak}"
        assert user.longest_streak == 3, f"Expected longest streak of 3, got {user.longest_streak}"
        print("-> Pass!")

        # ----------------------------------------------------
        # 8. Idempotence of GET (get_active_streak_state)
        # ----------------------------------------------------
        print("\nTest 8: Idempotence of GET...")
        # Get active streak state in memory
        state = get_active_streak_state(user)
        assert state["current_streak"] == 3
        assert state["longest_streak"] == 3
        assert state["is_active"] is True
        
        # Simulate time passing (e.g. today is now t+2, so t_0 was 2 days ago)
        # We temporarily change user's last logged date to 2 days ago
        user.last_meal_logged_date = get_local_date(today - timedelta(days=2))
        session.add(user)
        session.commit()
        
        # Get active state again (should be expired to 0 in memory, but DB current_streak is still 3)
        state2 = get_active_streak_state(user)
        assert state2["current_streak"] == 0, f"Expected in-memory expired streak of 0, got {state2['current_streak']}"
        assert state2["is_active"] is False
        
        # Verify database was NOT mutated
        session.refresh(user)
        assert user.current_streak == 3, "Database state should not be mutated during read operation"
        print("-> Pass!")

    print("\nAll unit tests passed successfully!")

if __name__ == "__main__":
    run_tests()
