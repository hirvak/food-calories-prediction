from fastapi import FastAPI
from sqlmodel import SQLModel
from Utils.utils import engine
from Auth.api import router as auth_router
from Prediction.api import router as prediction_router
from Users.api import router as user_router
from Reports.api import router as report_router
from fastapi.middleware.cors import CORSMiddleware
from Nutrition.api import router as nutrition_router
app = FastAPI()


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.on_event("startup")
def startup():

    SQLModel.metadata.create_all(engine)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(prediction_router)
app.include_router(report_router)
app.include_router(nutrition_router)