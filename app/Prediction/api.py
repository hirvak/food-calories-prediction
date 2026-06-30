from fastapi import APIRouter, UploadFile, File, Form,Query
from Nutrition.controller import get_nutrition_by_food
from ML.model_loader import model
from sqlmodel import Session
from fastapi import Depends
from Utils.utils import get_session
from Security.security import get_current_user
from Prediction.models import Prediction
from fastapi import HTTPException
from Prediction.controller import get_user_predictions,get_all_predictions,save_prediction,get_today_predictions,get_weekly_predictions,get_monthly_predictions,get_top_foods,delete_prediction,get_user_predictions_paginated,get_all_predictions_paginated
from fastapi import HTTPException
from PIL import Image

router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)

@router.post("/predict")
async def predict_food(image: UploadFile = File(...),weight: float = Form(...),session: Session = Depends(get_session),current_user = Depends(get_current_user)):

    img = Image.open(image.file)
    results = model.predict(source=img,conf=0.25)
    boxes = results[0].boxes
    if len(boxes) == 0:
        return {"message": "No food detected"}
    cls_id = int(boxes[0].cls[0])
    confidence = float(boxes[0].conf[0])
    food_name = model.names[cls_id]
    nutrition = get_nutrition_by_food(food_name)
    calories = (nutrition.calories_per_100g * weight) / 100
    protein = (nutrition.protein * weight) / 100
    fat = (nutrition.fat * weight) / 100
    carbohydrates = (nutrition.carbohydrates * weight) / 100
    fiber = (nutrition.fiber * weight) / 100
    sugar = (nutrition.sugar * weight) / 100

    prediction = Prediction(
        user_id=current_user.id,
        food_name=food_name,
        weight_grams=weight,
        calories=round(calories, 2),
        protein=round(protein, 2),
        fat=round(fat, 2),
        carbohydrates=round(carbohydrates, 2),
        fiber=round(fiber, 2),
        sugar=round(sugar, 2),
        confidence=round(confidence, 2),
        image_path=None)

    save_prediction(prediction,session)
    return {
        "food_name": food_name,
        "confidence": round(confidence, 2),
        "weight": weight,
        "nutrition": {
            "calories": round(calories, 2),
            "protein": round(protein, 2),
            "fat": round(fat, 2),
            "carbohydrates": round(carbohydrates, 2),
            "fiber": round(fiber, 2),
            "sugar": round(sugar, 2)
        }
    }

@router.get("/history")
def prediction_history(page: int = Query(1, ge=1),limit: int = Query(10, ge=1, le=100),session: Session = Depends(get_session),current_user = Depends(get_current_user)):

    predictions, total_records = get_user_predictions_paginated(current_user.id,page,limit,session)
    return {
        "user": {"id": current_user.id,"name": current_user.name,"email": current_user.email,"role": current_user.role},
        "page": page,"limit": limit,"total_records": total_records,"total_pages": (total_records + limit - 1) // limit,"predictions": predictions}

@router.get("/all-history")
def all_prediction_history(page: int = Query(1, ge=1),limit: int = Query(10, ge=1, le=100),session: Session = Depends(get_session),current_user = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403,detail="Only admin can access this endpoint")
    predictions, total_records = get_all_predictions_paginated(page,limit,session)
    return {
        "page": page,"limit": limit,"total_records": total_records,"total_pages": (total_records + limit - 1) // limit,"predictions": predictions}

@router.get("/today-summary")
def today_summary(session: Session = Depends(get_session),current_user = Depends(get_current_user)):

    predictions = get_today_predictions(current_user.id,session)
    total_calories = sum(p.calories for p in predictions)
    total_protein = sum(p.protein for p in predictions)
    total_fat = sum(p.fat for p in predictions)
    total_carbohydrates = sum(p.carbohydrates for p in predictions)

    return {
        "user": current_user.name,
        "foods_consumed": len(predictions),
        "total_calories": round(total_calories, 2),
        "total_protein": round(total_protein, 2),
        "total_fat": round(total_fat, 2),
        "total_carbohydrates": round(total_carbohydrates,2)
    }

@router.get("/weekly-summary")
def weekly_summary(session: Session = Depends(get_session),current_user = Depends(get_current_user)):

    predictions = get_weekly_predictions(current_user.id,session)
    total_calories = sum(p.calories for p in predictions)
    total_protein = sum(p.protein for p in predictions)
    total_fat = sum(p.fat for p in predictions)
    total_carbohydrates = sum(p.carbohydrates for p in predictions)
    total_fiber = sum(p.fiber for p in predictions)
    total_sugar = sum(p.sugar for p in predictions)

    return {
        "user": current_user.name,
        "foods_consumed": len(predictions),
        "total_calories": round(total_calories, 2),
        "total_protein": round(total_protein, 2),
        "total_fat": round(total_fat, 2),
        "total_carbohydrates": round(total_carbohydrates, 2),
        "total_fiber": round(total_fiber, 2),
        "total_sugar": round(total_sugar, 2)
    }

@router.get("/monthly-summary")
def monthly_summary(session: Session = Depends(get_session),current_user = Depends(get_current_user)):
    predictions = get_monthly_predictions(current_user.id,session)
    total_calories = sum(p.calories for p in predictions)
    total_protein = sum(p.protein for p in predictions)
    total_fat = sum(p.fat for p in predictions)
    total_carbohydrates = sum(p.carbohydrates for p in predictions)
    total_fiber = sum(p.fiber for p in predictions)
    total_sugar = sum(p.sugar for p in predictions)
    return {
        "user": current_user.name,
        "foods_consumed": len(predictions),
        "total_calories": round(total_calories, 2),
        "total_protein": round(total_protein, 2),
        "total_fat": round(total_fat, 2),
        "total_carbohydrates": round(total_carbohydrates, 2),
        "total_fiber": round(total_fiber, 2),
        "total_sugar": round(total_sugar, 2)
    }

@router.get("/top-foods")
def top_foods(session: Session = Depends(get_session),current_user = Depends(get_current_user)):
    foods = get_top_foods(current_user.id,session)
    return {"user": current_user.name,"top_foods": foods}


@router.delete("/{prediction_id}")
def remove_prediction(prediction_id: int,session: Session = Depends(get_session),current_user = Depends(get_current_user)):
    prediction = session.get(Prediction, prediction_id)
    if prediction is None:
        raise HTTPException(status_code=404,detail="Prediction not found")
    if (current_user.role != "admin" and prediction.user_id != current_user.id):
        raise HTTPException(status_code=403,detail="You are not authorized to delete this prediction")

    delete_prediction(prediction_id,session)
    return {"message": "Prediction deleted successfully"}