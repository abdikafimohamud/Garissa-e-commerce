import os
import uuid
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, session
from app import db
from app.models import Product

products_bp = Blueprint('products', __name__)

# Configuration for file uploads
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def save_image_file(file):
    if file and allowed_file(file.filename):
        # Generate a unique filename
        filename = str(uuid.uuid4()) + '.' + file.filename.rsplit('.', 1)[1].lower()
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        return filename
    return None


def delete_image_file(filename):
    if filename:
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(filepath):
            os.remove(filepath)


@products_bp.route('/api/products', methods=['GET', 'POST'])
def products():
    if request.method == 'GET':
        try:
            seller_id = session.get('user_id')
            seller_role = session.get('account_type')  # ✅ fixed
            if not seller_id or seller_role != "seller":  # ✅ stricter check
                return jsonify({"error": "Unauthorized"}), 401

            category = request.args.get('category')
            page = int(request.args.get('page', 1))
            per_page = int(request.args.get('per_page', 20))

            query = Product.query.filter_by(seller_id=seller_id)
            if category:
                query = query.filter_by(category=category)

            products = query.paginate(page=page, per_page=per_page, error_out=False)
            return jsonify({
                "products": [p.to_dict() for p in products.items],
                "total": products.total,
                "pages": products.pages,
                "current_page": page
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # ---------- POST ----------
    if request.method == 'POST':
        try:
            seller_id = session.get('user_id')
            seller_role = session.get('account_type')  # ✅ fixed
            if not seller_id or seller_role != "seller":  # ✅ stricter check
                return jsonify({"error": "Unauthorized"}), 401

            if request.files:
                image_file = request.files.get('image')
                image_filename = save_image_file(image_file) if image_file else None
                name = request.form.get('name')
                price = request.form.get('price')
                if not name or price is None:
                    return jsonify({"error": "name and price required"}), 400
                new_product = Product(
                    name=name,
                    price=float(price),
                    description=request.form.get('description'),
                    category=request.form.get('category'),
                    subcategory=request.form.get('subcategory'),
                    image_filename=image_filename,
                    stock=int(request.form.get('stock', 0)),
                    rating=float(request.form.get('rating', 0)),
                    is_new=request.form.get('isNew') == 'true',
                    is_best_seller=request.form.get('isBestSeller') == 'true',
                    seller_id=seller_id
                )
            else:
                data = request.get_json() or {}
                name = data.get('name')
                price = data.get('price')
                if not name or price is None:
                    return jsonify({"error": "name and price required"}), 400
                new_product = Product(
                    name=name,
                    price=float(price),
                    description=data.get('description'),
                    category=data.get('category'),
                    subcategory=data.get('subcategory'),
                    image_url=data.get('imageUrl'),
                    stock=int(data.get('stock', 0)),
                    rating=float(data.get('rating', 0)),
                    is_new=data.get('isNew', False),
                    is_best_seller=data.get('isBestSeller', False),
                    seller_id=seller_id
                )

            db.session.add(new_product)
            db.session.commit()
            return jsonify({"product": new_product.to_dict()}), 201

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500


@products_bp.route('/api/products/<int:product_id>', methods=['GET', 'PUT', 'DELETE'])
def product_detail(product_id):
    try:
        product = Product.query.get_or_404(product_id)

        # ✅ ensure logged-in seller owns this product
        if session.get('account_type') != "seller" or session.get('user_id') != product.seller_id:  # ✅ fixed
            return jsonify({"error": "Unauthorized"}), 401

        if request.method == 'GET':
            return jsonify({
                "product": product.to_dict()
            }), 200

        elif request.method == 'PUT':
            if request.files:
                image_file = request.files.get('image')
                if image_file:
                    if product.image_filename:
                        delete_image_file(product.image_filename)
                    image_filename = save_image_file(image_file)
                    if image_filename:
                        product.image_filename = image_filename

                product.name = request.form.get('name', product.name)
                product.price = float(request.form.get('price', product.price))
                product.description = request.form.get('description', product.description)
                product.category = request.form.get('category', product.category)
                product.subcategory = request.form.get('subcategory', product.subcategory)
                product.stock = int(request.form.get('stock', product.stock))
                product.rating = float(request.form.get('rating', product.rating))
                product.is_new = request.form.get('isNew') == 'true'
                product.is_best_seller = request.form.get('isBestSeller') == 'true'
            else:
                data = request.get_json()
                product.name = data['name']
                product.price = data['price']
                product.description = data['description']
                product.category = data['category']
                product.subcategory = data['subcategory']
                if 'imageUrl' in data:
                    product.image_url = data['imageUrl']
                product.stock = data['stock']
                product.rating = data['rating']
                product.is_new = data['isNew']
                product.is_best_seller = data['isBestSeller']

            db.session.commit()
            return jsonify({"product": product.to_dict()}), 200

        elif request.method == 'DELETE':
            if product.image_filename:
                delete_image_file(product.image_filename)
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

        return jsonify({"categories": categories}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ NEW: Public endpoint for buyers to fetch all products
@products_bp.route('/api/products/public', methods=['GET'])
def get_public_products():
    """
    Public endpoint for buyers to fetch all products from all sellers.
    No authentication required.
    """
    try:
        # Get query parameters
        category = request.args.get('category')
        subcategory = request.args.get('subcategory')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 50))
        
        # Build query - get all products from all sellers
        query = Product.query
        
        # Filter by category if provided
        if category:
            query = query.filter(Product.category == category)
            
        # Filter by subcategory if provided
        if subcategory:
            query = query.filter(Product.subcategory == subcategory)
        
        # Order by creation date (newest first)
        query = query.order_by(Product.created_at.desc())
        
        # Paginate results
        products = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            "products": [p.to_dict() for p in products.items],
            "total": products.total,
            "pages": products.pages,
            "current_page": page,
            "per_page": per_page
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@products_bp.route('/uploads/<filename>')
def serve_image(filename):
    from flask import send_from_directory
    return send_from_directory(UPLOAD_FOLDER, filename)
