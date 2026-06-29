from fastapi import FastAPI
from sqlmodel import SQLModel
from Utils.utils import engine
from Auth.api import router as auth_router
from Prediction.api import router as prediction_router
from Users.api import router as user_router

app = FastAPI()

@app.on_event("startup")
def startup():

    SQLModel.metadata.create_all(engine)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(prediction_router)