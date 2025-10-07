from flask import Blueprint, request, jsonify, session
from app import db
from app.models import Order, OrderItem, User, Product, Notification
from sqlalchemy import and_
from datetime import datetime

seller_orders_bp = Blueprint('seller_orders', __name__)

def require_seller_auth():
    """Check if user is authenticated and is a seller"""
    user_id = session.get('user_id')
    account_type = session.get('account_type')
    
    if not user_id or account_type != 'seller':
        return False, None
    return True, user_id

@seller_orders_bp.route('/seller/orders', methods=['GET'])
def get_seller_orders():
    """Get all orders for products owned by the current seller"""
    try:
        is_auth, seller_id = require_seller_auth()
        if not is_auth:
            return jsonify({"error": "Unauthorized - Seller access required"}), 401
        
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)
        status = request.args.get("status", "", type=str)
        
        # Get all orders that contain products from this seller
        query = db.session.query(Order).join(OrderItem).join(Product).filter(
            Product.seller_id == seller_id
        )
        
        if status:
            query = query.filter(Order.status == status)
        
        # Order by most recent first
        query = query.order_by(Order.created_at.desc())
        
        orders = query.paginate(page=page, per_page=per_page, error_out=False)
        
        order_list = []
        for order in orders.items:
            # Get only the items from this seller
            seller_items = [item for item in order.items if item.product.seller_id == seller_id]
            
            # Calculate seller's portion of the order
            seller_subtotal = sum(item.price * item.quantity for item in seller_items)
            
            order_dict = {
                "id": order.id,
                "order_number": order.order_number,
                "buyer": {
                    "id": order.user.id,
                    "name": f"{order.user.firstname} {order.user.secondname}",
                    "email": order.user.email
                },
                "status": order.status,
                "seller_items": [item.to_dict() for item in seller_items],
                "seller_subtotal": seller_subtotal,
                "shipping_address": order.shipping_address.to_dict() if order.shipping_address else None,
                "created_at": order.created_at.isoformat() if order.created_at else None,
                "updated_at": order.updated_at.isoformat() if order.updated_at else None
            }
            order_list.append(order_dict)
        
        return jsonify({
            "orders": order_list,
            "total": orders.total,
            "pages": orders.pages,
            "current_page": orders.page
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@seller_orders_bp.route('/seller/orders/<int:order_id>/status', methods=['PATCH'])
def update_order_status(order_id):
    """Update order status for orders containing seller's products"""
    try:
        is_auth, seller_id = require_seller_auth()
        if not is_auth:
            return jsonify({"error": "Unauthorized - Seller access required"}), 401
        
        data = request.get_json()
        if not data or 'status' not in data:
            return jsonify({"error": "Status field required"}), 400
        
        new_status = data['status']
        valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        
        if new_status not in valid_statuses:
            return jsonify({"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}), 400
        
        # Check if the order contains products from this seller
        order = db.session.query(Order).join(OrderItem).join(Product).filter(
            and_(Order.id == order_id, Product.seller_id == seller_id)
        ).first()
        
        if not order:
            return jsonify({"error": "Order not found or you don't have permission to update it"}), 404
        
        # Update order status
        order.status = new_status
        order.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "message": f"Order status updated to {new_status}",
            "order_id": order_id,
            "new_status": new_status
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@seller_orders_bp.route('/seller/orders/stats', methods=['GET'])
def get_seller_order_stats():
    """Get order statistics for the seller"""
    try:
        is_auth, seller_id = require_seller_auth()
        if not is_auth:
            return jsonify({"error": "Unauthorized - Seller access required"}), 401
        
        # Get counts for different order statuses
        stats = {}
        statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        
        for status in statuses:
            count = db.session.query(Order).join(OrderItem).join(Product).filter(
                and_(Product.seller_id == seller_id, Order.status == status)
            ).count()
            stats[status] = count
        
        # Get total revenue (from delivered orders only)
        revenue_result = db.session.query(
            db.func.sum(OrderItem.price * OrderItem.quantity)
        ).join(Order).join(Product).filter(
            and_(Product.seller_id == seller_id, Order.status == 'delivered')
        ).scalar()
        
        stats['total_revenue'] = float(revenue_result) if revenue_result else 0.0
        stats['total_orders'] = sum(stats[status] for status in statuses)
        
        return jsonify({"stats": stats}), 200
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@seller_orders_bp.route('/seller/orders/<int:order_id>', methods=['GET'])
def get_order_details(order_id):
    """Get detailed information about a specific order"""
    try:
        is_auth, seller_id = require_seller_auth()
        if not is_auth:
            return jsonify({"error": "Unauthorized - Seller access required"}), 401
        
        # Check if the order contains products from this seller
        order = db.session.query(Order).join(OrderItem).join(Product).filter(
            and_(Order.id == order_id, Product.seller_id == seller_id)
        ).first()
        
        if not order:
            return jsonify({"error": "Order not found or you don't have permission to view it"}), 404
        
        # Get only the items from this seller
        seller_items = [item for item in order.items if item.product.seller_id == seller_id]
        
        # Calculate seller's portion of the order
        seller_subtotal = sum(item.price * item.quantity for item in seller_items)
        
        order_details = {
            "id": order.id,
            "order_number": order.order_number,
            "buyer": {
                "id": order.user.id,
                "name": f"{order.user.firstname} {order.user.secondname}",
                "email": order.user.email,
                "phone": order.user.phone
            },
            "status": order.status,
            "seller_items": [item.to_dict() for item in seller_items],
            "seller_subtotal": seller_subtotal,
            "payment_method": order.payment_method,
            "shipping_address": order.shipping_address.to_dict() if order.shipping_address else None,
            "payment": order.payment.to_dict() if order.payment else None,
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "updated_at": order.updated_at.isoformat() if order.updated_at else None
        }
        
        return jsonify({"order": order_details}), 200
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@seller_orders_bp.route('/seller/notifications', methods=['GET'])
def get_seller_notifications():
    """Get notifications for the current seller"""
    try:
        is_auth, seller_id = require_seller_auth()
        if not is_auth:
            return jsonify({"error": "Unauthorized - Seller access required"}), 401
        
        notifications = Notification.query.filter_by(target_user=seller_id).order_by(
            Notification.date.desc()
        ).limit(20).all()
        
        return jsonify({
            "notifications": [notif.to_dict() for notif in notifications]
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@seller_orders_bp.route('/seller/notifications/<int:notification_id>/read', methods=['PATCH'])
def mark_notification_read(notification_id):
    """Mark a notification as read"""
    try:
        is_auth, seller_id = require_seller_auth()
        if not is_auth:
            return jsonify({"error": "Unauthorized - Seller access required"}), 401
        
        notification = Notification.query.filter_by(
            id=notification_id, target_user=seller_id
        ).first()
        
        if not notification:
            return jsonify({"error": "Notification not found"}), 404
        
        notification.read = True
        db.session.commit()
        
        return jsonify({"message": "Notification marked as read"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500