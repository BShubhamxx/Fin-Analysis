
import os
import firebase_admin
from firebase_admin import credentials, storage, initialize_app
from dotenv import load_dotenv

load_dotenv()

def verify_access():
    print("Checking Credentials...")
    
    # 1. Check Env Var
    key_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    if key_path:
        print(f"✅ GOOGLE_APPLICATION_CREDENTIALS found: {key_path}")
        if os.path.exists(key_path):
             print("   ✅ File exists")
        else:
             print("   ❌ File does NOT exist")
    else:
        print("ℹ️ GOOGLE_APPLICATION_CREDENTIALS not set. Using Application Default Credentials (ADC).")

    # 2. Check Storage Bucket Env
    bucket_name = os.getenv('FIREBASE_STORAGE_BUCKET')
    if bucket_name:
        print(f"✅ FIREBASE_STORAGE_BUCKET found: {bucket_name}")
    else:
        print("❌ FIREBASE_STORAGE_BUCKET NOT set in .env")
        return

    # 3. Try to Initialize and Access Storage
    print("\nAttempting to connect to Firebase Storage...")
    try:
        if not firebase_admin._apps:
            initialize_app(options={'storageBucket': bucket_name})
        
        bucket = storage.bucket()
        blobs = list(bucket.list_blobs(max_results=1))
        print("✅ Successfully listed blobs from storage (connection works!).")
        
    except Exception as e:
        print(f"\n❌ Failed to access storage: {e}")
        print("👉 Tip: Run 'gcloud auth application-default login' if using ADC.")

if __name__ == "__main__":
    verify_access()
