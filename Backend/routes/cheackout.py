from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.order import Order
from models.order_item import OrderItem
from models.shipping_info import ShippingInfo
from models.payment_info import PaymentInfo
from app import db
import random

checkout_bp = Blueprint('checkout', __name__)

@checkout_bp.route('/api/checkout', methods=['POST'])
@jwt_required()
def create_order():
    try:
        # Get current user ID from JWT
        current_user_id = get_jwt_identity()
        
        # Get data from request
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['items', 'subtotal', 'tax', 'shipping', 'total', 'shipping_info', 'payment_method']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Generate order number
        order_number = f"ORD-{random.randint(100000, 999999)}"
        
        # Create new order
        new_order = Order(
            user_id=current_user_id,
            order_number=order_number,
            subtotal=data['subtotal'],
            tax=data['tax'],
            shipping=data['shipping'],
            total=data['total'],
            payment_method=data['payment_method']
        )
        
        db.session.add(new_order)
        db.session.flush()  # Flush to get the order ID without committing
        
        # Add order items
        for item_data in data['items']:
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item_data.get('id'),
                name=item_data.get('name'),
                price=item_data.get('price'),
                quantity=item_data.get('quantity'),
                image_url=item_data.get('imageUrl'),
                color=item_data.get('color'),
                size=item_data.get('size')
            )
            db.session.add(order_item)
        
        # Add shipping info
        shipping_data = data['shipping_info']
        shipping_info = ShippingInfo(
            order_id=new_order.id,
            first_name=shipping_data.get('firstName'),
            last_name=shipping_data.get('lastName'),
            email=shipping_data.get('email'),
            phone=shipping_data.get('phone'),
            address=shipping_data.get('address'),
            city=shipping_data.get('city'),
            state=shipping_data.get('state'),
            zip_code=shipping_data.get('zip'),
            country=shipping_data.get('country', 'Kenya')
        )
        db.session.add(shipping_info)
        
        # Add payment info based on payment method
        payment_info = PaymentInfo(order_id=new_order.id)
        
        if data['payment_method'] == 'card':
            payment_info.card_number = data.get('card_number', '')[-4:]  # Store only last 4 digits
            payment_info.card_name = data.get('card_name', '')
            payment_info.expiry = data.get('expiry', '')
            payment_info.cvv = data.get('cvv', '')
        elif data['payment_method'] in ['mpesa', 'evc']:
            payment_info.phone_number = data.get('phone_number', '')
        elif data['payment_method'] == 'paypill':
            payment_info.paypill_email = data.get('paypill_email', '')
            
        db.session.add(payment_info)
        
        # Commit all changes
        db.session.commit()
        
        return jsonify({
            'message': 'Order created successfully',
            'order': new_order.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@checkout_bp.route('/api/orders', methods=['GET'])
@jwt_required()
def get_user_orders():
    try:
        # Get current user ID from JWT
        current_user_id = get_jwt_identity()
        
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Query orders for the current user
        orders = Order.query.filter_by(user_id=current_user_id)\
            .order_by(Order.created_at.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'orders': [order.to_dict() for order in orders.items],
            'total': orders.total,
            'pages': orders.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@checkout_bp.route('/api/orders/<order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    try:
        # Get current user ID from JWT
        current_user_id = get_jwt_identity()
        
        # Find the order
        order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        return jsonify({'order': order.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500