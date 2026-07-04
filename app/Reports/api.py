"""
Reports/api.py

Registers the six report download endpoints. User endpoints require a
valid JWT (get_current_user). Admin endpoints additionally require the
admin role (admin_only), reusing the existing Security dependency.
"""

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlmodel import Session

from Utils.utils import get_session
from Security.security import get_current_user, admin_only
from Users.models import User
from Reports.controller import ReportController

router = APIRouter(prefix="/reports", tags=["Reports"])


# ---------- user reports ----------

@router.get("/pdf", response_class=StreamingResponse)
def download_user_pdf_report(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Download a PDF nutrition report for the logged-in user."""
    return ReportController.user_pdf(current_user, session)


@router.get("/excel", response_class=StreamingResponse)
def download_user_excel_report(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Download an Excel workbook with predictions + summary for the logged-in user."""
    return ReportController.user_excel(current_user, session)


# ---------- admin reports ----------

@router.get("/admin/pdf", response_class=StreamingResponse)
def download_admin_pdf_report(
    session: Session = Depends(get_session),
    current_user: User = Depends(admin_only),
):
    """Download the platform-wide analytics PDF report. Admin only."""
    return ReportController.admin_pdf(session)


@router.get("/admin/excel", response_class=StreamingResponse)
def download_admin_excel_report(
    session: Session = Depends(get_session),
    current_user: User = Depends(admin_only),
):
    """Download the platform-wide Excel workbook. Admin only."""
    return ReportController.admin_excel(session)
