#!/usr/bin/env python3
"""
Script to create test products for sellers
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import User, Product

def create_test_products():
    app = create_app()
    
    with app.app_context():
        print("🔧 Creating test products for sellers...")
        
        # Find sellers
        sellers = User.query.filter_by(account_type='seller').all()
        
        if not sellers:
            print("❌ No sellers found. Run create_test_users.py first")
            return
        
        # Sample products for each seller
        products_data = [
            {
                "name": "Samsung Galaxy S24",
                "price": 75000,
                "description": "Latest Samsung flagship smartphone with amazing camera",
                "category": "Electronics",
                "subcategory": "Smartphones",
                "brand": "Samsung",
                "stock": 25
            },
            {
                "name": "Nike Air Max",
                "price": 8500,
                "description": "Comfortable running shoes for all occasions",
                "category": "Sports", 
                "subcategory": "Footwear",
                "brand": "Nike",
                "stock": 50
            },
            {
                "name": "MacBook Air M2",
                "price": 140000,
                "description": "Lightweight laptop with M2 chip for professionals",
                "category": "Electronics",
                "subcategory": "Laptops",
                "brand": "Apple",
                "stock": 15
            },
            {
                "name": "Designer Dress",
                "price": 4500,
                "description": "Elegant evening dress for special occasions",
                "category": "Clothes",
                "subcategory": "Dresses",
                "brand": "Fashion House",
                "stock": 30
            }
        ]
        
        created_count = 0
        
        for i, seller in enumerate(sellers[:2]):  # Only first 2 sellers
            for j, product_data in enumerate(products_data):
                if j >= 2:  # 2 products per seller
                    break
                    
                # Check if product already exists
                existing = Product.query.filter_by(
                    name=product_data["name"], 
                    seller_id=seller.id
                ).first()
                
                if existing:
                    print(f"⚠️  Product {product_data['name']} already exists for seller {seller.email}")
                    continue
                
                product = Product(
                    name=product_data["name"],
                    price=product_data["price"],
                    description=product_data["description"],
                    category=product_data["category"],
                    subcategory=product_data["subcategory"],
                    brand=product_data["brand"],
                    stock=product_data["stock"],
                    seller_id=seller.id
                )
                
                db.session.add(product)
                created_count += 1
                print(f"✅ Created product: {product_data['name']} for seller {seller.email}")
        
        db.session.commit()
        
        print(f"\n📊 Summary: Created {created_count} products")

if __name__ == "__main__":
    create_test_products()