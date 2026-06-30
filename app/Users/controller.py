from Prediction.models import Prediction
from sqlmodel import Session,select
from Users.models import User
from collections import Counter
from fastapi import HTTPException
from Security.security import verify_password, hash_password

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
        "most_detected_food": most_detected_food}

def get_user_profile_stats(user_id: int,session: Session):
    predictions = session.exec(select(Prediction).where(Prediction.user_id == user_id)).all()
    total_predictions = len(predictions)
    total_calories = sum(p.calories for p in predictions)
    return {"total_predictions": total_predictions,"total_calories_consumed": round(total_calories,2)}

def update_profile(current_user: User,data,session: Session):
    if data.email and data.email != current_user.email:
        existing_user = session.exec(select(User).where(User.email == data.email)).first()
        if existing_user:
            raise HTTPException(status_code=400,detail="Email already exists.")
        current_user.email = data.email
    if data.name:
        current_user.name = data.name
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user

def fetch_all_users(session: Session):
    return session.exec(select(User)).all()

def delete_user_by_id(user_id: int,session: Session):
    user = session.get(User, user_id)
    if user is None:
        return None
    predictions = session.exec(select(Prediction).where(Prediction.user_id == user_id)).all()
    for prediction in predictions:
        session.delete(prediction)
    session.delete(user)
    session.commit()
    return user


def change_password(current_user,data,session: Session):

    if not verify_password(data.old_password,current_user.hashed_password):
        raise HTTPException(status_code=400,detail="Old password is incorrect.")

    if data.new_password != data.confirm_password:
        raise HTTPException(status_code=400,detail="New password and confirm password do not match.")

    if verify_password(data.new_password,current_user.hashed_password):
        raise HTTPException(status_code=400,detail="New password cannot be the same as the old password.")

    current_user.hashed_password = hash_password(data.new_password)
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user

def fetch_all_users_paginated(page: int,limit: int,session: Session):
    offset = (page - 1) * limit
    total_records = len(session.exec(select(User)).all())
    users = session.exec(select(User).offset(offset).limit(limit)).all()
    return users, total_records