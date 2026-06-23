from pydantic import BaseModel

class PredictionResponse(BaseModel):
    food_name: str
    confidence: float
    calories: float