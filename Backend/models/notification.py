# models/notification.py
from app import db

class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), default="info")  # info | warning | alert
    target_user = db.Column(db.String(50), default="all")  # "all" or user.id
    date = db.Column(db.DateTime, nullable=False)
    read = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "message": self.message,
            "type": self.type,
            "targetUser": self.target_user,
            "date": self.date.isoformat(),
            "read": self.read,
        }
