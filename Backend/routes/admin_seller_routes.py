from flask import Blueprint, request, jsonify, session
from app import db
from app.models import User

admin_seller_bp = Blueprint("admin_seller", __name__)

def require_admin_auth():
    """Check if user is authenticated and is an admin"""
    user_id = session.get('user_id')
    account_type = session.get('account_type')
    is_admin = session.get('is_admin', False)
    
    if not user_id or account_type != 'admin' or not is_admin:
        return False
    return True

# -------------------------
# GET all sellers
# -------------------------
@admin_seller_bp.route("/sellers", methods=["GET"])
def get_sellers():
    # Check admin authentication
    if not require_admin_auth():
        return jsonify({"error": "Unauthorized - Admin access required"}), 401
    
    try:
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)
        search = request.args.get("search", "", type=str)

        query = User.query.filter_by(account_type="seller")
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                (User.firstname.ilike(search_pattern)) |
                (User.secondname.ilike(search_pattern)) |
                (User.email.ilike(search_pattern)) |
                (User.phone.ilike(search_pattern))
            )

        sellers = query.paginate(page=page, per_page=per_page, error_out=False)

        return jsonify({
            "sellers": [
                {
                    "id": s.id,
                    "firstname": s.firstname,
                    "secondname": s.secondname,
                    "email": s.email,
                    "phone": s.phone,
                    "status": getattr(s, "status", "active"),
                }
                for s in sellers.items
            ],
            "total": sellers.total,
            "pages": sellers.pages,
            "current_page": sellers.page
        }), 200
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


# -------------------------
# GET single seller
# -------------------------
@admin_seller_bp.route("/sellers/<int:id>", methods=["GET"])
def get_seller(id):
    seller = User.query.filter_by(id=id, account_type="seller").first()
    if not seller:
        return jsonify({"error": "Seller not found"}), 404

    return jsonify({
        "id": seller.id,
        "firstname": seller.firstname,
        "secondname": seller.secondname,
        "email": seller.email,
        "phone": seller.phone,
        "status": getattr(seller, "status", "active"),
    }), 200


# -------------------------
# PATCH update seller
# -------------------------
@admin_seller_bp.route("/sellers/<int:id>", methods=["PATCH"])
def update_seller(id):
    seller = User.query.filter_by(id=id, account_type="seller").first()
    if not seller:
        return jsonify({"error": "Seller not found"}), 404

    data = request.json
    seller.firstname = data.get("firstname", seller.firstname)
    seller.secondname = data.get("secondname", seller.secondname)
    seller.email = data.get("email", seller.email)
    seller.phone = data.get("phone", seller.phone)
    if "status" in data:
        seller.status = data["status"]

    db.session.commit()
    return jsonify({"message": "Seller updated successfully"}), 200


# -------------------------
# DELETE seller
# -------------------------
@admin_seller_bp.route("/sellers/<int:id>", methods=["DELETE"])
def delete_seller(id):
    seller = User.query.filter_by(id=id, account_type="seller").first()
    if not seller:
        return jsonify({"error": "Seller not found"}), 404

    db.session.delete(seller)
    db.session.commit()
    return jsonify({"message": "Seller deleted successfully"}), 200


# -------------------------
# PATCH suspend/activate seller
# -------------------------
@admin_seller_bp.route("/sellers/<int:id>/status", methods=["PATCH"])
def update_seller_status(id):
    seller = User.query.filter_by(id=id, account_type="seller").first()
    if not seller:
        return jsonify({"error": "Seller not found"}), 404

    data = request.json
    if "status" not in data:
        return jsonify({"error": "Status field required"}), 400

    seller.status = data["status"]
    db.session.commit()
    return jsonify({"message": f"Seller {data['status']} successfully"}), 200
