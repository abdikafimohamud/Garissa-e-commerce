#!/usr/bin/env python3
"""
Script to create a test order to demonstrate the seller order management system
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import User, Product, Order, OrderItem, Address, Payment, Notification
from datetime import datetime
import random
import string

def generate_order_number():
    """Generate a unique order number"""
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"ORD-{timestamp}-{random_str}"

def create_test_order():
    app = create_app()
    
    with app.app_context():
        print("🛒 Creating a test order to demonstrate seller order management...")
        
        # Find a buyer and seller with products
        buyer = User.query.filter_by(account_type='buyer').first()
        seller = User.query.filter_by(account_type='seller').first()
        
        if not buyer:
            print("❌ No buyers found. Run create_test_users.py first")
            return
            
        if not seller:
            print("❌ No sellers found. Run create_test_users.py first")
            return
        
        # Find a product from the seller
        product = Product.query.filter_by(seller_id=seller.id).first()
        
        if not product:
            print("❌ No products found for seller. Run create_test_products.py first")
            return
        
        print(f"📦 Creating order for buyer: {buyer.email}")
        print(f"🏪 Seller: {seller.email}")
        print(f"📱 Product: {product.name} - KES {product.price}")
        
        # Create shipping address
        address = Address(
            user_id=buyer.id,
            first_name=buyer.firstname,
            last_name=buyer.secondname,
            email=buyer.email,
            phone=buyer.phone or "+254712345678",
            address="123 Test Street",
            city="Nairobi",
            state="Nairobi",
            zip_code="00100",
            country="Kenya"
        )
        db.session.add(address)
        db.session.flush()
        
        # Create order
        quantity = 1
        total_price = product.price * quantity
        tax = total_price * 0.08
        shipping = 0 if total_price > 100 else 15
        final_total = total_price + tax + shipping
        
        order = Order(
            order_number=generate_order_number(),
            user_id=buyer.id,
            subtotal=total_price,
            tax=tax,
            shipping=shipping,
            total=final_total,
            payment_method='mpesa',
            shipping_address_id=address.id,
            status='pending'
        )
        db.session.add(order)
        db.session.flush()
        
        # Create order item
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=quantity,
            price=product.price
        )
        db.session.add(order_item)
        
        # Create payment
        payment = Payment(
            order_id=order.id,
            user_id=buyer.id,
            payment_method='mpesa',
            amount=final_total,
            status='completed',
            phone_number=buyer.phone or "+254712345678"
        )
        db.session.add(payment)
        
        # Create notification for seller
        notification = Notification(
            title="New Order Received!",
            message=f"You have a new order from {buyer.firstname} {buyer.secondname}. Order #{order.order_number} contains your product '{product.name}'. Please check your orders dashboard to manage this order.",
            type="order",
            sender_role="system",
            target_user=seller.id,
            date=datetime.utcnow(),
            read=False
        )
        db.session.add(notification)
        
        # Commit all changes
        db.session.commit()
        
        print(f"✅ Test order created successfully!")
        print(f"   Order Number: {order.order_number}")
        print(f"   Total: KES {final_total}")
        print(f"   Status: {order.status}")
        print(f"   Seller Notification: Created")
        print()
        print("🎯 Now you can:")
        print("   1. Login as seller:", seller.email, "/ Seller123")
        print("   2. Go to http://localhost:5173/seller/orders")
        print("   3. See the new order and manage its status")
        print("   4. Check notifications at http://localhost:5173/seller/notifications")

if __name__ == "__main__":
    create_test_order()