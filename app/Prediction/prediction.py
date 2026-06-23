from fastapi import APIRouter, UploadFile, File, Form
from Nutrition.controller import get_nutrition_by_food
from ML.model_loader import model
from PIL import Image

router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)

@router.post("/predict")
async def predict_food(
    image: UploadFile = File(...),
    weight: float = Form(...)
):

    img = Image.open(image.file)

    results = model.predict(
        source=img,
        conf=0.25
    )

    boxes = results[0].boxes

    if len(boxes) == 0:
        return {
            "message": "No food detected"
        }

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