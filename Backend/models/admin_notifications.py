from app import db
from datetime import datetime

class admin_Notifications(db.Model):
    __tablename__ = "admin_Notifications"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), default="info")  # info | warning | alert
    target_type = db.Column(db.String(50), default="user")  # "user" or "seller"
    target_id = db.Column(db.String(50), default="all")  # "all" or specific user/seller ID
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    read = db.Column(db.Boolean, default=False)
    sender_id = db.Column(db.Integer, nullable=True)  # ID of admin who sent the notification

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "message": self.message,
            "type": self.type,
            "targetType": self.target_type,
            "targetId": self.target_id,
            "date": self.date.isoformat(),
            "read": self.read,
            "senderId": self.sender_id
        }