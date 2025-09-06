from app import db
from datetime import datetime
import uuid

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    order_number = db.Column(db.String(20), unique=True, nullable=False)
    status = db.Column(db.String(20), default='processing')  # processing, shipped, delivered, cancelled
    subtotal = db.Column(db.Float, nullable=False)
    tax = db.Column(db.Float, nullable=False)
    shipping = db.Column(db.Float, nullable=False)
    total = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(20), nullable=False)  # card, mpesa, evc, paypill
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')
    shipping_info = db.relationship('ShippingInfo', backref='order', uselist=False, cascade='all, delete-orphan')
    payment_info = db.relationship('PaymentInfo', backref='order', uselist=False, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'order_number': self.order_number,
            'status': self.status,
            'subtotal': self.subtotal,
            'tax': self.tax,
            'shipping': self.shipping,
            'total': self.total,
            'payment_method': self.payment_method,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'items': [item.to_dict() for item in self.items],
            'shipping_info': self.shipping_info.to_dict() if self.shipping_info else None,
            'payment_info': self.payment_info.to_dict() if self.payment_info else None
        }