from flask import Blueprint, request, jsonify, session
from datetime import datetime
from app import db
from models.notification import Notification
from models.user import User

notifications_bp = Blueprint("notifications_bp", __name__)

# ===============================
# GET ALL NOTIFICATIONS
# ===============================
@notifications_bp.route("/notifications", methods=["GET"])
def get_notifications():
    notifications = Notification.query.all()
    return jsonify([n.to_dict() for n in notifications]), 200


# ===============================
# CREATE NOTIFICATION
# ===============================
@notifications_bp.route("/notifications", methods=["POST"])
def create_notification():
    data = request.get_json()

    if not data.get("title") or not data.get("message"):
        return jsonify({"error": "Missing required fields"}), 400

    new_notification = Notification(
        title=data["title"],
        message=data["message"],
        type=data.get("type", "info"),
        target_user=data.get("targetUser", "all"),
        date=datetime.utcnow(),
        read=False,
    )
    db.session.add(new_notification)
    db.session.commit()

    return jsonify(new_notification.to_dict()), 201


# ===============================
# UPDATE NOTIFICATION
# ===============================
@notifications_bp.route("/notifications/<int:id>", methods=["PUT", "PATCH"])
def update_notification(id):
    notif = Notification.query.get_or_404(id)
    data = request.json

    if "title" in data:
        notif.title = data["title"]
    if "message" in data:
        notif.message = data["message"]
    if "type" in data:
        notif.type = data["type"]
    if "targetUser" in data:
        notif.target_user = data["targetUser"]
    if "read" in data:
        notif.read = data["read"]

    db.session.commit()
    return jsonify(notif.to_dict()), 200


# ===============================
# DELETE NOTIFICATION
# ===============================
@notifications_bp.route("/notifications/<int:notification_id>", methods=["DELETE"])
def delete_notification(notification_id):
    notif = Notification.query.get(notification_id)
    if not notif:
        return jsonify({"error": "Notification not found"}), 404

    db.session.delete(notif)
    db.session.commit()
    return jsonify({"message": "Notification deleted"}), 200
