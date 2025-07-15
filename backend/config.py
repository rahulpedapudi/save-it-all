import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/py")

    # Google OAuth Configuration
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
    GOOGLE_REDIRECT_URI = os.getenv(
        "GOOGLE_REDIRECT_URI", "http://localhost:5000/api/auth/google/callback")

    # JWT Configuration
    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY", "your-secret-key-change-in-production")
    JWT_ALGORITHM = "HS256"
    JWT_EXPIRATION_HOURS = 24

    # Frontend URL for CORS
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
