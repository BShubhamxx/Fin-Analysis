
import os
import io
import pandas as pd
from fastapi import HTTPException, status

def preview_file(file_content: bytes | io.BytesIO, filename: str):
    """
    Parses the file content (CSV/Excel) and returns a preview.
    file_content can be bytes or BytesIO.
    """
    try:
        # Convert bytes to BytesIO if needed
        if isinstance(file_content, bytes):
            stream = io.BytesIO(file_content)
        else:
            stream = file_content

        if filename.endswith('.csv'):
            df = pd.read_csv(stream)
        elif filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(stream)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported file format"
            )

        if df.empty:
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File is empty"
            )

        # Standardize columns
        from services.standardizer import standardize_columns, validate_standardized_data
        
        df_standardized, column_mapping = standardize_columns(df)
        
        # Check validation
        missing_columns = validate_standardized_data(df_standardized)

        # Run Analysis Engine (Benford's Law & Spending Summary)
        benford_stats = None
        spending_summary = None
        
        if "Amount" in df_standardized.columns:
             from services.analysis_engine import calculate_benford_stats, calculate_spending_summary
             benford_stats = calculate_benford_stats(df_standardized["Amount"])
             spending_summary = calculate_spending_summary(df_standardized)

        # Prepare preview data
        preview = {
            "filename": filename,
            "original_columns": df.columns.tolist(),
            "mapped_columns": column_mapping,
            "missing_required_columns": missing_columns,
            "preview_rows": df_standardized.head(5).replace({float('nan'): None}).to_dict(orient='records'),
            "analysis_report": {
                "benford_analysis": benford_stats,
                "spending_summary": spending_summary
            }
        }

        # AI INTEGRATION
        # We perform this *after* preparing the basic preview, so if it fails, we still have data.
        if benford_stats and spending_summary:
            try:
                from services.ai_service import ai_service
                analysis_data_for_ai = {
                    "benford_analysis": benford_stats,
                    "spending_summary": spending_summary
                }
                ai_insights = ai_service.generate_insights(analysis_data_for_ai)
                preview["analysis_report"]["ai_insights"] = ai_insights
            except Exception as e:
                print(f"AI Service failed: {e}")
                # Fallback or leave empty, frontend handles missing insights

        
        return preview

    except pd.errors.ParserError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to parse file. Invalid format."
        )
    except Exception as e:
        print(f"Error parsing file: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse file: {str(e)}"
        )
