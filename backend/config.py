import os
from dotenv import load_dotenv

load_dotenv()


class Config:

    USER = os.getenv("MONGO_USER")
    PASSWORD = os.getenv("MONGO_PASSWORD")

    CELERY_BROKER_URL = os.environ.get(
        'CELERY_BROKER_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.environ.get(
        'CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')

    MONGO_URI = (
        f"mongodb+srv://{USER}:{PASSWORD}@db.celqtlm.mongodb.net/db?retryWrites=true&w=majority&appName=db")

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


print(os.getenv("MONGO_USER"))
