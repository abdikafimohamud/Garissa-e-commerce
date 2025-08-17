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

    fullname = data.get('fullname')
    email = data.get('email')
    password = data.get('password')

    if not fullname or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    # check if email already exists
    if User.query.filter_by(email=email).first():
        return jsonify({'error': "This email is already registered"}), 400

    try:
        # ✅ hash password correctly
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        user = User(fullname=fullname, email=email, password=hashed_password)
        db.session.add(user)
        db.session.commit()

        # ✅ auto login user after register (optional)
        session['user_id'] = user.id  

        return jsonify({
            "message": "User registered successfully",
            "user": user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({"error": "Invalid email or password"}), 401

    # ✅ Save to session
    session.permanent = True
    session['user_id'] = user.id
    session['user_name'] = user.fullname

    return jsonify({
        "message": "Logged in successfully",
        "user": user.to_dict()
    }), 200


@auth_bp.route('/logout', methods=['POST'])
def logout_user():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200


@auth_bp.route('/get_current_user', methods=['GET'])
def get_current_user():
    if 'user_id' not in session:
        return jsonify({"error": "Not authorized"}), 401

    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict()), 200


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
    fullname = data.get('fullname')
    email = data.get('email')
    password = data.get('password')

    if not fullname or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    user = User(fullname=fullname, email=email, password=hashed_password)
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
    if 'fullname' in data:
        user.fullname = data['fullname']
    if 'email' in data:
        if User.query.filter(User.email == data['email'], User.id != user_id).first():
            return jsonify({"error": "Email already in use"}), 400
        user.email = data['email']
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
