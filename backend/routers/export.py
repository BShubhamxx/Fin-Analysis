
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from auth import verify_token
from firebase_admin import firestore
from services.pdf_service import PDFService

router = APIRouter(
    prefix="/api/export",
    tags=["export"]
)

@router.get("/{doc_id}/pdf")
async def export_pdf(doc_id: str, token: dict = Depends(verify_token)):
    """
    Generates and downloads a PDF report for the specified analysis.
    """
    uid = token.get("uid")
    if not uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user token"
        )
        
    try:
        db = firestore.client()
        doc_ref = db.collection("uploads").document(doc_id)
        doc = doc_ref.get()
        
        if not doc.exists:
             raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Analysis not found"
            )
            
        data = doc.to_dict()
        
        # Verify ownership
        if data.get("uid") != uid:
             raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Generate PDF
        pdf_buffer = PDFService.generate_report(data)
        
        # Return as downloadable file
        filename = f"Analysis_Report_{doc_id[:8]}.pdf"
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating PDF for {doc_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate PDF report"
        )
