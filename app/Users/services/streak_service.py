from datetime import datetime, date, timezone
from typing import Optional
from sqlmodel import Session, select
from Users.models import User
from Prediction.models import Prediction


def get_app_timezone():
    # Extensible for per-user timezone support later
    return timezone.utc


def get_local_date(dt: datetime, tz=None) -> date:
    if tz is None:
        tz = get_app_timezone()
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(tz).date()


def get_active_streak_state(user: User) -> dict:
    """
    Evaluates the user's current streak state in-memory without database writes.
    Keeps GET requests idempotent.
    """
    if user.last_meal_logged_date:
        today_local = get_local_date(datetime.utcnow())
        days_gap = (today_local - user.last_meal_logged_date).days
        if days_gap > 1:
            return {
                "current_streak": 0,
                "longest_streak": user.longest_streak,
                "last_meal_logged_date": user.last_meal_logged_date,
                "is_active": False
            }
        return {
            "current_streak": user.current_streak,
            "longest_streak": user.longest_streak,
            "last_meal_logged_date": user.last_meal_logged_date,
            "is_active": True
        }
    return {
        "current_streak": 0,
        "longest_streak": user.longest_streak,
        "last_meal_logged_date": None,
        "is_active": False
    }


def update_streak(user: User, meal_datetime: datetime, session: Session) -> bool:
    """
    Performs an efficient incremental update on a new logged meal.
    Returns True if the streak was updated/started today, False otherwise.
    """
    meal_date = get_local_date(meal_datetime)
    
    if user.last_meal_logged_date is None:
        # First meal ever logged
        user.current_streak = 1
        user.longest_streak = max(user.longest_streak, 1)
        user.last_meal_logged_date = meal_date
        session.add(user)
        session.commit()
        session.refresh(user)
        return True
        
    days_gap = (meal_date - user.last_meal_logged_date).days
    
    if days_gap == 0:
        # Multiple meals logged on the same day -> no-op
        return False
    elif days_gap == 1:
        # Consecutive daily logging
        user.current_streak += 1
        user.longest_streak = max(user.longest_streak, user.current_streak)
        user.last_meal_logged_date = meal_date
        session.add(user)
        session.commit()
        session.refresh(user)
        return True
    elif days_gap > 1:
        # Missed one or more days -> reset to 1
        user.current_streak = 1
        user.longest_streak = max(user.longest_streak, 1)
        user.last_meal_logged_date = meal_date
        session.add(user)
        session.commit()
        session.refresh(user)
        return True
    else:
        # Backdated / historical meal (days_gap < 0) -> trigger full recalculation
        recalculate_streak(user.id, session)
        return True


def recalculate_streak(user_id: int, session: Session):
    """
    Performs a complete chronological scan of unique logged meal dates in ascending order
    to compute the correct current streak and longest streak.
    """
    user = session.get(User, user_id)
    if not user:
        return
        
    predictions = session.exec(select(Prediction).where(Prediction.user_id == user_id)).all()
    
    if not predictions:
        user.current_streak = 0
        user.longest_streak = 0
        user.last_meal_logged_date = None
        session.add(user)
        session.commit()
        session.refresh(user)
        return
        
    # Extract unique dates sorted in ascending chronological order
    unique_dates = sorted(list({get_local_date(p.created_at) for p in predictions}))
    
    curr = 1
    longest = 1
    
    for i in range(1, len(unique_dates)):
        diff = (unique_dates[i] - unique_dates[i-1]).days
        if diff == 1:
            curr += 1
        else:
            curr = 1
        if curr > longest:
            longest = curr
            
    # Check if the streak is broken as of today (local time)
    today_local = get_local_date(datetime.utcnow())
    days_gap_from_last = (today_local - unique_dates[-1]).days
    
    if days_gap_from_last > 1:
        current_streak = 0
    else:
        current_streak = curr
        
    user.current_streak = current_streak
    user.longest_streak = longest
    user.last_meal_logged_date = unique_dates[-1]
    
    session.add(user)
    session.commit()
    session.refresh(user)
