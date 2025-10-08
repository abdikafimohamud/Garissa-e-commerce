from flask import Blueprint, request, jsonify, session
from app import db
from app.models import User, Order, OrderItem, Product
from sqlalchemy import func

admin_bp = Blueprint("admin", __name__)

def require_admin_auth():
    """Check if user is authenticated and is an admin"""
    user_id = session.get('user_id')
    account_type = session.get('account_type')
    is_admin = session.get('is_admin', False)
    
    if not user_id or account_type != 'admin' or not is_admin:
        return False
    return True

# -------------------------
# GET admin dashboard stats
# -------------------------
@admin_bp.route("/dashboard/stats", methods=["GET"])
def get_admin_dashboard_stats():
    """Get comprehensive dashboard statistics for admin"""
    if not require_admin_auth():
        return jsonify({"error": "Unauthorized - Admin access required"}), 401

    try:
        # Get total counts
        total_sellers = User.query.filter_by(account_type="seller").count()
        total_buyers = User.query.filter_by(account_type="buyer").count()
        total_orders = Order.query.count()
        
        # Get total revenue from all orders
        total_revenue_result = db.session.query(
            func.sum(OrderItem.price * OrderItem.quantity)
        ).join(Order).scalar()
        total_revenue = float(total_revenue_result) if total_revenue_result else 0.0
        
        # Get active sellers and buyers
        active_sellers = User.query.filter_by(account_type="seller", status="active").count()
        active_buyers = User.query.filter_by(account_type="buyer", status="active").count()
        
        # Get orders by status
        pending_orders = Order.query.filter_by(status="pending").count()
        completed_orders = Order.query.filter_by(status="delivered").count()
        
        # Calculate growth percentages (simplified - you can enhance with real time-based calculations)
        seller_growth = 12.0 if total_sellers > 0 else 0.0
        buyer_growth = 8.0 if total_buyers > 0 else 0.0
        order_growth = 5.0 if total_orders > 0 else 0.0
        revenue_growth = 15.0 if total_revenue > 0 else 0.0

        return jsonify({
            "total_sellers": total_sellers,
            "total_buyers": total_buyers,
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "active_sellers": active_sellers,
            "active_buyers": active_buyers,
            "pending_orders": pending_orders,
            "completed_orders": completed_orders,
            "growth": {
                "sellers": seller_growth,
                "buyers": buyer_growth,
                "orders": order_growth,
                "revenue": revenue_growth
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# -------------------------
# GET all buyers
# -------------------------
@admin_bp.route("/buyers", methods=["GET"])
def get_buyers():
    # Check admin authentication
    if not require_admin_auth():
        return jsonify({"error": "Unauthorized - Admin access required"}), 401
    
    try:
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)
        search = request.args.get("search", "", type=str)

        query = User.query.filter_by(account_type="buyer")
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                (User.firstname.ilike(search_pattern)) |
                (User.secondname.ilike(search_pattern)) |
                (User.email.ilike(search_pattern)) |
                (User.phone.ilike(search_pattern))
            )

        buyers = query.paginate(page=page, per_page=per_page, error_out=False)

        return jsonify({
            "buyers": [
                {
                    "id": b.id,
                    "firstname": b.firstname,
                    "secondname": b.secondname,
                    "email": b.email,
                    "phone": b.phone,
                    "status": getattr(b, "status", "active"),
                }
                for b in buyers.items
            ],
            "total": buyers.total,
            "pages": buyers.pages,
            "current_page": buyers.page
        }), 200
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# -------------------------
# GET a single buyer
# -------------------------
@admin_bp.route("/buyers/<int:id>", methods=["GET"])
def get_buyer(id):
    buyer = User.query.filter_by(id=id, account_type="buyer").first()
    if not buyer:
        return jsonify({"error": "Buyer not found"}), 404

    return jsonify({
        "id": buyer.id,
        "firstname": buyer.firstname,
        "secondname": buyer.secondname,
        "email": buyer.email,
        "phone": buyer.phone,
        "status": getattr(buyer, "status", "active")
    }), 200

# -------------------------
# PATCH update buyer
# -------------------------
@admin_bp.route("/buyers/<int:id>", methods=["PATCH"])
def update_buyer(id):
    buyer = User.query.filter_by(id=id, account_type="buyer").first()
    if not buyer:
        return jsonify({"error": "Buyer not found"}), 404

    data = request.json
    buyer.firstname = data.get("firstname", buyer.firstname)
    buyer.secondname = data.get("secondname", buyer.secondname)
    buyer.email = data.get("email", buyer.email)
    buyer.phone = data.get("phone", buyer.phone)
    if "status" in data:
        buyer.status = data["status"]

    db.session.commit()

    return jsonify({"message": "Buyer updated successfully"}), 200

# -------------------------
# DELETE buyer
# -------------------------
@admin_bp.route("/buyers/<int:id>", methods=["DELETE"])
def delete_buyer(id):
    buyer = User.query.filter_by(id=id, account_type="buyer").first()
    if not buyer:
        return jsonify({"error": "Buyer not found"}), 404

    db.session.delete(buyer)
    db.session.commit()

    return jsonify({"message": "Buyer deleted successfully"}), 200

# -------------------------
# PATCH suspend/activate buyer
# -------------------------
@admin_bp.route("/buyers/<int:id>/status", methods=["PATCH"])
def update_buyer_status(id):
    buyer = User.query.filter_by(id=id, account_type="buyer").first()
    if not buyer:
        return jsonify({"error": "Buyer not found"}), 404

    data = request.json
    if "status" not in data:
        return jsonify({"error": "Status field required"}), 400

    buyer.status = data["status"]
    db.session.commit()

    return jsonify({"message": f"Buyer {data['status']} successfully"}), 200

# -------------------------
# GET seller order statistics
# -------------------------
@admin_bp.route("/sellers/orders-stats", methods=["GET"])
def get_seller_orders_stats():
    """Get order statistics for all sellers"""
    if not require_admin_auth():
        return jsonify({"error": "Unauthorized - Admin access required"}), 401

    try:
        # Get all sellers
        sellers = User.query.filter_by(account_type="seller").all()
        
        seller_stats = []
        for seller in sellers:
            # Get seller's products
            seller_products = Product.query.filter_by(seller_id=seller.id).all()
            product_ids = [product.id for product in seller_products]
            
            if product_ids:
                # Get orders for seller's products
                pending_orders = db.session.query(Order).join(OrderItem).filter(
                    OrderItem.product_id.in_(product_ids),
                    Order.status.in_(['pending', 'processing', 'confirmed'])
                ).count()
                
                completed_orders = db.session.query(Order).join(OrderItem).filter(
                    OrderItem.product_id.in_(product_ids),
                    Order.status.in_(['delivered', 'completed'])
                ).count()
                
                total_orders = pending_orders + completed_orders
                
                # Calculate total revenue for this seller
                total_revenue = db.session.query(
                    func.sum(OrderItem.price * OrderItem.quantity)
                ).join(Order).filter(
                    OrderItem.product_id.in_(product_ids),
                    Order.status.in_(['delivered', 'completed'])
                ).scalar() or 0
            else:
                pending_orders = 0
                completed_orders = 0
                total_orders = 0
                total_revenue = 0
            
            seller_stats.append({
                "id": seller.id,
                "name": f"{seller.firstname} {seller.secondname}",
                "email": seller.email,
                "phone": seller.phone,
                "status": seller.status,
                "total_products": len(seller_products),
                "pending_orders": pending_orders,
                "completed_orders": completed_orders,
                "total_orders": total_orders,
                "total_revenue": float(total_revenue)
            })
        
        return jsonify({
            "sellers": seller_stats,
            "total_sellers": len(sellers)
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# -------------------------
# GET specific seller orders
# -------------------------
@admin_bp.route("/sellers/<int:seller_id>/orders", methods=["GET"])
def get_seller_orders(seller_id):
    """Get detailed orders for a specific seller"""
    if not require_admin_auth():
        return jsonify({"error": "Unauthorized - Admin access required"}), 401

    try:
        # Get seller
        seller = User.query.filter_by(id=seller_id, account_type="seller").first()
        if not seller:
            return jsonify({"error": "Seller not found"}), 404

        # Get seller's products
        seller_products = Product.query.filter_by(seller_id=seller.id).all()
        product_ids = [product.id for product in seller_products]
        
        if not product_ids:
            return jsonify({"orders": [], "seller": seller.firstname + " " + seller.secondname}), 200
        
        # Get orders with details
        orders = db.session.query(Order, OrderItem, Product, User).join(
            OrderItem, Order.id == OrderItem.order_id
        ).join(
            Product, OrderItem.product_id == Product.id
        ).join(
            User, Order.user_id == User.id
        ).filter(
            Product.id.in_(product_ids)
        ).all()
        
        order_details = []
        for order, order_item, product, buyer in orders:
            order_details.append({
                "order_id": order.id,
                "order_number": order.order_number,
                "buyer_name": f"{buyer.firstname} {buyer.secondname}",
                "buyer_email": buyer.email,
                "product_name": product.name,
                "quantity": order_item.quantity,
                "price": float(order_item.price),
                "total": float(order_item.price * order_item.quantity),
                "status": order.status,
                "order_date": order.created_at.isoformat() if order.created_at else "N/A",
                "shipping_address_id": order.shipping_address_id
            })
        
        return jsonify({
            "orders": order_details,
            "seller": f"{seller.firstname} {seller.secondname}"
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# -------------------------
# GET analytics data
# -------------------------
@admin_bp.route("/analytics/dashboard", methods=["GET"])
def get_analytics_dashboard():
    """Get comprehensive analytics data for admin dashboard"""
    if not require_admin_auth():
        return jsonify({"error": "Unauthorized - Admin access required"}), 401

    try:
        from datetime import datetime, timedelta
        
        # Calculate date ranges
        now = datetime.now()
        current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
        last_month_end = current_month_start - timedelta(days=1)
        
        # Current month data
        current_month_orders = Order.query.filter(Order.created_at >= current_month_start).all()
        current_month_revenue = db.session.query(
            func.sum(OrderItem.price * OrderItem.quantity)
        ).join(Order).filter(Order.created_at >= current_month_start).scalar() or 0
        
        # Last month data for comparison
        last_month_orders = Order.query.filter(
            Order.created_at >= last_month_start,
            Order.created_at <= last_month_end
        ).all()
        last_month_revenue = db.session.query(
            func.sum(OrderItem.price * OrderItem.quantity)
        ).join(Order).filter(
            Order.created_at >= last_month_start,
            Order.created_at <= last_month_end
        ).scalar() or 0
        
        # Calculate growth percentages
        def calculate_growth(current, previous):
            if previous == 0:
                return 100.0 if current > 0 else 0.0
            return round(((current - previous) / previous) * 100, 1)
        
        current_orders_count = len(current_month_orders)
        last_orders_count = len(last_month_orders)
        
        # Active users (users who made orders this month)
        current_active_users = db.session.query(User.id).join(Order).filter(
            Order.created_at >= current_month_start
        ).distinct().count()
        
        last_active_users = db.session.query(User.id).join(Order).filter(
            Order.created_at >= last_month_start,
            Order.created_at <= last_month_end
        ).distinct().count()
        
        # Monthly data for the last 12 months
        monthly_data = []
        for i in range(12):
            month_start = (now.replace(day=1) - timedelta(days=31*i)).replace(day=1)
            next_month = (month_start.replace(day=28) + timedelta(days=4)).replace(day=1)
            
            month_orders = Order.query.filter(
                Order.created_at >= month_start,
                Order.created_at < next_month
            ).count()
            
            month_revenue = db.session.query(
                func.sum(OrderItem.price * OrderItem.quantity)
            ).join(Order).filter(
                Order.created_at >= month_start,
                Order.created_at < next_month
            ).scalar() or 0
            
            month_users = db.session.query(User.id).join(Order).filter(
                Order.created_at >= month_start,
                Order.created_at < next_month
            ).distinct().count()
            
            monthly_data.append({
                "month": month_start.strftime("%b"),
                "orders": month_orders,
                "revenue": float(month_revenue),
                "users": month_users
            })
        
        monthly_data.reverse()  # Show oldest to newest
        
        # Top products
        top_products = db.session.query(
            Product.name,
            func.sum(OrderItem.quantity).label('total_sold'),
            func.sum(OrderItem.price * OrderItem.quantity).label('total_revenue')
        ).join(OrderItem).join(Order).filter(
            Order.created_at >= current_month_start
        ).group_by(Product.id, Product.name).order_by(
            func.sum(OrderItem.quantity).desc()
        ).limit(5).all()
        
        # Order status distribution
        order_statuses = db.session.query(
            Order.status,
            func.count(Order.id).label('count')
        ).filter(Order.created_at >= current_month_start).group_by(Order.status).all()
        
        # Calculate conversion rate (orders/active users)
        current_conversion = round((current_orders_count / current_active_users * 100), 1) if current_active_users > 0 else 0
        last_conversion = round((last_orders_count / last_active_users * 100), 1) if last_active_users > 0 else 0
        
        return jsonify({
            "metrics": {
                "total_sales": {
                    "current": current_orders_count,
                    "previous": last_orders_count,
                    "change": calculate_growth(current_orders_count, last_orders_count),
                    "data": [month["orders"] for month in monthly_data]
                },
                "active_users": {
                    "current": current_active_users,
                    "previous": last_active_users,
                    "change": calculate_growth(current_active_users, last_active_users),
                    "data": [month["users"] for month in monthly_data]
                },
                "revenue": {
                    "current": float(current_month_revenue),
                    "previous": float(last_month_revenue),
                    "change": calculate_growth(current_month_revenue, last_month_revenue),
                    "data": [month["revenue"] for month in monthly_data]
                },
                "conversion_rate": {
                    "current": current_conversion,
                    "previous": last_conversion,
                    "change": calculate_growth(current_conversion, last_conversion),
                    "data": [round((monthly_data[i]["orders"] / monthly_data[i]["users"] * 100), 1) if monthly_data[i]["users"] > 0 else 0 for i in range(12)]
                }
            },
            "monthly_data": monthly_data,
            "top_products": [
                {
                    "name": product.name,
                    "sales": int(product.total_sold),
                    "revenue": float(product.total_revenue)
                }
                for product in top_products
            ],
            "order_statuses": [
                {
                    "status": status.status,
                    "count": status.count,
                    "percentage": round((status.count / current_orders_count * 100), 1) if current_orders_count > 0 else 0
                }
                for status in order_statuses
            ]
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

