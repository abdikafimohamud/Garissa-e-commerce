from flask import Blueprint, request, jsonify
from app import db
from app.models.cosmetics import Cosmetics

cosmetics_bp = Blueprint('cosmetics', __name__)

# ------------------ READ ------------------

# GET all cosmetics items
@cosmetics_bp.route('/cosmetics', methods=['GET'])
def get_cosmetics():
    cosmetics_items = Cosmetics.query.all()
    return jsonify([item.to_dict() for item in cosmetics_items])

# GET single cosmetics item by ID
@cosmetics_bp.route('/cosmetics/<int:id>', methods=['GET'])
def get_cosmetic_item(id):
    item = Cosmetics.query.get_or_404(id)
    return jsonify(item.to_dict())

# ------------------ CREATE ------------------

# POST new cosmetics item
@cosmetics_bp.route('/cosmetics', methods=['POST'])
def add_cosmetics():
    data = request.get_json()
    new_item = Cosmetics(
        name=data.get('name'),
        price=data.get('price'),
        description=data.get('description'),
        subCategory=data.get('subCategory'),  # Lipstick, Skincare, Perfume
        imageUrl=data.get('imageUrl'),
        stock=data.get('stock', 0),
        rating=data.get('rating', 0.0),
        isNew=data.get('isNew', False),
        isBestSeller=data.get('isBestSeller', False)
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

# ------------------ UPDATE ------------------

# PUT update cosmetics item
@cosmetics_bp.route('/cosmetics/<int:id>', methods=['PUT'])
def update_cosmetics(id):
    item = Cosmetics.query.get_or_404(id)
    data = request.get_json()

    item.name = data.get('name', item.name)
    item.price = data.get('price', item.price)
    item.description = data.get('description', item.description)
    item.subCategory = data.get('subCategory', item.subCategory)
    item.imageUrl = data.get('imageUrl', item.imageUrl)
    item.stock = data.get('stock', item.stock)
    item.rating = data.get('rating', item.rating)
    item.isNew = data.get('isNew', item.isNew)
    item.isBestSeller = data.get('isBestSeller', item.isBestSeller)

    db.session.commit()
    return jsonify(item.to_dict())

# ------------------ DELETE ------------------

# DELETE cosmetics item
@cosmetics_bp.route('/cosmetics/<int:id>', methods=['DELETE'])
def delete_cosmetics(id):
    item = Cosmetics.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Cosmetics item deleted successfully"})
