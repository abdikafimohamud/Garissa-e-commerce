# backend/models/clothes.py
from app import db


class Clothes(db.Model):
    __tablename__ = "clothes"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), default='clothes')
    subCategory = db.Column(db.String(50), nullable=True)
    imageUrl = db.Column(db.String(255), nullable=True)
    stock = db.Column(db.Integer, default=0)
    rating = db.Column(db.Float, default=0.0)
    isNew = db.Column(db.Boolean, default=False)
    isBestSeller = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "description": self.description,
            "category": self.category,
            "subCategory": self.subCategory,
            "imageUrl": self.imageUrl,
            "stock": self.stock,
            "rating": self.rating,
            "isNew": self.isNew,
            "isBestSeller": self.isBestSeller
        }
