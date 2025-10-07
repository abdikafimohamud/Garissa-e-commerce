#!/usr/bin/env python3
"""
Script to create diverse test products for sellers across all categories
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import User, Product

def create_diverse_products():
    app = create_app()
    
    with app.app_context():
        print("🔧 Creating diverse test products for sellers...")
        
        # Find sellers
        sellers = User.query.filter_by(account_type='seller').all()
        
        if not sellers:
            print("❌ No sellers found. Run create_test_users.py first")
            return
        
        # Diverse products across all categories
        products_data = [
            # Electronics
            {
                "name": "iPhone 15 Pro",
                "price": 95000,
                "description": "Latest iPhone with titanium design and advanced camera system",
                "category": "Electronics",
                "subcategory": "Smartphones",
                "brand": "Apple",
                "stock": 20
            },
            {
                "name": "HP Gaming Laptop",
                "price": 85000,
                "description": "High-performance gaming laptop with RTX graphics",
                "category": "Electronics",
                "subcategory": "Laptops",
                "brand": "HP",
                "stock": 12
            },
            {
                "name": "Sony Wireless Headphones",
                "price": 15000,
                "description": "Noise-cancelling wireless headphones with premium sound",
                "category": "Electronics",
                "subcategory": "Audio",
                "brand": "Sony",
                "stock": 35
            },
            
            # Clothes
            {
                "name": "Cotton T-Shirt",
                "price": 1200,
                "description": "Premium quality cotton t-shirt in various colors",
                "category": "Clothes",
                "subcategory": "Casual Wear",
                "brand": "LocalBrand",
                "stock": 100
            },
            {
                "name": "Formal Suit",
                "price": 8500,
                "description": "Professional business suit for office wear",
                "category": "Clothes",
                "subcategory": "Formal Wear",
                "brand": "Executive",
                "stock": 25
            },
            {
                "name": "Summer Dress",
                "price": 3200,
                "description": "Light and comfortable dress perfect for summer",
                "category": "Clothes",
                "subcategory": "Dresses",
                "brand": "Fashion",
                "stock": 40
            },
            {
                "name": "Denim Jeans",
                "price": 2800,
                "description": "Classic blue denim jeans with modern fit",
                "category": "Clothes",
                "subcategory": "Casual Wear",
                "brand": "Denim Co",
                "stock": 60
            },
            
            # Sports
            {
                "name": "Football Boots",
                "price": 4500,
                "description": "Professional football boots with excellent grip",
                "category": "Sports",
                "subcategory": "Footwear",
                "brand": "Adidas",
                "stock": 30
            },
            {
                "name": "Basketball",
                "price": 2200,
                "description": "Official size basketball for indoor and outdoor play",
                "category": "Sports",
                "subcategory": "Equipment",
                "brand": "Spalding",
                "stock": 25
            },
            {
                "name": "Yoga Mat",
                "price": 1800,
                "description": "Non-slip yoga mat for comfortable practice",
                "category": "Sports",
                "subcategory": "Fitness",
                "brand": "YogaPro",
                "stock": 45
            },
            {
                "name": "Running Shoes",
                "price": 6500,
                "description": "Lightweight running shoes with cushioned sole",
                "category": "Sports",
                "subcategory": "Footwear",
                "brand": "Puma",
                "stock": 35
            },
            
            # Cosmetics
            {
                "name": "Moisturizing Cream",
                "price": 2500,
                "description": "Daily moisturizing cream for all skin types",
                "category": "Cosmetics",
                "subcategory": "Skincare",
                "brand": "BeautyLux",
                "stock": 50
            },
            {
                "name": "Lipstick Set",
                "price": 1800,
                "description": "Set of 5 long-lasting lipsticks in trending colors",
                "category": "Cosmetics",
                "subcategory": "Makeup",
                "brand": "GlamourPro",
                "stock": 40
            },
            {
                "name": "Hair Shampoo",
                "price": 1200,
                "description": "Nourishing shampoo for healthy and shiny hair",
                "category": "Cosmetics",
                "subcategory": "Hair Care",
                "brand": "HairEssence",
                "stock": 60
            },
            {
                "name": "Face Mask",
                "price": 800,
                "description": "Hydrating face mask for glowing skin",
                "category": "Cosmetics",
                "subcategory": "Skincare",
                "brand": "SkinCare",
                "stock": 80
            }
        ]
        
        created_count = 0
        
        # Distribute products among sellers
        for i, seller in enumerate(sellers):
            # Each seller gets 4-6 products from different categories
            start_idx = (i * 4) % len(products_data)
            seller_products = products_data[start_idx:start_idx + 6]
            
            for product_data in seller_products:
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
                print(f"✅ Created product: {product_data['name']} ({product_data['category']}) for seller {seller.email}")
        
        db.session.commit()
        
        print(f"\n📊 Summary: Created {created_count} products across all categories")
        
        # Show category distribution
        print("\n📈 Category Distribution:")
        from sqlalchemy import text
        categories = db.session.execute(text("""
            SELECT category, COUNT(*) as count 
            FROM products 
            GROUP BY category
        """)).fetchall()
        
        for category, count in categories:
            print(f"   {category}: {count} products")

if __name__ == "__main__":
    create_diverse_products()