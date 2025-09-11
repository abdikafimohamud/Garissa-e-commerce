#!/usr/bin/env python3
"""
Script to create test users (admin, sellers, buyers) for development.
Run this script from the Backend directory.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import User
import bcrypt

def create_test_users():
    app = create_app()
    
    with app.app_context():
        print("🔧 Creating test users for development...")
        
        # Test users data
        test_users = [
            {
                "firstname": "Admin",
                "secondname": "User", 
                "email": "admin@garissa.com",
                "password": "Admin123",
                "phone": "+1234567890",
                "account_type": "admin",
                "is_admin": True,
                "status": "active"
            },
            {
                "firstname": "Test",
                "secondname": "Seller1",
                "email": "seller1@garissa.com", 
                "password": "Seller123",
                "phone": "+1234567891",
                "account_type": "seller",
                "is_admin": False,
                "status": "active"
            },
            {
                "firstname": "Test",
                "secondname": "Seller2",
                "email": "seller2@garissa.com",
                "password": "Seller123", 
                "phone": "+1234567892",
                "account_type": "seller",
                "is_admin": False,
                "status": "active"
            },
            {
                "firstname": "Test",
                "secondname": "Buyer1",
                "email": "buyer1@garissa.com",
                "password": "Buyer123",
                "phone": "+1234567893", 
                "account_type": "buyer",
                "is_admin": False,
                "status": "active"
            },
            {
                "firstname": "Test",
                "secondname": "Buyer2", 
                "email": "buyer2@garissa.com",
                "password": "Buyer123",
                "phone": "+1234567894",
                "account_type": "buyer",
                "is_admin": False,
                "status": "active"
            }
        ]
        
        created_count = 0
        existing_count = 0
        
        for user_data in test_users:
            # Check if user already exists
            existing_user = User.query.filter_by(email=user_data['email']).first()
            if existing_user:
                print(f"⚠️  User {user_data['email']} already exists")
                existing_count += 1
                continue
            
            # Hash password
            hashed_password = bcrypt.hashpw(
                user_data['password'].encode('utf-8'), 
                bcrypt.gensalt()
            ).decode('utf-8')
            
            # Create user
            new_user = User(
                firstname=user_data['firstname'],
                secondname=user_data['secondname'],
                email=user_data['email'],
                password=hashed_password,
                phone=user_data['phone'],
                account_type=user_data['account_type'],
                is_admin=user_data['is_admin'],
                status=user_data['status']
            )
            
            try:
                db.session.add(new_user)
                db.session.commit()
                print(f"✅ Created {user_data['account_type']}: {user_data['email']} (Password: {user_data['password']})")
                created_count += 1
            except Exception as e:
                db.session.rollback()
                print(f"❌ Error creating user {user_data['email']}: {e}")
        
        print(f"\n📊 Summary:")
        print(f"   Created: {created_count} users")
        print(f"   Already existed: {existing_count} users")
        print(f"   Total: {len(test_users)} users")
        
        print(f"\n🔑 Login Credentials:")
        print(f"   Admin: admin@garissa.com / Admin123")
        print(f"   Seller 1: seller1@garissa.com / Seller123")
        print(f"   Seller 2: seller2@garissa.com / Seller123")
        print(f"   Buyer 1: buyer1@garissa.com / Buyer123")
        print(f"   Buyer 2: buyer2@garissa.com / Buyer123")

if __name__ == "__main__":
    create_test_users()
