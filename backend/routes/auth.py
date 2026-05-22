from flask import Blueprint, request, jsonify
from db.models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data     = request.get_json()
    email    = data.get('email', '').strip()
    password = data.get('password', '')
    name     = data.get('name', '').strip()

    if not email or not password:
        return jsonify({'error': 'Email và mật khẩu không được để trống'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email đã được sử dụng'}), 409

    user = User(email=email, name=name)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Đăng ký thành công', 'user': user.to_dict()}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data     = request.get_json()
    email    = data.get('email', '').strip()
    password = data.get('password', '')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Email hoặc mật khẩu không đúng'}), 401

    return jsonify({'message': 'Đăng nhập thành công', 'user': user.to_dict()}), 200
