"""
Reports/controller.py

ReportController prepares report data via ReportService, calls the correct
file generator, and wraps the result in a StreamingResponse with the right
filename and MIME type. Generation errors are converted to HTTP 500s;
"no data" is converted to HTTP 404.
"""

from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import Session

from Users.models import User
from Reports.service import ReportService

from Reports.pdf_report import build_user_pdf
from Reports.excel_report import build_user_excel

from Reports.admin_pdf_report import build_admin_pdf
from Reports.admin_excel_report import build_admin_excel

PDF_MEDIA_TYPE = "application/pdf"
EXCEL_MEDIA_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"


def _stream(buffer, filename: str, media_type: str) -> StreamingResponse:
    return StreamingResponse(
        buffer,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


from datetime import datetime

class ReportController:
    """Orchestrates data fetching + file generation for all report endpoints."""

    # ---------- user reports ----------

    @staticmethod
    def user_pdf(current_user: User, session: Session) -> StreamingResponse:
        data = ReportService.get_user_report_data(current_user, session)
        if not data.predictions:
            raise HTTPException(status_code=404, detail="No predictions found for this user")
        try:
            buffer = build_user_pdf(data)
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Failed to generate PDF report: {exc}")
        current_date = datetime.utcnow().strftime("%Y-%m-%d")
        filename = f"NutriLens_Nutrition_Report_{current_date}.pdf"
        return _stream(buffer, filename, PDF_MEDIA_TYPE)

   

    @staticmethod
    def user_excel(current_user: User, session: Session) -> StreamingResponse:
        data = ReportService.get_user_report_data(current_user, session)
        if not data.predictions:
            raise HTTPException(status_code=404, detail="No predictions found for this user")
        try:
            buffer = build_user_excel(data)
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Failed to generate Excel report: {exc}")
        current_date = datetime.utcnow().strftime("%Y-%m-%d")
        filename = f"NutriLens_Nutrition_Report_{current_date}.xlsx"
        return _stream(buffer, filename, EXCEL_MEDIA_TYPE)

    # ---------- admin reports ----------

    @staticmethod
    def admin_pdf(session: Session) -> StreamingResponse:
        data = ReportService.get_admin_report_data(session)
        try:
            buffer = build_admin_pdf(data)
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Failed to generate PDF report: {exc}")
        current_date = datetime.utcnow().strftime("%Y-%m-%d")
        filename = f"NutriLens_Platform_Report_{current_date}.pdf"
        return _stream(buffer, filename, PDF_MEDIA_TYPE)


    @staticmethod
    def admin_excel(session: Session) -> StreamingResponse:
        data = ReportService.get_admin_report_data(session)
        try:
            buffer = build_admin_excel(data)
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Failed to generate Excel report: {exc}")
        current_date = datetime.utcnow().strftime("%Y-%m-%d")
        filename = f"NutriLens_Platform_Report_{current_date}.xlsx"
        return _stream(buffer, filename, EXCEL_MEDIA_TYPE)
