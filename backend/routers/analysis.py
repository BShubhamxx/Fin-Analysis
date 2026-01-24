
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from services import parsing_service
from auth import verify_token

router = APIRouter(
    prefix="/api/analyze",
    tags=["analysis"]
)

class AnalyzeUploadRequest(BaseModel):
    file_path: str
    file_name: str
    content_type: str

@router.post("/upload")
async def analyze_upload(request: AnalyzeUploadRequest, token: dict = Depends(verify_token)):
    """
    Triggers analysis for an uploaded file.
    Verifies user token, downloads file from storage, and returns a preview.
    """
    uid = token.get("uid")
    if not uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user token"
        )

    # Security check: Ensure the file path belongs to the user
    # Expected path format: uploads/{uid}/{timestamp}_{filename}
    if not request.file_path.startswith(f"uploads/{uid}/"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this file"
        )
        
    # Download file
    file_content = parsing_service.download_file_from_storage(request.file_path)
    
    # Parse and preview
    preview_data = parsing_service.preview_file(file_content, request.file_name)
    
    return preview_data
