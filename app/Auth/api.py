from fastapi import APIRouter
from sqlmodel import Session
from Utils.utils import get_session
from Auth.schema import UserCreate
from Users.models import User
from Auth.schema import UserResponse
from Security.security import hash_password
from Auth.schema import (UserLogin,Token)
from Security.security import (get_current_user)
from Security.security import (authenticate_user,create_access_token)
from Utils.utils import get_user
from fastapi import Depends, HTTPException

router = APIRouter(prefix="/auth",tags=["Authentication"])

@router.post("/register")
def register_user(user: UserCreate,session: Session = Depends(get_session)):

    existing_user = get_user(user.email,session)

    if existing_user:
        raise HTTPException(status_code=400,detail="Email already exists")

    db_user = User(name=user.name,email=user.email,hashed_password=hash_password(user.password),role=user.role)

    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return { "message": "User registered successfully"}

@router.post("/login",response_model=Token)
def login_user(user: UserLogin,session: Session = Depends(get_session)):

    db_user = get_user(user.email,session)

    if not db_user:
        raise HTTPException(status_code=401,detail="Invalid credentials")

    if not authenticate_user(user.password,db_user.hashed_password):
        raise HTTPException(status_code=401,detail="Invalid credentials")

    access_token = create_access_token(
        {
            "sub": db_user.email,
            "role": db_user.role
        }
    )

    return {"access_token": access_token,"token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user=Depends(get_current_user)):
    return current_user