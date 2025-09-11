import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_mail import Mail
from flask_session import Session
from app.config import Config

# ===== Extensions =====
db = SQLAlchemy()
migrate = Migrate()
mail = Mail()
session = Session()

# Ensure upload directory exists
def ensure_upload_dir():
    upload_dir = Config.UPLOAD_FOLDER
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)

    # Ensure upload directory exists
    ensure_upload_dir()

    # ===== CORS Setup =====
    CORS(
        app,
        origins=Config.CORS_ORIGINS,
        supports_credentials=True,
        allow_headers=Config.CORS_ALLOW_HEADERS,
        methods=Config.CORS_METHODS,
        expose_headers=Config.CORS_EXPOSE_HEADERS
    )

    # ===== Init Extensions =====
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    session.init_app(app)

    # ===== Import Models =====
    from app.models import User, Product, Order, OrderItem, Address, Payment, Notification

    # ===== Register Blueprints =====
    from routes.user import auth_bp
    from routes.Products import products_bp
    from routes.checkout import checkout_bp
    from routes.notifications import notifications_bp
    from routes.admin_routes import admin_bp
    from routes.admin_seller_routes import admin_seller_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(checkout_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(admin_seller_bp, url_prefix="/admin_sellers")

    # ✅ REMOVED the custom @app.after_request that was overriding
    # Flask-Session’s cookie handling.

    return app

# Create the application instance
app = create_app()
