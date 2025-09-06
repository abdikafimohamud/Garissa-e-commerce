from flask import Blueprint, request, jsonify, session
from models.user import User
from app import db
import bcrypt
import re

auth_bp = Blueprint('auth_bp', __name__)

# =========================
# REGISTRATION ROUTE
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
        account_type = data.get('accountType', 'buyer')  # Get account type

        # =========================
        # FIELD VALIDATION
        # =========================
        if not firstname or not secondname or not email or not password:
            return jsonify({'error': 'Missing required fields (firstname, secondname, email, password)'}), 400

        # Gmail validation
        gmail_pattern = r'^[a-zA-Z0-9._%+-]+@gmail\.com$'
        if not re.match(gmail_pattern, email):
            return jsonify({'error': 'Only valid Gmail addresses are allowed (example@gmail.com)'}), 400

        # Password validation rules
        if not any(c.isupper() for c in password):
            return jsonify({'error': 'Password must contain at least one uppercase letter'}), 400
        if not any(c.islower() for c in password):
            return jsonify({'error': 'Password must contain at least one lowercase letter'}), 400
        if not any(c.isdigit() for c in password):
            return jsonify({'error': 'Password must contain at least one digit'}), 400
        if len(password) < 5:
            return jsonify({'error': 'Password must be at least 5 characters long'}), 400

        # Account type validation
        if account_type not in ['buyer', 'seller']:
            return jsonify({'error': 'Invalid account type'}), 400

        # Check if email already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'error': "This email is already registered"}), 400

        # =========================
        # USER CREATION
        # =========================
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        hashed_password_str = hashed_password.decode('utf-8')

        new_user = User(
            firstname=firstname,
            secondname=secondname,
            email=email,
            password=hashed_password_str,
            phone=phone,
            account_type=account_type
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "message": "User registered successfully.",
            "account_type": account_type,
            "redirect": f"/{account_type}-login"
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f"Internal server error: {str(e)}"}), 500

# =========================
# BUYER LOGIN ROUTE
# =========================
@auth_bp.route('/login/buyer', methods=['POST'])
def login_buyer():
    try:
        data = request.get_json() or {}
        email = data.get('email', "").strip().lower()
        password = data.get('password', "")

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        user = User.query.filter_by(email=email, account_type='buyer').first()
        if not user:
            return jsonify({'error': 'Invalid email or not a buyer account'}), 401

        if not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401

        # Create session
        session['user_id'] = user.id
        session['email'] = user.email
        session['firstname'] = user.firstname
        session['account_type'] = user.account_type

        return jsonify({
            "message": "Buyer login successful",
            "user": user.to_dict(),
            "redirect": "/products/dashboard-home"
        }), 200

    except Exception as e:
        return jsonify({'error': f"Internal server error: {str(e)}"}), 500

# =========================
# SELLER LOGIN ROUTE
# =========================
@auth_bp.route('/login/seller', methods=['POST'])
def login_seller():
    try:
        data = request.get_json() or {}
        email = data.get('email', "").strip().lower()
        password = data.get('password', "")

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        user = User.query.filter_by(email=email, account_type='seller').first()
        if not user:
            return jsonify({'error': 'Invalid email or not a seller account'}), 401

        if not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401

        # Create session
        session['user_id'] = user.id
        session['email'] = user.email
        session['firstname'] = user.firstname
        session['account_type'] = user.account_type

        return jsonify({
            "message": "Seller login successful",
            "user": user.to_dict(),
            "redirect": "/seller/dashboard-home"
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

# =========================
# GET CURRENT USER
# =========================
# In your get_current_user route, add more debugging:
@auth_bp.route('/get_current_user', methods=['GET'])
def get_current_user():
    try:
        user_id = session.get('user_id')
        print(f"DEBUG: Session user_id = {user_id}")
        print(f"DEBUG: All session data = {dict(session)}")
        
        if not user_id:
            print("DEBUG: No user_id in session - user not logged in")
            return jsonify({'error': 'Unauthorized'}), 401

        user = User.query.get(user_id)
        if not user:
            print(f"DEBUG: User with id {user_id} not found in database")
            session.clear()
            return jsonify({'error': 'User not found'}), 404

        # Check what fields the user object has
        print(f"DEBUG: User object has firstname: {hasattr(user, 'firstname')}")
        if hasattr(user, 'firstname'):
            print(f"DEBUG: User firstname = {user.firstname}")
        
        user_dict = user.to_dict()
        print(f"DEBUG: User.to_dict() returns: {user_dict}")
        
        return jsonify({
            "user": user_dict
        }), 200

    except Exception as e:
        print(f"ERROR in get_current_user: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f"Internal server error: {str(e)}"}), 500