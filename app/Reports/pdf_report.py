"""
Reports/pdf_report.py

Builds a professional, multi-page PDF nutrition report for a single user.
Only responsible for laying out data already fetched by ReportService -
never queries the database and never recalculates calories.
"""

from io import BytesIO
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle

from Reports.schema import UserReportData
from Reports._pdf_common import (
    get_styles, styled_table, footer_canvas, PAGE_SIZE, MARGIN,
    PRIMARY_BLUE, LIGHT_BG, BORDER_COLOR, DARK_TEXT, MUTED_TEXT, WHITE,
    get_logo_drawing,
)
from Reports.utils import format_food_name

def _header_section(data: UserReportData):
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


def _user_info_card(data: UserReportData, styles):
    member_since = data.user.created_at.strftime('%B %d, %Y')
    total_records = len(data.predictions)
    gen_date = data.generated_at.strftime('%B %d, %Y')

    left_content = [
        Paragraph(f"<b>Name:</b> {data.user.name}", styles["Body"]),
        Spacer(1, 4),
        Paragraph(f"<b>Email:</b> {data.user.email}", styles["Body"]),
        Spacer(1, 4),
        Paragraph(f"<b>Member Since:</b> {member_since}", styles["Body"]),
    ]
    right_content = [
        Paragraph(f"<b>Total Meal Records:</b> {total_records}", styles["Body"]),
        Spacer(1, 4),
        Paragraph(f"<b>Report Date:</b> {gen_date}", styles["Body"]),
        Spacer(1, 4),
        Paragraph(f"<b>Plan Status:</b> Premium Account", styles["Body"]),
    ]

    card_table = Table([[left_content, right_content]], colWidths=[9.0 * cm, 9.0 * cm])
    card_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    return card_table


def _summary_cards_section(data: UserReportData, styles):
    total_meals = len(data.predictions)
    total_calories = sum(p.calories for p in data.predictions)
    avg_calories = total_calories / total_meals if total_meals > 0 else 0
    most_consumed = data.top_foods[0].food_name if data.top_foods else "None"

    def make_cell(title, value, unit=""):
        p_title = Paragraph(f"<b>{title}</b>", ParagraphStyle('CardTitle', parent=styles['Body'], fontSize=8, leading=9, textColor=MUTED_TEXT, alignment=1))
        p_val = Paragraph(f"<b>{value}</b><font size='7' color='#64748B'> {unit}</font>", ParagraphStyle('CardVal', parent=styles['Body'], fontSize=11, leading=12, textColor=PRIMARY_BLUE, alignment=1))
        
        cell_table = Table([[p_title], [p_val]], colWidths=[4.1 * cm])
        cell_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
            ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 2),
            ('RIGHTPADDING', (0,0), (-1,-1), 2),
        ]))
        return cell_table

    c1 = make_cell("Meals Logged", str(total_meals))
    c2 = make_cell("Total Calories", f"{int(total_calories)}", "kcal")
    c3 = make_cell("Avg Calories", f"{int(avg_calories)}", "kcal")
    c4 = make_cell("Most Consumed", format_food_name(most_consumed))

    spacer_width = 0.2 * cm
    summary_table = Table(
        [[c1, "", c2, "", c3, "", c4]],
        colWidths=[4.1 * cm, spacer_width, 4.1 * cm, spacer_width, 4.1 * cm, spacer_width, 4.1 * cm]
    )
    summary_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    return summary_table


def _comparison_totals_table(data: UserReportData):
    headers = ["Nutritional Metric", "Today's Total", "Weekly Total", "Monthly Total"]
    rows = [
        ["Calories", f"{data.today.total_calories:.0f} kcal", f"{data.weekly.total_calories:.0f} kcal", f"{data.monthly.total_calories:.0f} kcal"],
        ["Protein", f"{data.today.total_protein:.1f} g", f"{data.weekly.total_protein:.1f} g", f"{data.monthly.total_protein:.1f} g"],
        ["Carbohydrates", f"{data.today.total_carbohydrates:.1f} g", f"{data.weekly.total_carbohydrates:.1f} g", f"{data.monthly.total_carbohydrates:.1f} g"],
        ["Fat", f"{data.today.total_fat:.1f} g", f"{data.weekly.total_fat:.1f} g", f"{data.monthly.total_fat:.1f} g"],
        ["Fiber", f"{data.today.total_fiber:.1f} g", f"{data.weekly.total_fiber:.1f} g", f"{data.monthly.total_fiber:.1f} g"],
        ["Sugar", f"{data.today.total_sugar:.1f} g", f"{data.weekly.total_sugar:.1f} g", f"{data.monthly.total_sugar:.1f} g"],
    ]
    return styled_table(headers, rows, col_widths=[5.5 * cm, 4.1 * cm, 4.2 * cm, 4.2 * cm])


