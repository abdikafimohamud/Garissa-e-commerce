from flask import Blueprint, request, jsonify, session
from app import db
from app.models import User
import bcrypt
import re

auth_bp = Blueprint('auth', __name__)

def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

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

        # Check password using bcrypt
        if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            return jsonify({'error': 'Invalid email or password'}), 401

        # Create session
        session['user_id'] = user.id
        session['email'] = user.email
        session['firstname'] = user.firstname
        session['account_type'] = user.account_type
        session['logged_in'] = True  # Add session flag

        return jsonify({
            "message": "Buyer login successful",
            "user": user.to_dict(),
            "redirect": "/buyers/dashboard-home"
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

        # Check password using bcrypt
        if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            return jsonify({'error': 'Invalid email or password'}), 401

        # Create session
        session['user_id'] = user.id
        session['email'] = user.email
        session['firstname'] = user.firstname
        session['account_type'] = user.account_type
        session['logged_in'] = True  # Add session flag

        return jsonify({
            "message": "Seller login successful",
            "user": user.to_dict(),
            "redirect": "/seller/dashboard-home"
        }), 200

    except Exception as e:
        return jsonify({'error': f"Internal server error: {str(e)}"}), 500


@auth_bp.route('/logout', methods=['POST'])
def logout():
    try:
        # Clear session
        session.clear()
        return jsonify({"message": "Logged out successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    try:
        # Check if user is logged in
        if not session.get('user_id'):
            return jsonify({"error": "Not authenticated"}), 401
        
        user_id = session['user_id']
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/profile', methods=['PUT', 'PATCH'])
def update_profile():
    try:
        # Check if user is logged in
        if not session.get('user_id'):
            return jsonify({"error": "Not authenticated"}), 401
        
        user_id = session['user_id']
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        data = request.get_json()
        
        # Update fields if provided
        if 'firstname' in data:
            user.firstname = data['firstname']
        if 'secondname' in data:
            user.secondname = data['secondname']
        if 'phone' in data:
            user.phone = data['phone']
        if 'profile_pic' in data:
            user.profile_pic = data['profile_pic']
        if 'account_type' in data:
            user.account_type = data['account_type']
        
        # Email update requires validation and uniqueness check
        if 'email' in data:
            if not is_valid_email(data['email']):
                return jsonify({"error": "Invalid email format"}), 400
            
            # Check if email is already taken by another user
            existing_user = User.query.filter(User.email == data['email'], User.id != user_id).first()
            if existing_user:
                return jsonify({"error": 'Email already taken'}), 409
            
            user.email = data['email']
        
        # Password update
        if 'password' in data:
            if len(data['password']) < 6:
                return jsonify({"error": "Password must be at least 6 characters"}), 400
            user.password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        db.session.commit()
        
        return jsonify({
            "message": "Profile updated successfully",
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/profile', methods=['DELETE'])
def delete_profile():
    try:
        # Check if user is logged in
        if not session.get('user_id'):
            return jsonify({"error": "Not authenticated"}), 401
        
        user_id = session['user_id']
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Clear session first
        session.clear()
        
        # Delete user
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({
            "message": "Account deleted successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/check-auth', methods=['GET'])
def check_auth():
    try:
        if session.get('user_id'):
            user_id = session['user_id']
            user = User.query.get(user_id)
            
            if user:
                return jsonify({
                    "authenticated": True,
                    "user": user.to_dict()
                }), 200
        
        return jsonify({
            "authenticated": False
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/get_current_user', methods=['GET'])
def get_current_user():
    """
    Get the currently authenticated user's information
    This is similar to check_auth but returns a simpler response
    """
    try:
        if not session.get('user_id'):
            return jsonify({"error": "Not authenticated"}), 401
        
        user_id = session['user_id']
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@auth_bp.route('/admin/sellers', methods=['GET'])
def get_all_sellers():
    try:
        # Check if user is admin
        if not session.get('is_admin'):
            return jsonify({"error": "Admin access required"}), 403
        
        sellers = User.query.filter_by(account_type='seller').all()
        return jsonify({
            "sellers": [seller.to_dict() for seller in sellers]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@auth_bp.route('/admin/sellers/<int:seller_id>', methods=['DELETE'])
def delete_seller(seller_id):
    try:
        if not session.get('is_admin'):
            return jsonify({"error": "Admin access required"}), 403
        
        seller = User.query.filter_by(id=seller_id, account_type='seller').first()
        if not seller:
            return jsonify({"error": "Seller not found"}), 404
        
        db.session.delete(seller)
        db.session.commit()
        
        return jsonify({"message": "Seller deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@auth_bp.route('/admin/sellers/<int:seller_id>/status', methods=['PATCH'])
def update_seller_status(seller_id):
    try:
        if not session.get('is_admin'):
            return jsonify({"error": "Admin access required"}), 403
        
        seller = User.query.filter_by(id=seller_id, account_type='seller').first()
        if not seller:
            return jsonify({"error": "Seller not found"}), 404
        
        data = request.get_json()
        new_status = data.get('status')
        
        if new_status not in ['active', 'suspended']:
            return jsonify({"error": "Invalid status"}), 400
        
        seller.status = new_status
        db.session.commit()
        
        return jsonify({"message": f"Seller status updated to {new_status}"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/admin/sellers/<int:seller_id>/approve', methods=['PATCH'])
def approve_seller(seller_id):
    try:
        if not session.get('is_admin'):
            return jsonify({"error": "Admin access required"}), 403
        
        seller = User.query.filter_by(id=seller_id, account_type='seller').first()
        if not seller:
            return jsonify({"error": "Seller not found"}), 404
        
        seller.status = 'active'
        db.session.commit()
        
        return jsonify({"message": "Seller approved successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

