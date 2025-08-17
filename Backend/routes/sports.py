from flask import Blueprint, request, jsonify
from app import db
from models.sports import Sports

sports_bp = Blueprint('sports', __name__)

# ------------------ READ ------------------

# GET all sports items
@sports_bp.route('/sports', methods=['GET'])
def get_sports():
    sports_items = Sports.query.all()
    return jsonify([item.to_dict() for item in sports_items])

# GET single sports item by ID
@sports_bp.route('/sports/<int:id>', methods=['GET'])
def get_sports_item(id):
    item = Sports.query.get_or_404(id)
    return jsonify(item.to_dict())

# ------------------ CREATE ------------------

# POST new sports item
@sports_bp.route('/sports', methods=['POST'])
def add_sports():
    data = request.get_json()
    new_item = Sports(
        name=data.get('name'),
        price=data.get('price'),
        description=data.get('description'),
        subCategory=data.get('subCategory'),  # T-shirts, Football, Shoes
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

# PUT update sports item
@sports_bp.route('/sports/<int:id>', methods=['PUT'])
def update_sports(id):
    item = Sports.query.get_or_404(id)
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

# DELETE sports item
@sports_bp.route('/sports/<int:id>', methods=['DELETE'])
def delete_sports(id):
    item = Sports.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Sports item deleted successfully"})
