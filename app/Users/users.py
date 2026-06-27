from fastapi import APIRouter,Depends
from sqlmodel import Session
from fastapi import Depends
from Utils.utils import get_session
from Security.security import get_current_user
from fastapi import HTTPException
from Users.controller import get_dashboard_stats,get_user_profile_stats

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
        "total_predictions": stats[
            "total_predictions"
        ],
        "total_calories_consumed": stats[
            "total_calories_consumed"
        ]
    }