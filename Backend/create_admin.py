#!/usr/bin/env python3
"""
Script to create an admin user for testing purposes.
Run this script from the Backend directory.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import User
import bcrypt

def create_admin_user():
    app = create_app()
    
    with app.app_context():
        # Check if admin already exists
        existing_admin = User.query.filter_by(email='admin@garissa.com').first()
        if existing_admin:
            print("Admin user already exists!")
            return
        
        # Create admin user
        password = "Admin123"  # Change this to a secure password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        admin_user = User(
            firstname="Admin",
            secondname="User",
            email="admin@garissa.com",
            password=hashed_password,
            phone="+1234567890",
            account_type="admin",
            is_admin=True,
            status="active"
        )
        
        try:
            db.session.add(admin_user)
            db.session.commit()
            print("✅ Admin user created successfully!")
            print(f"Email: admin@garissa.com")
            print(f"Password: {password}")
            print("You can now login as admin to test the admin dashboard.")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error creating admin user: {e}")

if __name__ == "__main__":
    create_admin_user()
