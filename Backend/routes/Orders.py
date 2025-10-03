from flask import Blueprint, request, jsonify, session
from app import db
from app.models import Order, User, Product

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/api/seller/orders', methods=['GET'])
def get_seller_orders():
    seller_id = session.get('user_id')
    account_type = session.get('account_type')
    if not seller_id or account_type != 'seller':
        return jsonify({'error': 'Unauthorized'}), 401
    orders = Order.query.filter_by(seller_id=seller_id).order_by(Order.created_at.desc()).all()
    result = []
    for order in orders:
        buyer = User.query.get(order.user_id)
        product_names = [Product.query.get(item.product_id).name for item in order.items]
        result.append({
            'id': order.id,
            'order_number': order.order_number,
            'buyer_name': f"{buyer.firstname} {buyer.secondname}" if buyer else "",
            'items': [item.to_dict() for item in order.items],
            'status': order.status,
        })
    return jsonify(result), 200

@orders_bp.route('/api/seller/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    seller_id = session.get('user_id')
    if not seller_id:
        return jsonify({'error': 'Unauthorized'}), 401
    order = Order.query.filter_by(id=order_id, seller_id=seller_id).first()
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    data = request.get_json()
    status = data.get('status')
    if status not in ['approved', 'cancelled']:
        return jsonify({'error': 'Invalid status'}), 400
    order.status = status
    db.session.commit()
    return jsonify(order.to_dict()), 200

@orders_bp.route('/api/seller/orders/<int:order_id>', methods=['GET'])
def get_order_details(order_id):
    seller_id = session.get('user_id')
    if not seller_id:
        return jsonify({'error': 'Unauthorized'}), 401
    order = Order.query.filter_by(id=order_id, seller_id=seller_id).first()
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    return jsonify(order.to_dict()), 200

@orders_bp.route('/api/seller/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    seller_id = session.get('user_id')
    if not seller_id:
        return jsonify({'error': 'Unauthorized'}), 401
    order = Order.query.filter_by(id=order_id, seller_id=seller_id).first()
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    db.session.delete(order)
    db.session.commit()
    return jsonify({'message': 'Order deleted successfully'}), 200
