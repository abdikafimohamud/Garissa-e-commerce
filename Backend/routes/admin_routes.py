from flask import Blueprint, request, jsonify
from app import db
from app.models import User

admin_bp = Blueprint("admin", __name__)

# -------------------------
# GET all buyers
# -------------------------
@admin_bp.route("/buyers", methods=["GET"])
def get_buyers():
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



