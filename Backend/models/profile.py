# models/profile.py
from app import db

class Profile(db.Model):
    __tablename__ = "profiles"

    id = db.Column(db.Integer, primary_key=True)
    profile_pic = db.Column(db.String(255), nullable=True)  # store image path or URL
    two_factor_enabled = db.Column(db.Boolean, default=False)

    # Link back to User
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)
    user = db.relationship("User", back_populates="profile")

    def __repr__(self):
        return f"<Profile for User {self.user_id}>"

    def to_dict(self):
        return {
            "profile_pic": self.profile_pic,
            "two_factor_enabled": self.two_factor_enabled,
        }
