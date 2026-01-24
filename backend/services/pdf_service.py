
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from io import BytesIO

class PDFService:
    @staticmethod
    def generate_report(data: dict) -> BytesIO:
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []
        styles = getSampleStyleSheet()
        
        # Custom Styles
        title_style = styles['Title']
        heading_style = styles['Heading2']
        normal_style = styles['Normal']
        
        # 1. Title
        elements.append(Paragraph("Financial Analysis Report", title_style))
        elements.append(Spacer(1, 20))
        
        # 2. File Metadata
        filename = data.get("filename", "Unknown File")
        date_str = data.get("timestamp", "Unknown Date")
        meta_info = [
            ["Filename:", filename],
            ["Analysis Date:", date_str],
            ["Status:", data.get("status", "N/A")],
            ["Rows Analyzed:", str(data.get("row_count", 0))]
        ]
        
        t_meta = Table(meta_info, colWidths=[100, 400])
        t_meta.setStyle(TableStyle([
            ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
            ('TEXTCOLOR', (0,0), (0,-1), colors.darkblue),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ]))
        elements.append(t_meta)
        elements.append(Spacer(1, 20))
        
        # 3. Spending Summary
        analysis = data.get("analysis_report", {})
        spending = analysis.get("spending_summary", {})
        
        if spending:
            elements.append(Paragraph("Spending Overview", heading_style))
            elements.append(Spacer(1, 10))
            
            summary_data = [
                ["Metric", "Value"],
                ["Total Volume", f"${spending.get('total_volume', 0):,.2f}"],
                ["Transaction Count", str(spending.get('transaction_count', 0))],
                ["Avg Transaction", f"${spending.get('avg_transaction', 0):,.2f}"],
                ["Net Flow", f"${spending.get('net_flow', 0):,.2f}"],
            ]
            
            t_spending = Table(summary_data, colWidths=[200, 200])
            t_spending.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (1,0), colors.grey),
                ('TEXTCOLOR', (0,0), (1,0), colors.whitesmoke),
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('FONTNAME', (0,0), (1,0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0,0), (-1,0), 12),
                ('BACKGROUND', (0,1), (-1,-1), colors.beige),
                ('GRID', (0,0), (-1,-1), 1, colors.black),
            ]))
            elements.append(t_spending)
            elements.append(Spacer(1, 20))

            # 3a. Monthly Trend
            monthly_trend = spending.get("monthly_trend", {})
            if monthly_trend:
                elements.append(Paragraph("Monthly Spending Trend", styles['Heading3']))
                elements.append(Spacer(1, 5))
                
                trend_data = [["Month", "Total Amount"]]
                # Sort by month string (YYYY-MM)
                sorted_months = sorted(monthly_trend.keys())
                for month in sorted_months:
                    trend_data.append([month, f"${monthly_trend[month]:,.2f}"])
                
                t_trend = Table(trend_data, colWidths=[150, 150])
                t_trend.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
                    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
                    ('ALIGN', (1,1), (-1,-1), 'RIGHT'),
                ]))
                elements.append(t_trend)
                elements.append(Spacer(1, 20))

            # 3b. Top Categories
            top_categories = spending.get("top_categories", {})
            if top_categories:
                elements.append(Paragraph("Top Spending Categories", styles['Heading3']))
                elements.append(Spacer(1, 5))
                
                cat_data = [["Category", "Trans. Count", "Total Amount"]]
                # Sort by amount (descending) logic was done in analysis_engine, but here we iterate dict
                # Analysis engine returns dict {cat_name: {sum: X, count: Y}}
                # We should convert to list and sort to be sure
                
                sorted_cats = sorted(
                    top_categories.items(), 
                    key=lambda item: abs(item[1].get('sum', 0)), 
                    reverse=True
                )
                
                for cat, stats in sorted_cats:
                    cat_data.append([
                        cat, 
                        str(stats.get('count', 0)), 
                        f"${stats.get('sum', 0):,.2f}"
                    ])
                
                t_cats = Table(cat_data, colWidths=[200, 100, 150])
                t_cats.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
                    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
                    ('ALIGN', (1,1), (-1,-1), 'RIGHT'),
                ]))
                elements.append(t_cats)
                elements.append(Spacer(1, 20))

        # 4. Benford's Law Analysis
        benford = analysis.get("benford_analysis", {})
        if benford:
            elements.append(Paragraph("Fraud Detection (Benford's Law)", heading_style))
            elements.append(Spacer(1, 10))
            
            verdict = benford.get("verdict", "Unknown")
            score = benford.get("mad_score", 0)
            
            verdict_color = "green" if verdict == "Pass" else "red" if verdict == "Fail" else "orange"
            
            verdict_text = f"Verdict: <font color='{verdict_color}'><b>{verdict.upper()}</b></font>"
            score_text = f"MAD Score: {score} (Lower is better)"
            
            elements.append(Paragraph(verdict_text, styles['Normal']))
            elements.append(Paragraph(score_text, styles['Normal']))
            elements.append(Spacer(1, 20))
            
            # Distribution Table (Top 5 digits)
            elements.append(Paragraph("Digit Distribution (First 5)", styles['Heading3']))
            dist_data = [["Digit", "Actual %", "Expected %", "Difference"]]
            
            distribution = benford.get("distribution", {})
            # Sort keys just in case
            sorted_keys = sorted([k for k in distribution.keys() if k.isdigit()], key=int)[:5]
            
            for k in sorted_keys:
                vals = distribution[k]
                actual = vals.get("actual", 0) * 100
                expected = vals.get("expected", 0) * 100
                diff = abs(actual - expected)
                dist_data.append([
                    str(k),
                    f"{actual:.1f}%",
                    f"{expected:.1f}%",
                    f"{diff:.1f}%"
                ])
                
            t_benford = Table(dist_data)
            t_benford.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
                ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
            ]))
            elements.append(t_benford)

        doc.build(elements)
        buffer.seek(0)
        return buffer
