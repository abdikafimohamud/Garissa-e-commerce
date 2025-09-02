from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_mail import Mail

db = SQLAlchemy()
migrate = Migrate()
mail = Mail()   # ✅ Initialize Flask-Mail

def create_app():
    app = Flask(__name__)

    # ===== Correct CORS setup =====
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

    # ===== Flask-Mail Config =====
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = "abdikafimohamud126@gmail.com"
    app.config['MAIL_PASSWORD'] = "erwa igfl djgl mpii"  # ✅ Gmail app password
    app.config['MAIL_DEFAULT_SENDER'] = "abdikafimohamud126@gmail.com"

    # ===== Init Extensions =====
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)   # ✅ Initialize Mail with app

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
