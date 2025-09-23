import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")

    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI", "sqlite:///garissa.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # CORS
    CORS_ORIGINS = [
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        
    ]
    CORS_SUPPORTS_CREDENTIALS = True
    CORS_ALLOW_HEADERS = ["Content-Type", "Authorization", "Accept"]
    CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
    CORS_EXPOSE_HEADERS = ["Content-Type", "Authorization"]

    # ✅ Session – using Flask’s built-in secure cookie session
    SESSION_COOKIE_NAME = "garissa_session"
    SESSION_COOKIE_SAMESITE = "Lax"    # good for localhost
    SESSION_COOKIE_SECURE = False      # True only on HTTPS
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_PATH = "/"
    SESSION_COOKIE_DOMAIN = None
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)

    # Mail
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = 'garissastore292@gmail.com'
    MAIL_PASSWORD = 'gbdr opkg lyfk cnua'
    MAIL_DEFAULT_SENDER = 'garissastore292@gmail.com'

    # File uploads
    UPLOAD_FOLDER = 'uploads/profile_pictures'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
