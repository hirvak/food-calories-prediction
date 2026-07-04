"""
Reports/schema.py

Internal data-transfer structures used to pass information between
ReportService -> report generators (pdf/csv/excel). These are plain
dataclasses, not pydantic response models, because the report endpoints
return files (StreamingResponse), not JSON.
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Dict, Any

from Prediction.models import Prediction
from Users.models import User


@dataclass
class PeriodSummary:
    """Aggregated nutrition totals for a time period (today/week/month)."""
    foods_consumed: int = 0
    total_calories: float = 0.0
    total_protein: float = 0.0
    total_fat: float = 0.0
    total_carbohydrates: float = 0.0
    total_fiber: float = 0.0
    total_sugar: float = 0.0


@dataclass
class TopFood:
    food_name: str
    count: int


@dataclass
class UserReportData:
    """Everything needed to render a single user's PDF/CSV/Excel report."""
    user: User
    predictions: List[Prediction]
    today: PeriodSummary
    weekly: PeriodSummary
    monthly: PeriodSummary
    top_foods: List[TopFood]
    generated_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class AdminPredictionRow:
    """A single prediction row joined with its owning user, for admin exports."""
    prediction: Prediction
    user_name: str
    user_email: str


@dataclass
class AdminReportData:
    """Everything needed to render the platform-wide admin report."""
    total_users: int
    total_admins: int
    total_predictions: int
    total_calories: float
    top_foods: List[TopFood]
    latest_predictions: List[AdminPredictionRow]
    all_predictions: List[AdminPredictionRow]
    generated_at: datetime = field(default_factory=datetime.utcnow)
