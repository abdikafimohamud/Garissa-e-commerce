import os
from datetime import timedelta

class Config:
    # Basic Flask Configuration
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
    
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI", "sqlite:///garissa.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Configuration (if you use it)
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwtsecretkey")
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    
    # CORS Configuration
    CORS_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]
    CORS_SUPPORTS_CREDENTIALS = True
    CORS_ALLOW_HEADERS = ["Content-Type", "Authorization", "Accept"]
    CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    CORS_EXPOSE_HEADERS = ["Content-Type", "Authorization"]
    
    # Session Configuration
    SESSION_TYPE = "filesystem"
    SESSION_PERMANENT = True
    SESSION_USE_SIGNER = True
    SESSION_COOKIE_NAME = "garissa_session"
    SESSION_COOKIE_SAMESITE = "Lax"   # Changed from "None" to "Lax" for better security
    SESSION_COOKIE_SECURE = False      # Set to True in production with HTTPS
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_PATH = "/"
    SESSION_COOKIE_DOMAIN = None       # None = works for localhost
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    
    # Flask-Mail Configuration
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = "abdikafimohamud126@gmail.com"
    MAIL_PASSWORD = "erwa igfl djgl mpii"
    MAIL_DEFAULT_SENDER = "abdikafimohamud126@gmail.com"
    
    # File upload configuration
    UPLOAD_FOLDER = 'uploads/profile_pictures'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size