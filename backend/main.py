from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from auth import get_current_user
from routers import analysis, history, export
# from services.pdf_service import PDFService
from utils.serialization import make_serializable

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router)
app.include_router(history.router)
app.include_router(export.router)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Fin-Analysis API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/protected")
def protected_route(user: dict = Depends(get_current_user)):
    return {"message": "You are authenticated", "user_id": user.get("uid")}
