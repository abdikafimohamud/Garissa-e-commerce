from flask import Blueprint, request, jsonify, session
from models.user import User
from app import db
import bcrypt
import re   # ✅ for email validation
from utils.email_utils import send_welcome_email   # ✅ import email sender

auth_bp = Blueprint('auth_bp', __name__)

# =========================
# AUTH ROUTES
# =========================

@auth_bp.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json() or {}

        firstname = data.get('firstname', "").strip()
        secondname = data.get('secondname', "").strip()
        email = data.get('email', "").strip().lower()
        password = data.get('password', "")
        phone = data.get('phone', "")

        # =========================
        # FIELD VALIDATION
        # =========================
        if not firstname or not secondname or not email or not password:
            return jsonify({'error': 'Missing required fields (firstname, secondname, email, password)'}), 400

        # ✅ Gmail validation
        gmail_pattern = r'^[a-zA-Z0-9._%+-]+@gmail\.com$'
        if not re.match(gmail_pattern, email):
            return jsonify({'error': 'Only valid Gmail addresses are allowed (example@gmail.com)'}), 400

        # ✅ Password validation rules
        if not any(c.isupper() for c in password):
            return jsonify({'error': 'Password must contain at least one uppercase letter'}), 400
        if not any(c.islower() for c in password):
            return jsonify({'error': 'Password must contain at least one lowercase letter'}), 400
        if not any(c.isdigit() for c in password):
            return jsonify({'error': 'Password must contain at least one digit'}), 400
        if len(password) < 5:
            return jsonify({'error': 'Password must be at least 5 characters long'}), 400

        # ✅ Check if email already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'error': "This email is already registered"}), 400

        # =========================
        # USER CREATION
        # =========================
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        new_user = User(
            firstname=firstname,
            secondname=secondname,
            email=email,
            password=hashed_password,
            phone=phone
        )

        db.session.add(new_user)
        db.session.commit()

        # ✅ Send welcome email (non-blocking if implemented async)
        try:
            send_welcome_email(new_user.email, new_user.firstname)
        except Exception as email_error:
            # Log but don't block registration success
            print(f"Email sending failed: {email_error}")

        return jsonify({
            "message": "User registered successfully. Please log in.",
            "redirect": "/login"
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f"Internal server error: {str(e)}"}), 500


# =========================
# LOGIN ROUTE
# =========================
@auth_bp.route('/login', methods=['POST'])
def login_user():
    try:
        data = request.get_json() or {}
        email = data.get('email', "").strip().lower()
        password = data.get('password', "")

        # Validate input
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        # Find user
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401

        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            return jsonify({'error': 'Invalid email or password'}), 401

        # ✅ Create session
        session['user_id'] = user.id
        session['email'] = user.email
        session['firstname'] = user.firstname

        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "firstname": user.firstname,
                "secondname": user.secondname,
                "email": user.email,
                "phone": user.phone
            }
        }), 200

    except Exception as e:
        return jsonify({'error': f"Internal server error: {str(e)}"}), 500


# =========================
# LOGOUT ROUTE
# =========================
@auth_bp.route('/logout', methods=['POST'])
def logout_user():
    try:
        session.clear()
        return jsonify({"message": "Logged out successfully"}), 200
    except Exception as e:
        return jsonify({'error': f"Internal server error: {str(e)}"}), 500
