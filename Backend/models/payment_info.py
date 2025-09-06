from app import db

class PaymentInfo(db.Model):
    __tablename__ = 'payment_info'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String(36), db.ForeignKey('orders.id'), nullable=False)
    # Card payment fields
    card_number = db.Column(db.String(20))
    card_name = db.Column(db.String(100))
    expiry = db.Column(db.String(10))
    cvv = db.Column(db.String(4))
    # Mobile payment fields
    phone_number = db.Column(db.String(20))
    # PayPill fields
    paypill_email = db.Column(db.String(120))
    
    def to_dict(self):
        return {
            'id': self.id,
            'card_number': self.card_number,
            'card_name': self.card_name,
            'expiry': self.expiry,
            'cvv': self.cvv,
            'phone_number': self.phone_number,
            'paypill_email': self.paypill_email
        }