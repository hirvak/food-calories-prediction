from sqlmodel import Session, select
from Prediction.models import Prediction
from datetime import datetime, date
from sqlmodel import select

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


