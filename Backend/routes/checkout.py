from flask import Blueprint, request, jsonify, session
from app import db
from app.models import Order, OrderItem, Address, Payment, User, Product, Notification
from datetime import datetime
import random
import string

checkout_bp = Blueprint('checkout', __name__)

def generate_order_number():
    """Generate a unique order number"""
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"ORD-{timestamp}-{random_str}"

def check_auth():
    """Helper function to check authentication"""
    if not session.get('user_id'):
        return None
    return session['user_id']

@checkout_bp.route('/checkout', methods=['POST'])
def create_order():
    try:
        current_user_id = check_auth()
        if not current_user_id:
            return jsonify({"error": "Not authenticated"}), 401
            
        data = request.get_json()
        
        # Validate required fields
        if not data.get('items') or not data.get('shipping_info'):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Calculate totals
        subtotal = sum(item['price'] * item['quantity'] for item in data['items'])
        tax = data.get('tax', subtotal * 0.08)
        shipping = data.get('shipping', 0 if subtotal > 100 else 15)
        total = subtotal + tax + shipping
        
        # Create or get shipping address
        shipping_info = data['shipping_info']
        address = Address(
            user_id=current_user_id,
            first_name=shipping_info['firstName'],
            last_name=shipping_info['lastName'],
            email=shipping_info['email'],
            phone=shipping_info['phone'],
            address=shipping_info['address'],
            city=shipping_info['city'],
            state=shipping_info['state'],
            zip_code=shipping_info['zip'],
            country=shipping_info.get('country', 'Kenya')
        )
        db.session.add(address)
        db.session.flush()
        
        # Create order
        order = Order(
            order_number=generate_order_number(),
            user_id=current_user_id,
            subtotal=subtotal,
            tax=tax,
            shipping=shipping,
            total=total,
            payment_method=data['payment_method'],
            shipping_address_id=address.id,
            status='pending'
        )
        db.session.add(order)
        db.session.flush()
        
        # Create order items
        for item_data in data['items']:
            item = OrderItem(
                order_id=order.id,
                product_id=item_data['id'],
                quantity=item_data['quantity'],
                price=item_data['price'],
                color=item_data.get('color'),
                size=item_data.get('size')
            )
            db.session.add(item)
        
        # Create payment record
        payment_data = {
            'order_id': order.id,
            'user_id': current_user_id,
            'payment_method': data['payment_method'],
            'amount': total,
            'status': 'pending'
        }
        
        # Add payment method specific details
        if data['payment_method'] == 'card':
            payment_data['card_last_four'] = data.get('card_number', '')[-4:] if data.get('card_number') else None
        elif data['payment_method'] in ['mpesa', 'evc']:
            payment_data['phone_number'] = data.get('phone_number') or shipping_info['phone']
        elif data['payment_method'] == 'paypill':
            payment_data['paypill_email'] = data.get('paypill_email')
        
        payment = Payment(**payment_data)
        db.session.add(payment)
        
        # Commit all changes
        db.session.commit()
        
        # Create notifications for sellers
        sellers_notified = set()  # Track unique sellers to avoid duplicate notifications
        buyer = User.query.get(current_user_id)
        
        for item_data in data['items']:
            product = Product.query.get(item_data['id'])
            if product and product.seller_id not in sellers_notified:
                notification = Notification(
                    title="New Order Received!",
                    message=f"You have a new order from {buyer.firstname} {buyer.secondname}. Order #{order.order_number} contains your product '{product.name}'. Please check your orders dashboard to manage this order.",
                    type="order",
                    sender_role="system",
                    target_user=product.seller_id,
                    date=datetime.utcnow(),
                    read=False
                )
                db.session.add(notification)
                sellers_notified.add(product.seller_id)
        
        # Simulate payment processing
        payment.status = 'completed'
        order.status = 'processing'
        db.session.commit()
        
        # Store order in session for immediate access
        if 'user_orders' not in session:
            session['user_orders'] = {}
        
        user_orders = session['user_orders']
        if str(current_user_id) not in user_orders:
            user_orders[str(current_user_id)] = []
        
        user_orders[str(current_user_id)].append({
            'id': order.order_number,
            'date': order.created_at.isoformat(),
            'status': order.status,
            'items': data['items'],
            'subtotal': subtotal,
            'tax': tax,
            'shipping': shipping,
            'total': total,
            'paymentMethod': data['payment_method'],
            'shippingInfo': shipping_info
        })
        
        session['user_orders'] = user_orders
        session.modified = True
        
        return jsonify({
            "message": "Order created successfully",
            "order": order.to_dict(),
            "payment": payment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@checkout_bp.route('/orders/<int:user_id>', methods=['GET'])
def get_user_orders(user_id):
    try:
        current_user_id = check_auth()
        if not current_user_id or current_user_id != user_id:
            return jsonify({"error": "Not authenticated"}), 401
            
        # First check session for orders
        user_orders = session.get('user_orders', {}).get(str(user_id), [])
        
        # If no orders in session, check database
        if not user_orders:
            orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
            user_orders = [order.to_dict() for order in orders]
            
            # Store in session for future requests
            if 'user_orders' not in session:
                session['user_orders'] = {}
            session['user_orders'][str(user_id)] = user_orders
            session.modified = True
        
        return jsonify({
            "orders": user_orders
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500