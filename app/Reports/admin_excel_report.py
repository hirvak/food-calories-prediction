"""
Reports/admin_excel_report.py

Builds a three-sheet Excel workbook (Platform Summary + Predictions + Top Foods)
for admins.
"""

from io import BytesIO

from openpyxl import Workbook

from Reports.schema import AdminReportData
from Reports._excel_common import (
    write_title, write_header_row, write_data_rows, auto_size_columns, LABEL_FONT,
)

PREDICTION_HEADERS = [
    "Date", "User Name", "Email", "Food", "Weight (g)",
    "Calories", "Protein", "Fat", "Carbohydrates", "Fiber", "Sugar", "Accuracy",
]


def _build_summary_sheet(sheet, data: AdminReportData):
    write_title(sheet, "NutriLens - Platform Summary")
    sheet.cell(row=3, column=1, value="Metric").font = LABEL_FONT
    fields = [
        ("Total Users", data.total_users),
        ("Total Admins", data.total_admins),
        ("Total Meal Scans", data.total_predictions),
        ("Total Calories Logged", data.total_calories),
    ]
    for offset, (label, value) in enumerate(fields, start=1):
        sheet.cell(row=3 + offset, column=1, value=label)
        sheet.cell(row=3 + offset, column=2, value=value)
    auto_size_columns(sheet)


def _build_predictions_sheet(sheet, data: AdminReportData):
    write_title(sheet, "All Meal Scans")
    write_header_row(sheet, row_index=3, headers=PREDICTION_HEADERS)

    rows = [
        [
            row.prediction.created_at.strftime("%d-%m-%Y %H:%M"),
            row.user_name,
            row.user_email,
            row.prediction.food_name,
            row.prediction.weight_grams,
            row.prediction.calories,
            row.prediction.protein,
            row.prediction.fat,
            row.prediction.carbohydrates,
            row.prediction.fiber,
            row.prediction.sugar,
            row.prediction.confidence,
        ]
        for row in data.all_predictions
    ]
    write_data_rows(sheet, start_row=4, rows=rows)
    auto_size_columns(sheet)


def _build_top_foods_sheet(sheet, data: AdminReportData):
    write_title(sheet, "Top Foods")
    write_header_row(sheet, row_index=3, headers=["Food", "Frequency"])
    write_data_rows(sheet, start_row=4, rows=[[f.food_name, f.count] for f in data.top_foods])
    auto_size_columns(sheet)


def build_admin_excel(data: AdminReportData) -> BytesIO:
    """Render the platform-wide workbook and return it as a BytesIO buffer."""
    workbook = Workbook()

    summary_sheet = workbook.active
    summary_sheet.title = "Platform Summary"
    _build_summary_sheet(summary_sheet, data)

    predictions_sheet = workbook.create_sheet("Meal Scans")
    _build_predictions_sheet(predictions_sheet, data)

    top_foods_sheet = workbook.create_sheet("Top Scanned Foods")
    _build_top_foods_sheet(top_foods_sheet, data)

    buffer = BytesIO()
    workbook.save(buffer)
    buffer.seek(0)
    return buffer
