from pydantic import BaseModel, EmailStr
from sqlmodel import SQLModel, Field

class UserCreate(BaseModel):

    name: str
    email: EmailStr
    password: str
    role: str = Field(default="user")

class UserLogin(BaseModel):

    email: EmailStr
    password: str

class UserResponse(BaseModel):

    id: int
    name: str
    email: EmailStr
    role: str
    is_active: bool


class Token(BaseModel):

    access_token: str
    token_type: str