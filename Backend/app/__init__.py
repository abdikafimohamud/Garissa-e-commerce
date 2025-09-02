from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import os

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

# Correct CORS setup
    CORS(app, supports_credentials=True, origins=[
    "http://localhost:5173", "http://127.0.0.1:5173"
])
    # ===== Database Config =====
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///garissa.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # ===== Secret Key =====
    app.secret_key = "super-secret"

    # ===== Session Config =====
    app.config.update({
        "SESSION_COOKIE_SAMESITE": "Lax",
        "SESSION_COOKIE_NAME": "user_session",
        "SESSION_COOKIE_SECURE": False, 
        "SESSION_COOKIE_PATH": "/",
        "SESSION_COOKIE_DOMAIN": None,
    })

    # ===== Init Extensions =====
    db.init_app(app)
    migrate.init_app(app, db)


    # ===== Import Models =====
    from models.clothes import Clothes
    from models.electronics import Electronics
    from models.sports import Sports
    from models.cosmetics import Cosmetics
    from models.user import User
    from models.notification import Notification
    from models.profile import Profile

    # ===== Register Blueprints =====
    from routes.clothes import clothes_bp
    from routes.electronics import electronics_bp
    from routes.sports import sports_bp
    from routes.cosmetics import cosmetics_bp
    from routes.user import auth_bp
    from routes.notifications import notifications_bp
    from routes.profile import profile_bp

    app.register_blueprint(clothes_bp)
    app.register_blueprint(electronics_bp)
    app.register_blueprint(sports_bp)
    app.register_blueprint(cosmetics_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(profile_bp)

    return app
