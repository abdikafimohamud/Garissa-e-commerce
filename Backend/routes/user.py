from flask import Blueprint, request, jsonify, session
from models.user import User
from app import db
import bcrypt

auth_bp = Blueprint('auth_bp', __name__)

# =========================
# AUTH ROUTES
# =========================

@auth_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    password = data.get('password')

    # Validate required fields
    if not data.get('email') or not data.get('password') or not data.get('firstname') or not data.get('secondname'):
        return jsonify({'error': 'Missing required fields'}), 400

    # Password validation rules
    if not any(c.isupper() for c in password):
        return jsonify({'error': 'Password must contain at least one uppercase letter'}), 400
    if not any(c.islower() for c in password):
        return jsonify({'error': 'Password must contain at least one lowercase letter'}), 400
    if not any(c.isdigit() for c in password):
        return jsonify({'error': 'Password must contain at least one digit'}), 400
    if len(password) < 5:
        return jsonify({'error': 'Password must be at least 5 characters long'}), 400

    # Check if email already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': "This email is already registered"}), 400

    try:
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Create new user
        user = User(
            firstname=data.get('firstname'),
            secondname=data.get('secondname'),
            email=data.get('email'),
            password=hashed_password,
            phone=data.get('phone')
        )
        db.session.add(user)
        db.session.commit()

        # ❌ Remove auto-login
        # session.permanent = True
        # session['user_id'] = user.id
        # session['user_name'] = f"{user.firstname} {user.secondname}"

        # ✅ Tell frontend to redirect to login page
        return jsonify({
            "message": "User registered successfully. Please log in.",
            "redirect": "/login"
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        # check password
        if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            return jsonify({"error": "Invalid email or password"}), 401

        # 🔑 Login session
        session['user_id'] = user.id
        session['fullname'] = f"{user.firstname} {user.secondname}"

        return jsonify({
            "message": "Login successful",
            "user": user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route('/logout', methods=['POST'])
def logout_user():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200


@auth_bp.route("/get_current_user")
def get_current_user():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"user": None}), 200
    user = User.query.get(user_id)
    if not user:
        return jsonify({"user": None}), 200
    return jsonify({"user": user.to_dict()}), 200


# =========================
# USER CRUD ROUTES (Admin)
# =========================

@auth_bp.route('/users', methods=['GET'])
def get_all_users():
    if 'user_id' not in session:
        return jsonify({"error": "Not authorized"}), 401

    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200


@auth_bp.route('/users', methods=['POST'])
def create_user():
    if 'user_id' not in session:
        return jsonify({"error": "Not authorized"}), 401

    data = request.get_json()
    firstname = data.get('firstname')
    secondname = data.get('secondname')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')

    if not firstname or not secondname or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    user = User(
        firstname=firstname,
        secondname=secondname,
        email=email,
        password=hashed_password,
        phone=phone
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User created successfully",
        "user": user.to_dict()
    }), 201


@auth_bp.route('/users/<int:user_id>', methods=['PATCH'])
def update_user(user_id):
    if 'user_id' not in session:
        return jsonify({"error": "Not authorized"}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    if 'firstname' in data:
        user.firstname = data['firstname']
    if 'secondname' in data:
        user.secondname = data['secondname']
    if 'email' in data:
        if User.query.filter(User.email == data['email'], User.id != user_id).first():
            return jsonify({"error": "Email already in use"}), 400
        user.email = data['email']
    if 'phone' in data:
        user.phone = data['phone']
    if 'password' in data and data['password']:
        user.password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    db.session.commit()
    return jsonify({
        "message": "User updated successfully",
        "user": user.to_dict()
    }), 200


@auth_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    if 'user_id' not in session:
        return jsonify({"error": "Not authorized"}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200
