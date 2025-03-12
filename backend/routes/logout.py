from flask import Blueprint, session, jsonify

logout_bp = Blueprint('logout', __name__)

@logout_bp.route('/logout', methods=['POST'])
def logout():
        session.clear()
        return jsonify({"message": "Logout successful"}),200