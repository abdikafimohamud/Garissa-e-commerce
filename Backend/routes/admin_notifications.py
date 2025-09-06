# from flask import Blueprint, request, jsonify
# from app import db
# from models.admin_notifications import admin_notifications
# from models.seller import Seller
# from datetime import datetime

# # Blueprint for natifications
# natifications_bp = Blueprint('natifications', __name__)

# # Get all natifications
# @natifications_bp.route('/', methods=['GET'])
# def get_natifications():
#     try:
#         target_type = request.args.get('target_type')
#         target_id = request.args.get('target_id')
        
#         query = admin_notifications.query
        
#         if target_type:
#             query = query.filter_by(target_type=target_type)
#         if target_id:
#             query = query.filter_by(target_id=target_id)
            
#         natifications = query.order_by(admin_notifications.date.desc()).all()
#         return jsonify([natification.to_dict() for natification in natifications])
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # Create new natification
# @natifications_bp.route('/natification', methods=['POST'])
# def create_natification():
#     try:
#         data = request.get_json()
        
#         natification = admin_notifications(
#             title=data['title'],
#             message=data['message'],
#             type=data.get('type', 'info'),
#             target_type=data.get('targetType', 'user'),
#             target_id=data.get('targetId', 'all'),
#             sender_id=data.get('senderId')
#         )
        
#         db.session.add(natification)
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Natification sent successfully',
#             'natification': natification.to_dict()
#         }), 201
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 400

# # Get natifications for specific seller
# @natifications_bp.route('/seller/<int:seller_id>', methods=['GET'])
# def get_seller_natifications(seller_id):
#     try:
#         natifications = admin_notifications.query.filter(
#             admin_notifications.target_type == 'seller',
#             admin_notifications.target_id.in_(['all', str(seller_id)])
#         ).order_by(admin_notifications.date.desc()).all()
        
#         return jsonify([natification.to_dict() for natification in natifications])
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # Mark natification as read
# @natifications_bp.route('/<int:natification_id>/read', methods=['PUT'])
# def mark_as_read(natification_id):
#     try:
#         natification = admin_notifications.query.get_or_404(natification_id)
#         natification.read = True
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Natification marked as read',
#             'natification': natification.to_dict()
#         }), 200
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 400

# # Delete natification
# @natifications_bp.route('/<int:natification_id>', methods=['DELETE'])
# def delete_natification(natification_id):
#     try:
#         natification = admin_notifications.query.get_or_404(natification_id)
#         db.session.delete(natification)
#         db.session.commit()
        
#         return jsonify({'message': 'Natification deleted successfully'}), 200
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500
