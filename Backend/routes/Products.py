from flask import Blueprint, request, jsonify
from app import db
from app.models import Product

products_bp = Blueprint('products', __name__)

@products_bp.route('/api/products', methods=['GET', 'POST'])
def products():
    if request.method == 'GET':
        try:
            category = request.args.get('category')
            page = int(request.args.get('page', 1))
            per_page = int(request.args.get('per_page', 20))
            
            query = Product.query
            
            if category:
                query = query.filter_by(category=category)
            
            products = query.paginate(page=page, per_page=per_page, error_out=False)
            
            return jsonify({
                "products": [product.to_dict() for product in products.items],
                "total": products.total,
                "pages": products.pages,
                "current_page": page
            }), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            
            new_product = Product(
                name=data['name'],
                price=data['price'],
                description=data['description'],
                category=data['category'],
                subcategory=data['subcategory'],
                image_url=data['imageUrl'],
                stock=data['stock'],
                rating=data['rating'],
                is_new=data['isNew'],
                is_best_seller=data['isBestSeller']
            )
            
            db.session.add(new_product)
            db.session.commit()
            
            return jsonify({
                "product": new_product.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

@products_bp.route('/api/products/<int:product_id>', methods=['GET', 'PUT', 'DELETE'])
def product_detail(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        
        if request.method == 'GET':
            return jsonify({
                "product": product.to_dict()
            }), 200
            
        elif request.method == 'PUT':
            data = request.get_json()
            
            product.name = data['name']
            product.price = data['price']
            product.description = data['description']
            product.category = data['category']
            product.sub_category = data['subCategory']
            product.image_url = data['imageUrl']
            product.stock = data['stock']
            product.rating = data['rating']
            product.is_new = data['isNew']
            product.is_best_seller = data['isBestSeller']
            
            db.session.commit()
            
            return jsonify({
                "product": product.to_dict()
            }), 200
            
        elif request.method == 'DELETE':
            db.session.delete(product)
            db.session.commit()
            
            return jsonify({'message': 'Product deleted successfully'}), 200
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@products_bp.route('/api/products/categories', methods=['GET'])
def get_categories():
    try:
        categories = db.session.query(Product.category).distinct().all()
        categories = [category[0] for category in categories if category[0]]
        
        return jsonify({
            "categories": categories
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500