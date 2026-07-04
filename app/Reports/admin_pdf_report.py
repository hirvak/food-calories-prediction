"""
Reports/admin_pdf_report.py

Builds a professional platform-wide analytics PDF report. Only lays out
data already fetched by ReportService - never queries the database.
"""

from io import BytesIO
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle

from Reports.schema import AdminReportData
from Reports._pdf_common import (
    get_styles, styled_table, footer_canvas, PAGE_SIZE, MARGIN,
    PRIMARY_BLUE, LIGHT_BG, BORDER_COLOR, DARK_TEXT, MUTED_TEXT, WHITE,
    get_logo_drawing,
)

def _header_section(data: AdminReportData):
    logo = get_logo_drawing(30)
    
    # Left column: logo + title
    left_table = Table(
        [
            [logo, Table([
                [Paragraph("<b>NutriLens</b>", ParagraphStyle('HeaderTitle', fontName='Helvetica-Bold', fontSize=15, leading=16, textColor=DARK_TEXT))],
                [Paragraph("Smart Nutrition Analytics Platform", ParagraphStyle('HeaderSubtitle', fontName='Helvetica', fontSize=7.5, leading=9, textColor=MUTED_TEXT))]
            ], colWidths=[10 * cm], rowHeights=[18, 12])]
        ],
        colWidths=[1.1 * cm, 10 * cm]
    )
    left_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))

    # Right column: generated meta
    gen_date = data.generated_at.strftime('%Y-%m-%d')
    gen_time = data.generated_at.strftime('%H:%M UTC')
    right_para = Paragraph(
        f"<b>Report Generated:</b> {gen_date}<br/><b>Time:</b> {gen_time}",
        ParagraphStyle('HeaderMeta', fontName='Helvetica', fontSize=8, leading=11, textColor=MUTED_TEXT, alignment=2)
    )

    header_table = Table(
        [[left_table, right_para]],
        colWidths=[12.5 * cm, 5.5 * cm]
    )
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('LINEBELOW', (0,0), (-1,-1), 0.75, BORDER_COLOR),
    ]))
    return header_table


def _platform_overview(data: AdminReportData, styles):
    rows = [
        ["Total Registered Users", str(data.total_users)],
        ["Total System Administrators", str(data.total_admins)],
        ["Total Meal Scans", str(data.total_predictions)],
        ["Total Calories Logged", f"{data.total_calories:.0f} kcal"],
    ]
    elements = [Paragraph("Platform Overview", styles["SectionHeader"])]
    elements.append(styled_table(["Metric Descriptor", "Database Value"], rows, col_widths=[10 * cm, 8 * cm]))
    elements.append(Spacer(1, 0.4 * cm))
    return elements


def _top_foods_section(data: AdminReportData, styles):
    elements = [Paragraph("Top 10 Scanned Foods", styles["SectionHeader"])]
    if not data.top_foods:
        elements.append(Paragraph("No meal scans recorded yet.", styles["Body"]))
        return elements
    rows = [[food.food_name.capitalize(), str(food.count)] for food in data.top_foods[:10]]
    elements.append(styled_table(["Food Name", "Times Scanned"], rows, col_widths=[12 * cm, 6 * cm]))
    elements.append(Spacer(1, 0.4 * cm))
    return elements


def _latest_predictions_section(data: AdminReportData, styles):
    elements = [Paragraph("Latest 20 Meal Scans", styles["SectionHeader"])]
    if not data.latest_predictions:
        elements.append(Paragraph("No meal scans recorded yet.", styles["Body"]))
        return elements

    rows = [
        [
            row.prediction.created_at.strftime("%Y-%m-%d %H:%M"),
            row.user_name,
            row.prediction.food_name.capitalize(),
            f"{row.prediction.calories:.0f} kcal",
        ]
        for row in data.latest_predictions
    ]
    elements.append(styled_table(
        ["Date & Time", "User", "Food Name", "Calories"],
        rows,
        col_widths=[3.5 * cm, 5.5 * cm, 5.5 * cm, 3.5 * cm],
    ))
    return elements


def build_admin_pdf(data: AdminReportData) -> BytesIO:
    """Render the full admin platform analytics PDF and return it as a BytesIO buffer."""
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=PAGE_SIZE,
        leftMargin=MARGIN, rightMargin=MARGIN, topMargin=MARGIN, bottomMargin=2.0 * cm,
        title="NutriLens - Platform Analytics Report",
    )
    styles = get_styles()
    elements = []

    # Page 1: Header, title, overview, top foods
    elements.append(_header_section(data))
    elements.append(Spacer(1, 0.4 * cm))
    
    elements.append(Paragraph("Platform Analytics Report", styles["CoverTitle"]))
    elements.append(Spacer(1, 0.4 * cm))
    
    elements.extend(_platform_overview(data, styles))
    elements.extend(_top_foods_section(data, styles))
    
    # PageBreak to separate onto page 2
    elements.append(PageBreak())

    # Page 2: Header, latest 20 scans
    elements.append(_header_section(data))
    elements.append(Spacer(1, 0.4 * cm))
    
    elements.extend(_latest_predictions_section(data, styles))

    doc.build(elements, onFirstPage=footer_canvas, onLaterPages=footer_canvas)
    buffer.seek(0)
    return buffer
