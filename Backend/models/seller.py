from app import db
from datetime import datetime
import bcrypt

class Seller(db.Model):
    __tablename__ = 'sellers'

    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(50), nullable=False)
    secondname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    store_name = db.Column(db.String(100), nullable=True)
    business_address = db.Column(db.String(200), nullable=True)
    tax_id = db.Column(db.String(50), nullable=True)
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship with notifications
    notifications = db.relationship('Notification', 
                                   primaryjoin="and_(Notification.target_type=='seller', "
                                              "Notification.target_id==cast(Seller.id, String))",
                                   viewonly=True)

    def __repr__(self):
        return f"<Seller {self.firstname} {self.secondname} - {self.email}>"

    def to_dict(self):
        return {
            "id": self.id,
            "firstname": self.firstname,
            "secondname": self.secondname,
            "email": self.email,
            "phone": self.phone,
            "storeName": self.store_name,
            "businessAddress": self.business_address,
            "taxId": self.tax_id,
            "isApproved": self.is_approved,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None
        }

    def check_password(self, password):
        """Check if the provided password matches the stored hash"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))