from flask import Blueprint, request, jsonify, session
from app import db
from app.models import User, Order, OrderItem
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



