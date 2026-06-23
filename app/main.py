from fastapi import FastAPI
from sqlmodel import SQLModel
from Utils.utils import engine
from Auth.auth import router as auth_router
from Prediction.prediction import router as prediction_router


app = FastAPI()

@app.on_event("startup")
def startup():

    SQLModel.metadata.create_all(engine)

app.include_router(auth_router)

app.include_router(prediction_router)