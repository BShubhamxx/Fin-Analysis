
import os
from fastapi import HTTPException, Security, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth, credentials, initialize_app
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin SDK
# Note: In production, you would use a service account credential file
# For local dev/emulator, this might look different
try:
    # Check if app is already initialized
    initialize_app(options={
        'storageBucket': os.getenv('FIREBASE_STORAGE_BUCKET')
    })
except ValueError:
    pass

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        # Verify the ID token while checking if the token is revoked by
        # passing check_revoked=True.
        decoded_token = auth.verify_id_token(token, check_revoked=True)
        return decoded_token
    except auth.RevokedIdTokenError:
        # Token revoked, inform the user to re-authenticate or signOut().
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except auth.UserDisabledError:
        # Token belongs to values user who has been disabled.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User disabled",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(token: dict = Depends(verify_token)):
    return token
