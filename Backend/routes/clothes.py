from flask import Blueprint, request, jsonify
from app.models.clothes import Clothes
from app import db

clothes_bp = Blueprint("clothes", __name__)

@clothes_bp.route("/clothes", methods=["GET"])
def get_all_clothes():
    clothes = Clothes.query.all()
    return jsonify([c.to_dict() for c in clothes]), 200

@clothes_bp.route("/clothes", methods=["POST"])
def add_clothes():
    data = request.get_json()
    try:
        new_item = Clothes(
            name=data["name"],
            price=data["price"],
            description=data.get("description"),
            subCategory=data.get("subCategory"),
            imageUrl=data.get("imageUrl"),
            stock=data.get("stock", 0),
            rating=data.get("rating", 0.0),
            isNew=data.get("isNew", False),
            isBestSeller=data.get("isBestSeller", False)
        )
        db.session.add(new_item)
        db.session.commit()
        return jsonify(new_item.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@clothes_bp.route("/clothes/<int:id>", methods=["PUT"])
def update_clothes(id):
    item = Clothes.query.get_or_404(id)
    data = request.get_json()
    try:
        item.name = data.get("name", item.name)
        item.price = data.get("price", item.price)
        item.description = data.get("description", item.description)
        item.subCategory = data.get("subCategory", item.subCategory)
        item.imageUrl = data.get("imageUrl", item.imageUrl)
        item.stock = data.get("stock", item.stock)
        item.rating = data.get("rating", item.rating)
        item.isNew = data.get("isNew", item.isNew)
        item.isBestSeller = data.get("isBestSeller", item.isBestSeller)

        db.session.commit()
        return jsonify(item.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@clothes_bp.route("/clothes/<int:id>", methods=["DELETE"])
def delete_clothes(id):
    item = Clothes.query.get_or_404(id)
    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Deleted successfully"}), 204
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
