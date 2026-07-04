"""
Reports/service.py

ReportService is a thin data-access layer for the Reports module.
It NEVER builds files - it only fetches and aggregates data by
reusing the existing Prediction and Users controllers so calorie
calculations and query logic are never duplicated.
"""

from collections import Counter
from typing import List

from sqlmodel import Session

from Prediction.controller import (
    get_user_predictions,
    get_all_predictions,
    get_today_predictions,
    get_weekly_predictions,
    get_monthly_predictions,
    get_top_foods,
)
from Prediction.models import Prediction
from Users.controller import fetch_all_users
from Users.models import User

from Reports.schema import (
    PeriodSummary,
    TopFood,
    UserReportData,
    AdminPredictionRow,
    AdminReportData,
)


class ReportService:
    """Fetches and aggregates data needed by the report generators."""

    # ---------- shared helpers ----------

    @staticmethod
    def _summarize(predictions: List[Prediction]) -> PeriodSummary:
        """Aggregate nutrition totals for a list of predictions."""
        return PeriodSummary(
            foods_consumed=len(predictions),
            total_calories=round(sum(p.calories for p in predictions), 2),
            total_protein=round(sum(p.protein for p in predictions), 2),
            total_fat=round(sum(p.fat for p in predictions), 2),
            total_carbohydrates=round(sum(p.carbohydrates for p in predictions), 2),
            total_fiber=round(sum(p.fiber for p in predictions), 2),
            total_sugar=round(sum(p.sugar for p in predictions), 2),
        )

    @staticmethod
    def _top_foods_from(predictions: List[Prediction], limit: int = 10) -> List[TopFood]:
        """Compute the most frequently detected foods for a list of predictions."""
        counter = Counter(p.food_name for p in predictions)
        return [TopFood(food_name=name, count=count) for name, count in counter.most_common(limit)]

    # ---------- user reports ----------

    @staticmethod
    def get_user_report_data(user: User, session: Session) -> UserReportData:
        """Gather everything needed to render a user's PDF/CSV/Excel report."""
        predictions = get_user_predictions(user.id, session)
        today_predictions = get_today_predictions(user.id, session)
        weekly_predictions = get_weekly_predictions(user.id, session)
        monthly_predictions = get_monthly_predictions(user.id, session)
        top_foods_raw = get_top_foods(user.id, session)  # [{"food_name": ..., "count": ...}, ...]

        return UserReportData(
            user=user,
            predictions=sorted(predictions, key=lambda p: p.created_at, reverse=True),
            today=ReportService._summarize(today_predictions),
            weekly=ReportService._summarize(weekly_predictions),
            monthly=ReportService._summarize(monthly_predictions),
            top_foods=[TopFood(food_name=f["food_name"], count=f["count"]) for f in top_foods_raw],
        )

    # ---------- admin reports ----------

    @staticmethod
    def _join_with_users(predictions: List[Prediction], users: List[User]) -> List[AdminPredictionRow]:
        """Join predictions with their owning user's name/email for admin exports."""
        users_by_id = {u.id: u for u in users}
        rows = []
        for prediction in predictions:
            owner = users_by_id.get(prediction.user_id)
            rows.append(
                AdminPredictionRow(
                    prediction=prediction,
                    user_name=owner.name if owner else "Unknown",
                    user_email=owner.email if owner else "Unknown",
                )
            )
        return rows

    @staticmethod
    def get_admin_report_data(session: Session) -> AdminReportData:
        """Gather platform-wide statistics for the admin report."""
        users = fetch_all_users(session)
        predictions = get_all_predictions(session)

        total_users = len(users)
        total_admins = sum(1 for u in users if u.role == "admin")
        total_calories = round(sum(p.calories for p in predictions), 2)

        all_rows = ReportService._join_with_users(predictions, users)
        latest_rows = sorted(all_rows, key=lambda r: r.prediction.created_at, reverse=True)[:20]

        return AdminReportData(
            total_users=total_users,
            total_admins=total_admins,
            total_predictions=len(predictions),
            total_calories=total_calories,
            top_foods=ReportService._top_foods_from(predictions, limit=10),
            latest_predictions=latest_rows,
            all_predictions=all_rows,
        )
