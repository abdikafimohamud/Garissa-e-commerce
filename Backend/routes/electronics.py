from flask import Blueprint, request, jsonify
from app import db
from app.models.electronics import Electronics
from datetime import datetime

electronics_bp = Blueprint('electronics', __name__)

@electronics_bp.route('/electronics', methods=['GET'])
def get_all_electronics():
    electronics = Electronics.query.all()
    return jsonify([e.to_dict() for e in electronics]), 200

@electronics_bp.route('/electronics/<int:id>', methods=['GET'])
def get_electronic(id):
    electronic = Electronics.query.get_or_404(id)
    return jsonify(electronic.to_dict()), 200

@electronics_bp.route('/electronics', methods=['POST'])
def create_electronic():
    data = request.get_json()

    try:
        release_date = datetime.fromisoformat(data['releaseDate']) if data.get('releaseDate') else None
    except ValueError:
        return jsonify({"error": "Invalid releaseDate format. Use YYYY-MM-DD."}), 400

    new_item = Electronics(
        name=data['name'],
        price=data['price'],
        description=data['description'],
        subCategory=data['subCategory'],
        brand=data['brand'],
        imageUrl=data['imageUrl'],
        stock=data['stock'],
        rating=data.get('rating', 0),
        isNew=data.get('isNew', False),
        isBestSeller=data.get('isBestSeller', False),
        releaseDate=release_date
    )

    db.session.add(new_item)
    db.session.commit()

    return jsonify(new_item.to_dict()), 201

@electronics_bp.route('/electronics/<int:id>', methods=['PUT'])
def update_electronic(id):
    data = request.get_json()
    electronic = Electronics.query.get_or_404(id)

    try:
        electronic.name = data.get('name', electronic.name)
        electronic.description = data.get('description', electronic.description)
        electronic.price = data.get('price', electronic.price)
        electronic.subCategory = data.get('subCategory', electronic.subCategory)
        electronic.brand = data.get('brand', electronic.brand)
        electronic.imageUrl = data.get('imageUrl', electronic.imageUrl)
        electronic.stock = data.get('stock', electronic.stock)
        electronic.rating = data.get('rating', electronic.rating)
        electronic.isNew = data.get('isNew', electronic.isNew)
        electronic.isBestSeller = data.get('isBestSeller', electronic.isBestSeller)

        if data.get('releaseDate'):
            electronic.releaseDate = datetime.strptime(data['releaseDate'], "%Y-%m-%d").date()

        db.session.commit()
        return jsonify(electronic.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@electronics_bp.route('/electronics/<int:id>', methods=['DELETE'])
def delete_electronic(id):
    electronic = Electronics.query.get_or_404(id)
    db.session.delete(electronic)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 204