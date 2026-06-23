from sqlmodel import create_engine, Session
from dotenv import load_dotenv
from Users.models import User
from sqlmodel import Session, select

import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL,echo=False)

def get_session():
    with Session(engine) as session:
        yield session

def get_user(email: str,session: Session):
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()