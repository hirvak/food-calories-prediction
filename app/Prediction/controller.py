from sqlmodel import Session, select
from Prediction.models import Prediction
from datetime import datetime, date,timedelta
from sqlmodel import select
from collections import Counter,defaultdict
from Nutrition.controller import get_nutrition_by_food
from Prediction.schema import WeeklyTrend,Macronutrients,MealSummary,DashboardStatistics,RecentActivity,DashboardAnalyticsResponse
def save_prediction(prediction: Prediction,session: Session):
    session.add(prediction)
    session.commit()
    session.refresh(prediction)
    return prediction

def get_user_predictions(user_id: int,session: Session):
    statement = select(Prediction).where(Prediction.user_id == user_id)
    return session.exec(statement).all()

def get_all_predictions(session: Session):
    statement = select(Prediction)
    return session.exec(statement).all()

def get_today_predictions(user_id: int,session: Session):
    today = date.today()
    statement = select(Prediction).where(Prediction.user_id == user_id)
    predictions = session.exec(statement).all()
    return [p for p in predictions
        if p.created_at.date() == today]

def get_weekly_predictions(user_id: int,session: Session):
    one_week_ago = datetime.utcnow() - timedelta(days=7)
    statement = (select(Prediction).where(Prediction.user_id == user_id).where(Prediction.created_at >= one_week_ago))
    return session.exec(statement).all()

def get_monthly_predictions(user_id: int,session: Session):
    now = datetime.utcnow()
    statement = (select(Prediction).where(Prediction.user_id == user_id))
    predictions = session.exec(statement).all()
    return [p for p in predictions if p.created_at.year == now.year and p.created_at.month == now.month]


def get_top_foods(user_id: int,session: Session):
    statement = select(Prediction).where(Prediction.user_id == user_id)
    predictions = session.exec(statement).all()
    food_counter = Counter(prediction.food_name for prediction in predictions)
    top_foods = [
        {"food_name": food,"count": count}
        for food, count in food_counter.most_common(5)]
    return top_foods

def delete_prediction(prediction_id: int,session: Session):
    prediction = session.get(Prediction,prediction_id)
    if prediction is None:
        return None
    session.delete(prediction)
    session.commit()
    return prediction

def get_user_predictions_paginated(user_id: int,page: int,limit: int,session: Session):

    offset = (page - 1) * limit
    total_records = len(session.exec(select(Prediction).where(Prediction.user_id == user_id)).all())
    predictions = session.exec(select(Prediction).where(Prediction.user_id == user_id).offset(offset).limit(limit)).all()

    return predictions, total_records

def get_all_predictions_paginated(page: int,limit: int,session: Session):
    offset = (page - 1) * limit
    total_records = len(session.exec(select(Prediction)).all())
    predictions = session.exec(select(Prediction).order_by(Prediction.created_at.desc()).offset(offset).limit(limit)).all()
    return predictions, total_records

def get_weekly_trend(user_id: int, session: Session):

    predictions = get_weekly_predictions(user_id, session)

    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    calories_by_day = defaultdict(float)

    for prediction in predictions:
        day = prediction.created_at.strftime("%a")
        calories_by_day[day] += prediction.calories

    trend = []

    for day in days:
        trend.append(
            WeeklyTrend(
                day=day,
                calories=round(calories_by_day.get(day, 0), 2)
            )
        )

    return trend

def get_dashboard_statistics(user_id: int, session: Session):

    predictions = get_user_predictions(user_id, session)

    if not predictions:

        return DashboardStatistics(
            total_predictions=0,
            average_calories=0,
            average_confidence=0,
            highest_calorie_meal=MealSummary(food="-", calories=0),
            lowest_calorie_meal=MealSummary(food="-", calories=0),
        )

    highest = max(predictions, key=lambda x: x.calories)
    lowest = min(predictions, key=lambda x: x.calories)

    return DashboardStatistics(
        total_predictions=len(predictions),

        average_calories=round(sum(p.calories for p in predictions) / len(predictions),2),
        average_confidence=round(sum(p.confidence for p in predictions) / len(predictions),2),
        highest_calorie_meal=MealSummary(food=highest.food_name,calories=highest.calories),
        lowest_calorie_meal=MealSummary(food=lowest.food_name,calories=lowest.calories),)

def get_recent_activity(user_id: int, session: Session):

    predictions = sorted(get_user_predictions(user_id, session),key=lambda x: x.created_at,reverse=True,)
    activities = []
    for prediction in predictions[:10]:
        activities.append(
            RecentActivity(food=prediction.food_name,calories=prediction.calories,confidence=prediction.confidence,time=prediction.created_at.strftime("%d %b %Y %I:%M %p"))
        )

    return activities

def get_dashboard_analytics(user_id: int, session: Session):

    weekly_predictions = get_weekly_predictions(user_id, session)
    protein = round(sum(p.protein for p in weekly_predictions), 2)
    fat = round(sum(p.fat for p in weekly_predictions), 2)
    carbohydrates = round(sum(p.carbohydrates for p in weekly_predictions), 2)

    return DashboardAnalyticsResponse(

        weekly_trend=get_weekly_trend(user_id, session),

        macronutrients=Macronutrients(protein=protein,fat=fat,carbohydrates=carbohydrates),
        statistics=get_dashboard_statistics(user_id, session),
        recent_activity=get_recent_activity(user_id, session),
        top_foods=get_top_foods(user_id, session)
    )

def update_prediction(prediction_id: int,food_name: str,weight: float,session: Session,):
    """
    Updates the prediction after user correction.
    Recalculates all nutrition values based on the corrected food and weight.
    """

    prediction = session.get(Prediction, prediction_id)
    if prediction is None:
        return None

    # Get nutrition for corrected food
    nutrition = get_nutrition_by_food(food_name)

    if nutrition is None:
        return "food_not_found"

    # Recalculate nutrition
    prediction.food_name = food_name
    prediction.weight_grams = weight

    prediction.calories = round((nutrition.calories_per_100g * weight) / 100,2,)
    prediction.protein = round((nutrition.protein * weight) / 100,2,)
    prediction.fat = round((nutrition.fat * weight) / 100,2,)
    prediction.carbohydrates = round((nutrition.carbohydrates * weight) / 100,2,)
    prediction.fiber = round((nutrition.fiber * weight) / 100,2,)
    prediction.sugar = round((nutrition.sugar * weight) / 100,2,)
    session.add(prediction)
    session.commit()
    session.refresh(prediction)
    return prediction