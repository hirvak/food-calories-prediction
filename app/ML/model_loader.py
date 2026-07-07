from ultralytics import YOLO
import os

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "best.pt"
)

model = YOLO(MODEL_PATH)