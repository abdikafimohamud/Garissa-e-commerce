from app import db
from sqlalchemy import DateTime
from datetime import datetime

class Electronics(db.Model):
    __tablename__ = 'electronics'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), default='Electronics')
    subCategory = db.Column(db.String(50))
    brand = db.Column(db.String(50))
    imageUrl = db.Column(db.String(255))
    stock = db.Column(db.Integer)
    rating = db.Column(db.Float)
    isNew = db.Column(db.Boolean, default=False)
    isBestSeller = db.Column(db.Boolean, default=False)
    releaseDate = db.Column(DateTime, default=datetime.utcnow)
    created_at = db.Column(DateTime, default=datetime.utcnow)  # ✅ Added this field

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "description": self.description,
            "category": self.category,
            "subCategory": self.subCategory,
            "brand": self.brand,
            "imageUrl": self.imageUrl,
            "stock": self.stock,
            "rating": self.rating,
            "isNew": self.isNew,
            "isBestSeller": self.isBestSeller,
            "releaseDate": self.releaseDate.isoformat() if self.releaseDate else None,
            "created_at": self.created_at.isoformat() if self.created_at else None  # ✅ Return as ISO string
        }
