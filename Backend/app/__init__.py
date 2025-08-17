from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import os

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # ===== Database Config =====
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///garissa.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # ===== Secret Key =====
    app.secret_key = os.getenv("SECRET_KEY", "GGHYt7TT564282929")

    # ===== Session Config =====
    app.config.update({
        "SESSION_COOKIE_SAMESITE": "Lax",
        "SESSION_COOKIE_NAME": "user_session",
        "SESSION_COOKIE_SECURE": not app.debug,  # True only in production
        "SESSION_COOKIE_PATH": "/",
        "SESSION_COOKIE_DOMAIN": None,
    })

    # ===== Init Extensions =====
    db.init_app(app)
    migrate.init_app(app, db)

    # ===== CORS Setup =====
    CORS(
        app,
        supports_credentials=True,
        origins=["http://127.0.0.1:5173"],  # frontend URL
    )

    # ===== Import Models =====
    from models.clothes import Clothes
    from models.electronics import Electronics
    from models.sports import Sports
    from models.cosmetics import Cosmetics
    from models.user import User

    # ===== Register Blueprints =====
    from routes.clothes import clothes_bp
    from routes.electronics import electronics_bp
    from routes.sports import sports_bp
    from routes.cosmetics import cosmetics_bp
    from routes.user import auth_bp

    app.register_blueprint(clothes_bp)
    app.register_blueprint(electronics_bp)
    app.register_blueprint(sports_bp)
    app.register_blueprint(cosmetics_bp)
    app.register_blueprint(auth_bp)

    return app
