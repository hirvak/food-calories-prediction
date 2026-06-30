from fastapi import APIRouter,Depends,Query
from sqlmodel import Session
from fastapi import Depends
from Utils.utils import get_session
from Security.security import get_current_user
from fastapi import HTTPException
from Users.controller import get_dashboard_stats,get_user_profile_stats,update_profile,fetch_all_users,delete_user_by_id,change_password,fetch_all_users_paginated
from Users.schema import UpdateProfile,ChangePassword
from Users.models import User

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)
@router.get("/admin-dashboard")
def admin_dashboard(session: Session = Depends(get_session),current_user = Depends(get_current_user)):

    if current_user.role != "admin":
        raise HTTPException(status_code=403,detail="Admins only")
    return get_dashboard_stats(session)


@router.get("/profile")
def get_profile(session: Session = Depends(get_session),current_user = Depends(get_current_user)):

    stats = get_user_profile_stats(current_user.id,session)
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "member_since": current_user.created_at,
        "total_predictions": stats["total_predictions"],
        "total_calories_consumed": stats["total_calories_consumed"]
    }

@router.patch("/update-profile")
def update_user_profile(data: UpdateProfile,session: Session = Depends(get_session),current_user = Depends(get_current_user)):
    user = update_profile(current_user,data,session)

    return {"message": "Profile updated successfully.",
        "user": {"id": user.id,"name": user.name,"email": user.email,"role": user.role}}


@router.get("/admin/users")
def get_all_users(page: int = Query(1, ge=1),limit: int = Query(10, ge=1, le=100),session: Session = Depends(get_session),current_user = Depends(get_current_user)):

    if current_user.role != "admin":
        raise HTTPException(status_code=403,detail="Only admin can access this API.")
    users, total_records = fetch_all_users_paginated(page,limit,session)
    return {
        "page": page,
        "limit": limit,
        "total_records": total_records,
        "total_pages": (total_records + limit - 1) // limit,
        "users": [{"id": user.id,"name": user.name,"email": user.email,"role": user.role}
            for user in users]}

@router.delete("/admin/delete-user/{user_id}")
def delete_user(user_id: int,session: Session = Depends(get_session),current_user = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403,detail="Only admin can delete users.")
    if current_user.id == user_id:
        raise HTTPException(status_code=400,detail="You cannot delete your own account.")

    user = session.get(User, user_id)

    if user is None:
        raise HTTPException(status_code=404,detail="User not found.")

    if user.role == "admin":
        raise HTTPException(status_code=400,detail="Cannot delete another admin.")
    delete_user_by_id(user_id,session)
    return {"message": "User deleted successfully."}

@router.patch("/change-password")
def update_password(data: ChangePassword,session: Session = Depends(get_session),current_user = Depends(get_current_user)):
    change_password(current_user,data,session)
    return {"message": "Password changed successfully."}