"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"msg": "No se recibieron datos necesarios"}), 400

    required_fields = ["email", "password"]
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Faltan datos obligatorios"}), 400

    email = data['email']
    password = data['password']

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "El usuario con este correo electrónico ya está registrado.", "success": False}), 409

    new_user = User(
        email=email,
        is_active=True
    )
    new_user.set_password(password)

    db.session.add(new_user)

    try:
        db.session.commit()
        return jsonify({"msg": "Usuario registrado exitosamente.",
                        "success": True}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al registrar el usuario.", "success": False, "error": str(e)}), 500


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({
            "success": False,
            "msg": "Email and password are required."
        }), 400

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password_hash, data["password"]):
        return jsonify({
            "success": False,
            "msg": "Invalid credentials. Please verify your email and password."
        }), 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"email": user.email}
    )
    return jsonify({
        "msg": "Inicio correctamente",
        "success": True,
        "user": user.serialize(),
        "access_token": access_token,
    }), 200