def _history_table(data: UserReportData, limit: int = 15):
    recent = data.predictions[:limit]
    if not recent:
        return [Paragraph("No meal scan history logs recorded.", ParagraphStyle('NoData', fontName='Helvetica', fontSize=9, textColor=MUTED_TEXT))]

    rows = [
        [
            p.created_at.strftime("%Y-%m-%d"),
            format_food_name(p.food_name),
            f"{p.weight_grams} g",
            f"{p.calories:.0f} kcal",
            f"{p.protein:.1f} g",
            f"{p.carbohydrates:.1f} g",
            f"{p.fat:.1f} g",
        ]
        for p in recent
    ]
    return [styled_table(
        ["Date", "Food Name", "Weight", "Calories", "Protein", "Carbs", "Fat"],
        rows,
        col_widths=[2.4 * cm, 4.4 * cm, 2.2 * cm, 2.4 * cm, 1.8 * cm, 1.8 * cm, 2.0 * cm],
    )]


def _top_foods_table(data: UserReportData):
    if not data.top_foods:
        return [Paragraph("No top scanned foods recorded.", ParagraphStyle('NoData', fontName='Helvetica', fontSize=9, textColor=MUTED_TEXT))]
    
    rows = [[format_food_name(food.food_name), str(food.count)] for food in data.top_foods[:5]]
    return [styled_table(["Food Name", "Times Scanned"], rows, col_widths=[12.0 * cm, 6.0 * cm])]


def build_user_pdf(data: UserReportData) -> BytesIO:
    """Render the full user nutrition report PDF and return it as a BytesIO buffer."""
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=PAGE_SIZE,
        leftMargin=MARGIN, rightMargin=MARGIN, topMargin=MARGIN, bottomMargin=2.0 * cm,
        title="NutriLens - Nutrition Analysis Report",
    )
    styles = get_styles()
    elements = []

    # --- PAGE 1: Header, User info, Summary Cards, Comparison totals ---
    elements.append(_header_section(data))
    elements.append(Spacer(1, 0.4 * cm))
    
    elements.append(Paragraph("Nutrition Analysis Report", styles["CoverTitle"]))
    elements.append(Spacer(1, 0.4 * cm))
    
    elements.append(Paragraph("User Profile Summary", styles["SectionHeader"]))
    elements.append(_user_info_card(data, styles))
    elements.append(Spacer(1, 0.4 * cm))
    
    elements.append(Paragraph("Nutrition Overview", styles["SectionHeader"]))
    elements.append(_summary_cards_section(data, styles))
    elements.append(Spacer(1, 0.4 * cm))
    
    elements.append(Paragraph("Nutrition Historical Totals", styles["SectionHeader"]))
    elements.append(_comparison_totals_table(data))
    
    # PageBreak to separate onto page 2
    elements.append(PageBreak())

    # --- PAGE 2: Header, Recent scans, Top foods, Disclaimer ---
    elements.append(_header_section(data))
    elements.append(Spacer(1, 0.4 * cm))
    
    elements.append(Paragraph("Recent Meal Scans", styles["SectionHeader"]))
    elements += _history_table(data, limit=15)
    elements.append(Spacer(1, 0.4 * cm))
    
    elements.append(Paragraph("Top Scanned Foods", styles["SectionHeader"]))
    elements += _top_foods_table(data)
    elements.append(Spacer(1, 0.8 * cm))
    
    # Medical Disclaimer
    disclaimer_style = ParagraphStyle(
        "Disclaimer",
        fontName="Helvetica-Oblique",
        fontSize=7.5,
        leading=10,
        textColor=MUTED_TEXT,
        alignment=1
    )
    elements.append(Paragraph(
        "This report is intended for informational purposes only and should not replace professional medical or dietary advice.",
        disclaimer_style
    ))

    doc.build(elements, onFirstPage=footer_canvas, onLaterPages=footer_canvas)
    buffer.seek(0)
    return buffer
