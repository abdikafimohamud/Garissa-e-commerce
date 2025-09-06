# from flask import Blueprint, request, jsonify
# from app import db
# from models.seller import Seller
# from models.admin_notifications import Notification
# from datetime import datetime
# import bcrypt

# sellers_bp = Blueprint('sellers', __name__)

# # Get all sellers
# @sellers_bp.route('/', methods=['GET'])
# def get_sellers():
#     try:
#         sellers = Seller.query.all()
#         return jsonify([seller.to_dict() for seller in sellers])
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # Get seller by ID
# @sellers_bp.route('/sellers/<int:seller_id>', methods=['GET'])
# def get_seller(seller_id):
#     try:
#         seller = Seller.query.get_or_404(seller_id)
#         return jsonify(seller.to_dict())
#     except Exception as e:
#         return jsonify({'error': str(e)}), 404

# # Seller login
# @sellers_bp.route('/login', methods=['POST'])
# def seller_login():
#     try:
#         data = request.get_json()
#         email = data.get('email')
#         password = data.get('password')

#         if not email or not password:
#             return jsonify({'error': 'Email and password are required'}), 400

#         seller = Seller.query.filter_by(email=email).first()
#         if not seller:
#             return jsonify({'error': 'Invalid credentials'}), 401

#         if seller.check_password(password):
#             # Return seller data (you might want to implement JWT for sellers too)
#             return jsonify({
#                 'message': 'Login successful',
#                 'seller': seller.to_dict()
#             }), 200
#         else:
#             return jsonify({'error': 'Invalid credentials'}), 401

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # Create new seller (registration)
# @sellers_bp.route('/register', methods=['POST'])
# def register_seller():
#     try:
#         data = request.get_json()
        
#         # Check if email already exists
#         existing_seller = Seller.query.filter_by(email=data['email']).first()
#         if existing_seller:
#             return jsonify({'error': 'Email already registered'}), 400

#         # Hash password
#         hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
#         seller = Seller(
#             firstname=data['firstname'],
#             secondname=data['secondname'],
#             email=data['email'],
#             password=hashed_password,
#             phone=data.get('phone'),
#             store_name=data.get('storeName'),
#             business_address=data.get('businessAddress'),
#             tax_id=data.get('taxId')
#         )
        
#         db.session.add(seller)
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Seller registered successfully. Waiting for admin approval.',
#             'seller': seller.to_dict()
#         }), 201
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 400

# # Update seller approval status (admin only)
# @sellers_bp.route('/sellers/<int:seller_id>/approval', methods=['PUT'])
# def update_seller_approval(seller_id):
#     try:
#         data = request.get_json()
#         seller = Seller.query.get_or_404(seller_id)
        
#         seller.is_approved = data.get('isApproved', seller.is_approved)
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Seller approval status updated',
#             'seller': seller.to_dict()
#         }), 200
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 400