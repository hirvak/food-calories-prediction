from fastapi import APIRouter, UploadFile, File
from ML.model_loader import model
from PIL import Image

router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)

@router.post("/predict")
async def predict_food(
    image: UploadFile = File(...)
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

    food_name = model.names[cls_id]

    confidence = float(boxes[0].conf[0])

    return {
        "food_name": food_name,
        "confidence": round(confidence, 2)
    }