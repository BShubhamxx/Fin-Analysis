
import os
import io
import pandas as pd
from firebase_admin import storage
from fastapi import HTTPException, status

def download_file_from_storage(file_path: str) -> bytes:
    """
    Downloads a file from Firebase Storage as bytes.
    """
    try:
        bucket = storage.bucket()
        blob = bucket.blob(file_path)
        
        # Check if blob exists
        if not blob.exists():
             raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"File not found in storage: {file_path}"
            )
            
        return blob.download_as_bytes()
    except Exception as e:
        print(f"Error downloading file: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to download file: {str(e)}"
        )

def preview_file(file_content: bytes, filename: str):
    """
    Parses the file content (CSV/Excel) and returns a preview.
    """
    try:
        if filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(file_content))
        elif filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(io.BytesIO(file_content))
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported file format"
            )

        # Basic validation
        if df.empty:
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File is empty"
            )

        # Prepare preview data
        preview = {
            "filename": filename,
            "columns": df.columns.tolist(),
            "dtypes": df.dtypes.astype(str).to_dict(),
            "row_count": len(df),
            "preview_rows": df.head(5).to_dict(orient='records')
        }
        
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
