
from fastapi import APIRouter, Depends, HTTPException, status
from auth import verify_token
from firebase_admin import firestore

router = APIRouter(
    prefix="/api/history",
    tags=["history"]
)

@router.get("/")
async def get_history(token: dict = Depends(verify_token)):
    """
    Fetches the user's upload history from Firestore.
    """
    uid = token.get("uid")
    if not uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user token"
        )
        
    try:
        db = firestore.client()
        # Query uploads collection for current user
        # Note: We removed .order_by("timestamp") to avoid needing a composite index manually created.
        # We will sort in Python instead.
        docs = db.collection("uploads")\
                 .where("uid", "==", uid)\
                 .stream()
                 
        history = []
        for doc in docs:
            data = doc.to_dict()
            # Convert timestamp to ISO string if it exists
            if data.get("timestamp"):
                data["timestamp"] = data["timestamp"].isoformat()
            
            # Add ID
            data["id"] = doc.id
            history.append(data)
            
        # Sort in-memory (newest first)
        # We use 'timestamp' string (ISO) for sorting, which works correctly for dates.
        history.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
            
        return history
        
    except Exception as e:
        print(f"Error fetching history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch history"
        )

@router.get("/{doc_id}")
async def get_history_item(doc_id: str, token: dict = Depends(verify_token)):
    """
    Fetches a specific upload document by ID.
    Ensures the document belongs to the requesting user.
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
            
        # Convert timestamp
        if data.get("timestamp"):
            data["timestamp"] = data["timestamp"].isoformat()
            
        data["id"] = doc.id
        return data
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching history item {doc_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch analysis"
        )

@router.delete("/{doc_id}")
async def delete_history_item(doc_id: str, token: dict = Depends(verify_token)):
    """
    Deletes a specific analysis record.
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
            
        # Verify ownership
        if doc.to_dict().get("uid") != uid:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
            
        doc_ref.delete()
        return {"message": "Analysis deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting document {doc_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete analysis"
        )

@router.delete("/")
async def clear_history(token: dict = Depends(verify_token)):
    """
    Deletes ALL analysis history for the current user.
    """
    uid = token.get("uid")
    if not uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user token"
        )
        
    try:
        db = firestore.client()
        # Batch delete is more efficient
        batch = db.batch()
        docs = db.collection("uploads").where("uid", "==", uid).stream()
        
        count = 0
        for doc in docs:
            batch.delete(doc.reference)
            count += 1
            if count >= 450: # Firestore batch limit is 500
                 batch.commit()
                 batch = db.batch()
                 count = 0
                 
        if count > 0:
            batch.commit()
            
        return {"message": "History cleared successfully"}
        
    except Exception as e:
        print(f"Error clearing history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to clear history"
        )
