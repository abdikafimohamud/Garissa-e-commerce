from app import db
from datetime import datetime
import bcrypt
from sqlalchemy.sql import func

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(50), nullable=False)
    secondname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    profile_pic = db.Column(db.String(255), nullable=True, default=None)
    account_type = db.Column(db.String(20), nullable=False, default='buyer')  # buyer or seller

    # timestamps
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(
        db.DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    # Relationships
    orders = db.relationship('Order', backref='user', lazy=True)
    addresses = db.relationship('Address', backref='user', lazy=True)
    payments = db.relationship('Payment', backref='user', lazy=True)

    def __repr__(self):
        return f"<User {self.firstname} {self.secondname} - {self.email}>"

    def check_password(self, password: str) -> bool:
        """
        Verify the given password against the stored hashed password.
        """
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    def to_dict(self) -> dict:
        """
        Convert the user object to a dictionary (excluding sensitive info like password).
        """
        return {
            "id": self.id,
            "firstname": self.firstname,
            "secondname": self.secondname,
            "email": self.email,
            "phone": self.phone,
            "profile_pic": self.profile_pic,
            "account_type": self.account_type,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50), nullable=False)
    subcategory = db.Column(db.String(50))
    brand = db.Column(db.String(50))
    image_url = db.Column(db.String(255))
    stock = db.Column(db.Integer, default=0)
    rating = db.Column(db.Float, default=0.0)
    is_new = db.Column(db.Boolean, default=False)
    is_best_seller = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    order_items = db.relationship('OrderItem', backref='product', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "description": self.description,
            "category": self.category,
            "subcategory": self.subcategory,
            "brand": self.brand,
            "image_url": self.image_url,
            "stock": self.stock,
            "rating": self.rating,
            "is_new": self.is_new,
            "is_best_seller": self.is_best_seller,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(20), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')
    subtotal = db.Column(db.Float, nullable=False)
    tax = db.Column(db.Float, nullable=False, default=0.0)
    shipping = db.Column(db.Float, nullable=False, default=0.0)
    total = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(20), nullable=False)
    shipping_address_id = db.Column(db.Integer, db.ForeignKey('addresses.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy=True)
    payment = db.relationship('Payment', backref='order', uselist=False, lazy=True)
    shipping_address = db.relationship('Address', foreign_keys=[shipping_address_id])

    def to_dict(self):
        return {
            "id": self.id,
            "order_number": self.order_number,
            "user_id": self.user_id,
            "status": self.status,
            "subtotal": self.subtotal,
            "tax": self.tax,
            "shipping": self.shipping,
            "total": self.total,
            "payment_method": self.payment_method,
            "shipping_address": self.shipping_address.to_dict() if self.shipping_address else None,
            "items": [item.to_dict() for item in self.items],
            "payment": self.payment.to_dict() if self.payment else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    color = db.Column(db.String(20))
    size = db.Column(db.String(10))
    
    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "product_name": self.product.name if self.product else None,
            "quantity": self.quantity,
            "price": self.price,
            "color": self.color,
            "size": self.size,
            "subtotal": self.price * self.quantity
        }


class Address(db.Model):
    __tablename__ = 'addresses'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    zip_code = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(50), nullable=False, default="Kenya")
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "zip_code": self.zip_code,
            "country": self.country,
            "is_default": self.is_default,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Payment(db.Model):
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    payment_method = db.Column(db.String(20), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')
    transaction_id = db.Column(db.String(100))
    card_last_four = db.Column(db.String(4))
    card_brand = db.Column(db.String(20))
    phone_number = db.Column(db.String(20))  # For M-Pesa/EVC
    paypill_email = db.Column(db.String(120))  # For PayPill
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "user_id": self.user_id,
            "payment_method": self.payment_method,
            "amount": self.amount,
            "status": self.status,
            "transaction_id": self.transaction_id,
            "card_last_four": self.card_last_four,
            "card_brand": self.card_brand,
            "phone_number": self.phone_number,
            "paypill_email": self.paypill_email,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
    

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(20), default='info')  
    sender_role = db.Column(db.String(20), default='system')  # admin, seller, buyer
    target_user = db.Column(db.Integer, db.ForeignKey('users.id'))  # seller_id or buyer_id
    date = db.Column(db.DateTime, default=datetime.utcnow)
    read = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "message": self.message,
            "type": self.type,
            "sender_role": self.sender_role,
            "target_user": self.target_user,
            "date": self.date.isoformat() if self.date else None,
            "read": self.read
        }
