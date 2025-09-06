from app import db
from datetime import datetime
import bcrypt

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(50), nullable=False)
    secondname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    account_type = db.Column(db.String(20), default="buyer")  # Changed from 'role' to 'account_type'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<User {self.firstname} {self.secondname} - {self.email}>"

    def to_dict(self):
        return {
            "id": self.id,
            "firstname": self.firstname,
            "secondname": self.secondname,
            "email": self.email,
            "phone": self.phone,
            "account_type": self.account_type,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def check_password(self, password):
        """Check if the provided password matches the stored hash"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))