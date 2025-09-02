from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(50), nullable=False)
    secondname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    role = db.Column(db.String(20), default="user")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # One-to-one relationship with Profile
    profile = db.relationship("Profile", back_populates="user", uselist=False, cascade="all, delete")

    def __repr__(self):
        return f"<User {self.firstname} {self.secondname} - {self.email}>"

    def to_dict(self):
        return {
            "id": self.id,
            "firstname": self.firstname,
            "secondname": self.secondname,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
            "profile_pic": self.profile.profile_pic if self.profile else None,
            "two_factor_enabled": self.profile.two_factor_enabled if self.profile else False,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
