from pydantic import BaseModel, EmailStr
from typing import Optional
from pydantic import BaseModel, Field


class UpdateProfile(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class ChangePassword(BaseModel):
    old_password: str = Field(..., min_length=6)
    new_password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)