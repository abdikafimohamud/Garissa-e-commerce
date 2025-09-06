from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_mail import Mail
from flask_session import Session
import os

# ===== Extensions =====
db = SQLAlchemy()
migrate = Migrate()
mail = Mail()
session = Session()

# Conditional import for JWT to avoid errors if not installed
try:
    from flask_jwt_extended import JWTManager
    jwt = JWTManager()
except ImportError:
    # Create a dummy JWT manager if not installed
    class DummyJWTManager:
        def init_app(self, app):
            pass
    jwt = DummyJWTManager()
    print("Warning: flask-jwt-extended not installed. JWT functionality will be limited.")


def create_app():
    app = Flask(__name__)

    # ===== CORS Setup =====
    CORS(app, 
         supports_credentials=True, 
         origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        ])

    # ===== Database Config =====
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///garissa.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # ===== Secret Key =====
    app.secret_key = os.getenv("SECRET_KEY", "super-secret-key-change-in-production")
    
    # ===== JWT Config =====
    app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY", "jwt-super-secret-key-change-in-production")
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600  # 1 hour

    # ===== Session Config =====
    app.config.update({
        "SESSION_TYPE": "filesystem",        # persistent sessions
        "SESSION_PERMANENT": False,
        "SESSION_USE_SIGNER": True,
        "SESSION_COOKIE_NAME": "garissa_session",
        "SESSION_COOKIE_SAMESITE": "Lax",
        "SESSION_COOKIE_SECURE": False,       # True if HTTPS
        "SESSION_COOKIE_HTTPONLY": True,
        "SESSION_COOKIE_PATH": "/",
        "SESSION_COOKIE_DOMAIN": None,
    })

    # ===== Flask-Mail Config =====
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = "abdikafimohamud126@gmail.com"
    app.config['MAIL_PASSWORD'] = "erwa igfl djgl mpii"  # Gmail App Password
    app.config['MAIL_DEFAULT_SENDER'] = "abdikafimohamud126@gmail.com"

    # ===== Init Extensions =====
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    session.init_app(app)
    jwt.init_app(app)

    # ===== Import Models =====
    from models.clothes import Clothes
    from models.electronics import Electronics
    from models.sports import Sports
    from models.cosmetics import Cosmetics
    from models.user import User
    # from models.seller import Seller  # Corrected import - uppercase 'Seller'
   
    # Removed incorrect import: from models.admin_notifications import admin_notifications
    # from models.profile import Profile
    
    # Import checkout models (conditional to avoid errors if files don't exist yet)
    try:
        from models.order import Order
        from models.order_item import OrderItem
        from models.shipping_info import ShippingInfo
        from models.payment_info import PaymentInfo
    except ImportError:
        print("Warning: Checkout models not found. Creating orders functionality will be limited.")

    # ===== Register Blueprints =====
    from routes.clothes import clothes_bp
    from routes.electronics import electronics_bp
    from routes.sports import sports_bp
    from routes.cosmetics import cosmetics_bp
    from routes.user import auth_bp
    from routes.notifications import notifications_bp
    # from routes.sellers import sellers_bp
 

    # from routes.profile import profile_bp

    # Register checkout blueprint (conditional to avoid errors if file doesn't exist yet)
    try:
        from routes.checkout import checkout_bp
        app.register_blueprint(checkout_bp)
        print("Checkout blueprint registered successfully.")
    except ImportError:
        print("Warning: Checkout routes not found. Checkout functionality will be limited.")

    app.register_blueprint(clothes_bp)
    app.register_blueprint(electronics_bp)
    app.register_blueprint(sports_bp)
    app.register_blueprint(cosmetics_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(notifications_bp)
   
    # app.register_blueprint(sellers_bp)
    # app.register_blueprint(profile_bp)

    return app