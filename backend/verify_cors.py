
import os
import firebase_admin
from firebase_admin import credentials, storage

CRED_PATH = 'service-account.json'
BUCKET_NAME = 'front-77b96.firebasestorage.app'

def check_cors():
    if not os.path.exists(CRED_PATH):
        # Try finding it in parent or current
        if os.path.exists(os.path.join(os.getcwd(), CRED_PATH)):
            path = os.path.join(os.getcwd(), CRED_PATH)
        elif os.path.exists(os.path.join(os.path.dirname(os.getcwd()), CRED_PATH)):
            path = os.path.join(os.path.dirname(os.getcwd()), CRED_PATH)
        else:
            print("❌ service-account.json not found")
            return
    else:
        path = CRED_PATH

    print(f"Using credential: {path}")
    cred = credentials.Certificate(path)
    
    # Initialize if not already
    try:
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred, {'storageBucket': BUCKET_NAME})
    except ValueError:
        pass # Already initialized

    bucket = storage.bucket()
    print(f"Checking bucket: {bucket.name}")
    
    bucket.reload()
    print("Current CORS configuration:")
    if bucket.cors:
        for i, rule in enumerate(bucket.cors):
            print(f"Rule {i+1}:")
            print(f"  Origin: {rule.get('origin')}")
            print(f"  Method: {rule.get('method')}")
            print(f"  ResponseHeader: {rule.get('responseHeader')}")
            print(f"  MaxAgeSeconds: {rule.get('maxAgeSeconds')}")
    else:
        print("❌ No CORS configuration found on this bucket.")

if __name__ == "__main__":
    check_cors()
