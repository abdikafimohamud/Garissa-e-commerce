# app/routes/notifications.py
from flask import Blueprint, request, jsonify
from flask_cors import CORS
from datetime import datetime
from app import db
from app.models import Notification, User

notifications_bp = Blueprint("notifications_bp", __name__)
CORS(notifications_bp)  # Enable CORS for this blueprint

# ===============================
# GET ALL USERS
# ===============================
@notifications_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

# ===============================
# GET ALL NOTIFICATIONS
# ===============================
@notifications_bp.route("/notifications", methods=["GET"])
def get_notifications():
    notifications = Notification.query.order_by(Notification.date.desc()).all()
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

# ===============================
# ADMIN: Send notification to seller(s)
# ===============================
@notifications_bp.route("/admin/notifications", methods=["POST"])
def admin_create_notification():
    data = request.get_json()

    if not data.get("title") or not data.get("message") or not data.get("targetUser"):
        return jsonify({"error": "Missing required fields"}), 400

    new_notification = Notification(
        title=data["title"],
        message=data["message"],
        type=data.get("type", "info"),
        sender_role="admin",
        target_user=data["targetUser"],
    )
    db.session.add(new_notification)
    db.session.commit()

    return jsonify(new_notification.to_dict()), 201


# ===============================
# ADMIN: Get all seller notifications
# ===============================
@notifications_bp.route("/admin/notifications", methods=["GET"])
def admin_get_notifications():
    notifications = Notification.query.filter_by(sender_role="admin").order_by(Notification.date.desc()).all()
    return jsonify([n.to_dict() for n in notifications]), 200


# ===============================
# ADMIN: Update notification
# ===============================
@notifications_bp.route("/admin/notifications/<int:notification_id>", methods=["PATCH"])
def admin_update_notification(notification_id):
    notif = Notification.query.get(notification_id)
    if not notif:
        return jsonify({"error": "Notification not found"}), 404
    
    data = request.get_json()
    if "title" in data: notif.title = data["title"]
    if "message" in data: notif.message = data["message"]
    if "type" in data: notif.type = data["type"]
    db.session.commit()
    return jsonify(notif.to_dict()), 200


# ===============================
# ADMIN: Delete notification
# ===============================
@notifications_bp.route("/admin/notifications/<int:notification_id>", methods=["DELETE"])
def admin_delete_notification(notification_id):
    notif = Notification.query.get(notification_id)
    if not notif:
        return jsonify({"error": "Notification not found"}), 404

    db.session.delete(notif)
    db.session.commit()
    return jsonify({"message": "Notification deleted"}), 200


# ===============================
# SELLER: Get their notifications
# ===============================
@notifications_bp.route("/seller/<int:seller_id>/notifications", methods=["GET"])
def seller_get_notifications(seller_id):
    notifications = Notification.query.filter_by(target_user=seller_id).order_by(Notification.date.desc()).all()
    return jsonify([n.to_dict() for n in notifications]), 200


# ===============================
# SELLER: Mark as read
# ===============================
@notifications_bp.route("/seller/notifications/<int:notification_id>/read", methods=["PATCH"])
def seller_mark_as_read(notification_id):
    notif = Notification.query.get(notification_id)
    if not notif:
        return jsonify({"error": "Notification not found"}), 404

    notif.read = True
    db.session.commit()
    return jsonify(notif.to_dict()), 200
