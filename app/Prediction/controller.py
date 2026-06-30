from sqlmodel import Session, select
from Prediction.models import Prediction
from datetime import datetime, date,timedelta
from sqlmodel import select
from collections import Counter

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
    predictions = session.exec(select(Prediction).offset(offset).limit(limit)).all()
    return predictions, total_records