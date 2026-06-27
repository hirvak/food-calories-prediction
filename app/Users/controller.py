from Prediction.models import Prediction
from sqlmodel import Session,select
from Users.models import User
from collections import Counter

def get_dashboard_stats(session):
    users = session.exec(select(User)).all()
    predictions = session.exec(select(Prediction)).all()
    total_users = len(users)

    total_predictions = len(predictions)

    total_calories = sum(p.calories for p in predictions)
    food_counter = Counter(p.food_name for p in predictions)
    most_detected_food = (food_counter.most_common(1)[0][0]
        if food_counter
        else None)
    return {
        "total_users": total_users,
        "total_predictions": total_predictions,
        "total_calories_consumed": round(total_calories, 2),
        "most_detected_food": most_detected_food
    }

def get_user_profile_stats(user_id: int,session: Session):

    predictions = session.exec(select(Prediction).where(Prediction.user_id == user_id)).all()
    total_predictions = len(predictions)
    total_calories = sum(p.calories for p in predictions)
    return {"total_predictions": total_predictions,"total_calories_consumed": round(total_calories,2)}