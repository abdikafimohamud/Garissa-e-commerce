# app/routes/notifications.py
from flask import Blueprint, request, jsonify, session
from flask_cors import CORS
from datetime import datetime
from app import db
from app.models import Notification, User

notifications_bp = Blueprint("notifications_bp", __name__)
CORS(
    notifications_bp,
    supports_credentials=True,
    origins=["http://localhost:5173", "http://127.0.0.1:5173"],
)

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
# BUYER: Mark notification as read (admin notifications only)
# ===============================
@notifications_bp.route("/buyer/notifications/<int:notification_id>/read", methods=["PATCH"])
def buyer_mark_notification_read(notification_id):
    # Check if user is logged in as buyer
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized - buyer access required"}), 401
    
    # Get user info to verify they are a buyer
    user = User.query.get(session['user_id'])
    if not user or user.account_type != 'buyer':
        return jsonify({"error": "Access denied - buyers only"}), 403
    
    # Get the notification and verify it's from admin
    notification = Notification.query.get(notification_id)
    if not notification:
        return jsonify({"error": "Notification not found"}), 404
    
    # Only allow buyers to mark admin notifications as read
    if notification.sender_role != 'admin':
        return jsonify({"error": "Access denied - admin notifications only"}), 403
    
    # Mark as read
    notification.read = True
    db.session.commit()
    
    return jsonify({"message": "Notification marked as read"}), 200


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
# SELLER: Get their notifications (session-based)
# ===============================
@notifications_bp.route("/seller/notifications", methods=["GET"])
def get_seller_notifications():
    """Get notifications for the current authenticated seller"""
    # Check if user is authenticated
    if 'user_id' not in session:
        return jsonify({"error": "Authentication required"}), 401
    
    # Get user info to verify they are a seller
    user = User.query.get(session['user_id'])
    if not user or user.account_type != 'seller':
        return jsonify({"error": "Access denied - sellers only"}), 403
    
    # Get notifications for this seller:
    # 1. Notifications targeted specifically to this seller (admin or system notifications)
    # 2. Broadcast notifications (target_user='all')
    # 3. General notifications (target_user=None)
    notifications = Notification.query.filter(
        (Notification.target_user == str(user.id)) | 
        (Notification.target_user == user.id) |  # In case target_user is stored as integer
        (Notification.target_user == 'all') |
        (Notification.target_user.is_(None))
    ).order_by(Notification.date.desc()).all()
    
    return jsonify([n.to_dict() for n in notifications]), 200


# ===============================
# SELLER: Get their notifications (by ID - deprecated, use session-based above)
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


# ===============================
# BUYER: Get admin notifications only
# ===============================
@notifications_bp.route("/buyer/<int:buyer_id>/notifications", methods=["GET"])
def buyer_get_notifications(buyer_id):
    """Get notifications for a specific buyer - only admin notifications"""
    # Get notifications where:
    # 1. sender_role is 'admin' (from admin)
    # 2. target_user is either the buyer_id, "all", OR NULL (for broadcast messages)
    notifications = Notification.query.filter(
        Notification.sender_role == 'admin'
    ).filter(
        (Notification.target_user == str(buyer_id)) | 
        (Notification.target_user == 'all') |
        (Notification.target_user.is_(None))
    ).order_by(Notification.date.desc()).all()
    
    return jsonify([n.to_dict() for n in notifications]), 200


# ===============================
# BUYER: Mark notification as read
# ===============================
@notifications_bp.route("/buyer/notifications/<int:notification_id>/read", methods=["PATCH"])
def buyer_mark_as_read(notification_id):
    """Mark a notification as read for buyer"""
    notif = Notification.query.get(notification_id)
    if not notif:
        return jsonify({"error": "Notification not found"}), 404

    # Ensure it's an admin notification
    if notif.sender_role != 'admin':
        return jsonify({"error": "Access denied"}), 403

    notif.read = True
    db.session.commit()
    return jsonify({"message": "Notification marked as read"}), 200


# ===============================
# BUYER: Get all admin notifications (for current user from session)
# ===============================
@notifications_bp.route("/buyer/notifications", methods=["GET"])
def get_buyer_notifications():
    """Get admin notifications for the current authenticated buyer"""
    from flask import session
    
    # Check if user is authenticated
    if 'user_id' not in session:
        return jsonify({"error": "Authentication required"}), 401
    
    # Get user info to verify they are a buyer
    user = User.query.get(session['user_id'])
    if not user or user.account_type != 'buyer':
        return jsonify({"error": "Access denied - buyers only"}), 403
    
    # Get admin notifications for this buyer or broadcast notifications
    # Include notifications where target_user is "all", user.id, or None
    notifications = Notification.query.filter(
        Notification.sender_role == 'admin'
    ).filter(
        (Notification.target_user == str(user.id)) | 
        (Notification.target_user == 'all') |
        (Notification.target_user.is_(None))
    ).order_by(Notification.date.desc()).all()
    
    return jsonify([n.to_dict() for n in notifications]), 200
