
import os
import firebase_admin
from firebase_admin import credentials, storage

# Configuration
CRED_PATH = 'service-account.json'
BUCKET_NAME = 'front-77b96.firebasestorage.app'

def apply_cors():
    cred_path = CRED_PATH
    if not os.path.exists(cred_path):
        # Try parent directory
        cred_path = os.path.join(os.path.pardir, CRED_PATH)
        if not os.path.exists(cred_path):
            print(f"Error: {CRED_PATH} not found in backend or project root.")
            return
        print(f"Found credential at: {cred_path}")

    try:
        print(f"Authenticating with {cred_path}...")
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred, {
            'storageBucket': BUCKET_NAME
        })

        bucket = storage.bucket()
        print(f"Connected to bucket: {bucket.name}")

        # Define CORS
        cors_config = [
            {
                "origin": ["http://localhost:5173", "http://localhost:3000"],
                "method": ["GET", "HEAD", "PUT", "POST", "DELETE", "OPTIONS"],
                "responseHeader": ["Content-Type", "Access-Control-Allow-Origin", "x-goog-resumable"],
                "maxAgeSeconds": 3600
            }
        ]

        print("Applying CORS configuration...")
        bucket.cors = cors_config
        bucket.patch()
        
        print("✅ CORS configuration applied successfully!")
        print("You can now upload files from localhost.")

    except Exception as e:
        print(f"❌ Failed to apply CORS: {e}")

if __name__ == "__main__":
    apply_cors()
