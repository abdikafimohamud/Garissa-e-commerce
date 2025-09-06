from app import db

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String(36), db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String(500))
    color = db.Column(db.String(50))
    size = db.Column(db.String(50))
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'name': self.name,
            'price': self.price,
            'quantity': self.quantity,
            'image_url': self.image_url,
            'color': self.color,
            'size': self.size
        }