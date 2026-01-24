
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from services import parsing_service
from auth import verify_token

router = APIRouter(
    prefix="/api/analyze",
    tags=["analysis"]
)

@router.post("/upload")
async def analyze_upload(
    file: UploadFile = File(...), 
    token: dict = Depends(verify_token)
):
    """
    Triggers analysis for a direct file upload.
    Verifies user token, parses the uploaded file directly, and returns a preview.
    """
    uid = token.get("uid")
    if not uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user token"
        )
        
    # Read file content
    content = await file.read()
    
    # Parse and preview
    preview_data = parsing_service.preview_file(content, file.filename)
    
    # SAVE METADATA TO FIRESTORE
    try:
        from firebase_admin import firestore
        from utils.serialization import make_serializable
        import traceback
        
        db = firestore.client()
        
        # Prepare data for Firestore (remove NumPy types)
        firestore_data = {
            "uid": uid,
            "filename": file.filename,
            "upload_type": "direct_upload",
            "timestamp": firestore.SERVER_TIMESTAMP,
            "status": "analyzed",
            "row_count": preview_data.get("row_count") or len(preview_data.get("preview_rows", [])),
            "columns": preview_data.get("mapped_columns"),
            "missing_columns": preview_data.get("missing_required_columns"),
            "analysis_report": make_serializable(preview_data.get("analysis_report"))
        }

        doc_ref = db.collection("uploads").document()
        doc_ref.set(firestore_data)
        
        preview_data["upload_id"] = doc_ref.id
        
    except Exception as e:
        error_msg = f"Failed to save metadata to Firestore: {e}"
        print(error_msg)
        traceback.print_exc()
        
        # Write to a log file we can read
        try:
            with open("debug_firestore_error.log", "w") as f:
                f.write(error_msg + "\n")
                f.write(traceback.format_exc())
        except:
            pass
            
        # Continue even if saving metadata fails
    
    return preview_data
