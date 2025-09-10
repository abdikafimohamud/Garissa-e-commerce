# # routes/profile.py
# from flask import Blueprint, request, jsonify, session
# from werkzeug.utils import secure_filename
# import os
# from app import db
# from models.user import User
# from models.profile import Profile
# import bcrypt

# profile_bp = Blueprint("profile_bp", __name__)

# UPLOAD_FOLDER = "static/uploads"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# # ✅ Get current user profile
# @profile_bp.route("/get_current_user", methods=["GET"])
# def get_current_user():
#     if "user_id" not in session:
#         return jsonify({"error": "Not logged in"}), 401

#     user = User.query.get(session["user_id"])
#     return jsonify(user.to_dict()), 200


# # ✅ Update profile (fullname, email, profile picture)
# @profile_bp.route("/update_profile", methods=["POST"])
# def update_profile():
#     if "user_id" not in session:
#         return jsonify({"error": "Not logged in"}), 401

#     user = User.query.get(session["user_id"])

#     # Update fullname/email
#     fullname = request.form.get("fullname")
#     email = request.form.get("email")
#     if fullname:
#         user.fullname = fullname
#     if email:
#         # prevent email duplicates
#         if User.query.filter(User.email == email, User.id != user.id).first():
#             return jsonify({"error": "Email already exists"}), 400
#         user.email = email

#     # Ensure profile exists
#     if not user.profile:
#         user.profile = Profile()

#     # Handle profile picture upload
#     if "profile_pic" in request.files:
#         file = request.files["profile_pic"]
#         if file:
#             filename = secure_filename(file.filename)
#             filepath = os.path.join(UPLOAD_FOLDER, filename)
#             file.save(filepath)
#             user.profile.profile_pic = f"/{filepath}"  # accessible via Flask static

#     db.session.commit()
#     return jsonify(user.to_dict()), 200


# # ✅ Update security settings (password, 2FA)
# @profile_bp.route("/update_security", methods=["POST"])
# def update_security():
#     if "user_id" not in session:
#         return jsonify({"error": "Not logged in"}), 401

#     user = User.query.get(session["user_id"])
#     data = request.json

#     # Change password
#     if data.get("password") and data.get("newPassword"):
#         # Check current password
#         if not bcrypt.checkpw(data["password"].encode("utf-8"), user.password.encode("utf-8")):
#             return jsonify({"error": "Current password is incorrect"}), 400

#         hashed_password = bcrypt.hashpw(
#             data["newPassword"].encode("utf-8"),
#             bcrypt.gensalt()
#         ).decode("utf-8")
#         user.password = hashed_password

#     # Ensure profile exists
#     if not user.profile:
#         user.profile = Profile()

#     # Toggle 2FA
#     if "twoFactor" in data:
#         user.profile.two_factor_enabled = data["twoFactor"]

#     db.session.commit()
#     return jsonify({"message": "Security settings updated successfully"}), 200
