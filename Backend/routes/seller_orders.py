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

@seller_orders_bp.route('/seller/dashboard/stats', methods=['GET'])
def get_seller_dashboard_stats():
    """Get comprehensive dashboard statistics for the seller"""
    try:
        is_auth, seller_id = require_seller_auth()
        if not is_auth:
            return jsonify({"error": "Unauthorized - Seller access required"}), 401
        
        # Get product counts by category (using lowercase to match database)
        clothes_count = Product.query.filter_by(seller_id=seller_id, category='clothes').count()
        cosmetics_count = Product.query.filter_by(seller_id=seller_id, category='cosmetics').count()
        electronics_count = Product.query.filter_by(seller_id=seller_id, category='electronics').count()
        sports_count = Product.query.filter_by(seller_id=seller_id, category='sports').count()
        
        # Get order statistics
        total_orders = db.session.query(Order).join(OrderItem).join(Product).filter(
            Product.seller_id == seller_id
        ).distinct().count()
        
        # Get revenue (from delivered orders only)
        revenue_result = db.session.query(
            db.func.sum(OrderItem.price * OrderItem.quantity)
        ).join(Order).join(Product).filter(
            and_(Product.seller_id == seller_id, Order.status == 'delivered')
        ).scalar()
        
        total_revenue = float(revenue_result) if revenue_result else 0.0
        
        # Get unique customers count (distinct users who have ordered from this seller)
        customers_count = db.session.query(Order.user_id).join(OrderItem).join(Product).filter(
            Product.seller_id == seller_id
        ).distinct().count()
        
        # Get recent activities (last 10 notifications)
        recent_notifications = Notification.query.filter_by(target_user=seller_id).order_by(
            Notification.date.desc()
        ).limit(10).all()
        
        # Format recent activities
        recent_activities = []
        for notif in recent_notifications:
            # Calculate time ago
            time_diff = datetime.utcnow() - notif.date
            if time_diff.days > 0:
                time_ago = f"{time_diff.days} day{'s' if time_diff.days > 1 else ''} ago"
            elif time_diff.seconds > 3600:
                hours = time_diff.seconds // 3600
                time_ago = f"{hours} hour{'s' if hours > 1 else ''} ago"
            elif time_diff.seconds > 60:
                minutes = time_diff.seconds // 60
                time_ago = f"{minutes} min ago"
            else:
                time_ago = "Just now"
            
            recent_activities.append({
                "id": notif.id,
                "type": notif.type,
                "title": notif.title,
                "message": notif.message,
                "time_ago": time_ago,
                "read": notif.read
            })
        
        return jsonify({
            "product_counts": {
                "clothes": clothes_count,
                "cosmetics": cosmetics_count,
                "electronics": electronics_count,
                "sports": sports_count,
                "total": clothes_count + cosmetics_count + electronics_count + sports_count
            },
            "order_stats": {
                "total_orders": total_orders,
                "total_revenue": total_revenue,
                "customers_count": customers_count
            },
            "recent_activities": recent_activities
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@seller_orders_bp.route('/seller/analytics', methods=['GET'])
def get_seller_analytics():
    """Get comprehensive analytics data for the seller"""
    try:
        is_auth, seller_id = require_seller_auth()
        if not is_auth:
            return jsonify({"error": "Unauthorized - Seller access required"}), 401
        
        time_range = request.args.get('time_range', 'monthly')  # daily, weekly, monthly
        
        # Get basic stats
        total_orders = db.session.query(Order).join(OrderItem).join(Product).filter(
            Product.seller_id == seller_id
        ).distinct().count()
        
        # Get revenue (from all orders, not just delivered)
        revenue_result = db.session.query(
            db.func.sum(OrderItem.price * OrderItem.quantity)
        ).join(Order).join(Product).filter(
            Product.seller_id == seller_id
        ).scalar()
        total_revenue = float(revenue_result) if revenue_result else 0.0
        
        # Calculate average order value
        avg_order_value = total_revenue / total_orders if total_orders > 0 else 0.0
        
        # Get unique customers count
        customers_count = db.session.query(Order.user_id).join(OrderItem).join(Product).filter(
            Product.seller_id == seller_id
        ).distinct().count()
        
        # Calculate conversion rate (simplified - orders vs unique customers)
        conversion_rate = (customers_count / total_orders * 100) if total_orders > 0 else 0.0
        
        # Get monthly revenue data (last 12 months)
        from sqlalchemy import extract, func
        monthly_revenue = db.session.query(
            extract('month', Order.created_at).label('month'),
            func.sum(OrderItem.price * OrderItem.quantity).label('revenue')
        ).join(OrderItem).join(Product).filter(
            Product.seller_id == seller_id,
            extract('year', Order.created_at) == datetime.utcnow().year
        ).group_by(extract('month', Order.created_at)).all()
        
        # Convert to list format for charts
        revenue_data = [0] * 12
        for month, revenue in monthly_revenue:
            if month:
                revenue_data[int(month) - 1] = float(revenue) if revenue else 0
        
        # Get monthly orders data
        monthly_orders = db.session.query(
            extract('month', Order.created_at).label('month'),
            func.count(func.distinct(Order.id)).label('orders')
        ).join(OrderItem).join(Product).filter(
            Product.seller_id == seller_id,
            extract('year', Order.created_at) == datetime.utcnow().year
        ).group_by(extract('month', Order.created_at)).all()
        
        orders_data = [0] * 12
        for month, orders in monthly_orders:
            if month:
                orders_data[int(month) - 1] = int(orders) if orders else 0
        
        # Get top buyers
        top_buyers_query = db.session.query(
            Order.user_id,
            User.firstname,
            User.secondname,
            User.email,
            func.count(func.distinct(Order.id)).label('order_count'),
            func.sum(OrderItem.price * OrderItem.quantity).label('total_value')
        ).join(OrderItem).join(Product).join(User, Order.user_id == User.id).filter(
            Product.seller_id == seller_id
        ).group_by(Order.user_id, User.firstname, User.secondname, User.email).order_by(
            func.sum(OrderItem.price * OrderItem.quantity).desc()
        ).limit(5).all()
        
        top_buyers = []
        for buyer in top_buyers_query:
            top_buyers.append({
                "name": f"{buyer.firstname} {buyer.secondname}",
                "email": buyer.email,
                "purchases": buyer.order_count,
                "value": float(buyer.total_value) if buyer.total_value else 0,
                "location": "N/A"  # Add location field to user model if needed
            })
        
        # Get sales by category
        category_sales = db.session.query(
            Product.category,
            func.sum(OrderItem.price * OrderItem.quantity).label('total_sales'),
            func.count(OrderItem.id).label('item_count')
        ).join(OrderItem).join(Order).filter(
            Product.seller_id == seller_id
        ).group_by(Product.category).all()
        
        purchase_categories = []
        total_category_sales = sum(float(sale.total_sales) for sale in category_sales if sale.total_sales)
        
        for category in category_sales:
            if category.total_sales:
                percentage = (float(category.total_sales) / total_category_sales * 100) if total_category_sales > 0 else 0
                purchase_categories.append({
                    "category": category.category.title(),
                    "percentage": round(percentage, 1),
                    "value": float(category.total_sales)
                })
        
        # Get new vs returning buyers (simplified)
        new_buyers_monthly = [max(0, orders_data[i] - (orders_data[i-1] if i > 0 else 0)) for i in range(12)]
        returning_buyers_monthly = [max(0, orders_data[i] - new_buyers_monthly[i]) for i in range(12)]
        
        # Mock buyer demographics (you can enhance this with real age data if available)
        buyer_demographics = [
            {"ageGroup": "18-24", "percentage": 20, "value": int(customers_count * 0.2)},
            {"ageGroup": "25-34", "percentage": 35, "value": int(customers_count * 0.35)},
            {"ageGroup": "35-44", "percentage": 25, "value": int(customers_count * 0.25)},
            {"ageGroup": "45-54", "percentage": 15, "value": int(customers_count * 0.15)},
            {"ageGroup": "55+", "percentage": 5, "value": int(customers_count * 0.05)}
        ]
        
        return jsonify({
            "totalRevenue": {
                "current": total_revenue,
                "previous": total_revenue * 0.85,  # Mock previous period
                "change": 18.4,  # Mock change percentage
                "data": revenue_data
            },
            "totalOrders": {
                "current": total_orders,
                "previous": int(total_orders * 0.79),
                "change": 26.4,
                "data": orders_data
            },
            "averageOrderValue": {
                "current": avg_order_value,
                "previous": avg_order_value * 0.94,
                "change": 5.96,
                "data": [avg_order_value] * 12  # Mock monthly AOV data
            },
            "conversionRate": {
                "current": conversion_rate,
                "previous": conversion_rate * 0.77,
                "change": 23.1,
                "data": [conversion_rate] * 12  # Mock monthly conversion data
            },
            "buyerDemographics": buyer_demographics,
            "topBuyers": top_buyers,
            "purchaseCategories": purchase_categories,
            "buyerActivity": {
                "labels": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                "newBuyers": new_buyers_monthly,
                "returningBuyers": returning_buyers_monthly
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@seller_orders_bp.route('/seller/earnings', methods=['GET'])
def get_seller_earnings():
    """Get comprehensive earnings data for the seller"""
    try:
        is_auth, seller_id = require_seller_auth()
        if not is_auth:
            return jsonify({"error": "Unauthorized - Seller access required"}), 401
        
        time_range = request.args.get('time_range', 'monthly')  # daily, weekly, monthly, yearly
        
        # Get total earnings from all orders (delivered and processing)
        total_earnings_result = db.session.query(
            db.func.sum(OrderItem.price * OrderItem.quantity)
        ).join(Order).join(Product).filter(
            Product.seller_id == seller_id,
            Order.status.in_(['delivered', 'processing', 'shipped'])
        ).scalar()
        total_earnings = float(total_earnings_result) if total_earnings_result else 0.0
        
        # Get this month's earnings
        from sqlalchemy import extract, func
        current_month = datetime.utcnow().month
        current_year = datetime.utcnow().year
        
        this_month_earnings = db.session.query(
            func.sum(OrderItem.price * OrderItem.quantity)
        ).join(Order).join(Product).filter(
            Product.seller_id == seller_id,
            Order.status.in_(['delivered', 'processing', 'shipped']),
            extract('month', Order.created_at) == current_month,
            extract('year', Order.created_at) == current_year
        ).scalar()
        this_month_earnings = float(this_month_earnings) if this_month_earnings else 0.0
        
        # Get pending earnings (orders not yet delivered)
        pending_earnings = db.session.query(
            func.sum(OrderItem.price * OrderItem.quantity)
        ).join(Order).join(Product).filter(
            Product.seller_id == seller_id,
            Order.status.in_(['pending', 'processing', 'shipped'])
        ).scalar()
        pending_earnings = float(pending_earnings) if pending_earnings else 0.0
        
        # Get completed earnings (delivered orders only)
        completed_earnings = db.session.query(
            func.sum(OrderItem.price * OrderItem.quantity)
        ).join(Order).join(Product).filter(
            Product.seller_id == seller_id,
            Order.status == 'delivered'
        ).scalar()
        completed_earnings = float(completed_earnings) if completed_earnings else 0.0
        
        # Get monthly earnings for the past 12 months
        monthly_earnings = []
        monthly_orders = []
        
        for i in range(12):
            target_month = (current_month - i - 1) % 12 + 1
            target_year = current_year if (current_month - i - 1) >= 0 else current_year - 1
            
            month_earnings = db.session.query(
                func.sum(OrderItem.price * OrderItem.quantity)
            ).join(Order).join(Product).filter(
                Product.seller_id == seller_id,
                Order.status.in_(['delivered', 'processing', 'shipped']),
                extract('month', Order.created_at) == target_month,
                extract('year', Order.created_at) == target_year
            ).scalar()
            
            month_orders = db.session.query(
                func.count(func.distinct(Order.id))
            ).join(OrderItem).join(Product).filter(
                Product.seller_id == seller_id,
                extract('month', Order.created_at) == target_month,
                extract('year', Order.created_at) == target_year
            ).scalar()
            
            monthly_earnings.insert(0, float(month_earnings) if month_earnings else 0.0)
            monthly_orders.insert(0, int(month_orders) if month_orders else 0)
        
        # Get recent transactions (last 10)
        recent_transactions = db.session.query(
            Order.id,
            Order.order_number,
            Order.created_at,
            Order.status,
            User.firstname,
            User.secondname,
            func.sum(OrderItem.price * OrderItem.quantity).label('order_total')
        ).join(OrderItem).join(Product).join(User, Order.user_id == User.id).filter(
            Product.seller_id == seller_id
        ).group_by(
            Order.id, Order.order_number, Order.created_at, Order.status, 
            User.firstname, User.secondname
        ).order_by(Order.created_at.desc()).limit(10).all()
        
        transactions = []
        for transaction in recent_transactions:
            transactions.append({
                "id": f"#ORD-{transaction.id}",
                "customer": f"{transaction.firstname} {transaction.secondname}",
                "date": transaction.created_at.strftime('%Y-%m-%d') if transaction.created_at else "N/A",
                "amount": float(transaction.order_total) if transaction.order_total else 0.0,
                "status": "completed" if transaction.status == "delivered" else 
                         "pending" if transaction.status in ["pending", "processing", "shipped"] else "failed"
            })
        
        # Calculate average order value
        total_orders = db.session.query(Order).join(OrderItem).join(Product).filter(
            Product.seller_id == seller_id
        ).distinct().count()
        
        avg_order_value = total_earnings / total_orders if total_orders > 0 else 0.0
        
        # Calculate conversion rate (orders vs unique customers)
        unique_customers = db.session.query(Order.user_id).join(OrderItem).join(Product).filter(
            Product.seller_id == seller_id
        ).distinct().count()
        
        conversion_rate = (unique_customers / total_orders * 100) if total_orders > 0 else 0.0
        
        # Calculate refund rate (cancelled orders)
        cancelled_orders = db.session.query(Order).join(OrderItem).join(Product).filter(
            Product.seller_id == seller_id,
            Order.status == 'cancelled'
        ).distinct().count()
        
        refund_rate = (cancelled_orders / total_orders * 100) if total_orders > 0 else 0.0
        
        # Calculate growth percentages (mock for previous periods)
        total_earnings_growth = 12.5 if total_earnings > 0 else 0.0
        this_month_growth = 8.3 if this_month_earnings > 0 else 0.0
        pending_change = -3.2 if pending_earnings > 0 else 0.0
        completed_growth = 10.7 if completed_earnings > 0 else 0.0
        
        return jsonify({
            "totalEarnings": {
                "current": total_earnings,
                "growth": total_earnings_growth,
                "data": monthly_earnings
            },
            "thisMonth": {
                "current": this_month_earnings,
                "growth": this_month_growth
            },
            "pending": {
                "current": pending_earnings,
                "change": pending_change
            },
            "completed": {
                "current": completed_earnings,
                "growth": completed_growth
            },
            "earningsData": [
                {"month": "Jan", "earnings": monthly_earnings[0], "orders": monthly_orders[0]},
                {"month": "Feb", "earnings": monthly_earnings[1], "orders": monthly_orders[1]},
                {"month": "Mar", "earnings": monthly_earnings[2], "orders": monthly_orders[2]},
                {"month": "Apr", "earnings": monthly_earnings[3], "orders": monthly_orders[3]},
                {"month": "May", "earnings": monthly_earnings[4], "orders": monthly_orders[4]},
                {"month": "Jun", "earnings": monthly_earnings[5], "orders": monthly_orders[5]},
                {"month": "Jul", "earnings": monthly_earnings[6], "orders": monthly_orders[6]},
                {"month": "Aug", "earnings": monthly_earnings[7], "orders": monthly_orders[7]},
                {"month": "Sep", "earnings": monthly_earnings[8], "orders": monthly_orders[8]},
                {"month": "Oct", "earnings": monthly_earnings[9], "orders": monthly_orders[9]},
                {"month": "Nov", "earnings": monthly_earnings[10], "orders": monthly_orders[10]},
                {"month": "Dec", "earnings": monthly_earnings[11], "orders": monthly_orders[11]}
            ],
            "recentTransactions": transactions,
            "performanceMetrics": {
                "averageOrderValue": {
                    "current": avg_order_value,
                    "change": 5.2 if avg_order_value > 0 else 0.0
                },
                "conversionRate": {
                    "current": conversion_rate,
                    "change": 1.7 if conversion_rate > 0 else 0.0
                },
                "refundRate": {
                    "current": refund_rate,
                    "change": -0.8  # Negative is good for refunds
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500