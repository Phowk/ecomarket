from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt

from config.firebase import db

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# Registro
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")
    full_name = data.get("fullName", "")

    if not email or not password:
        return jsonify({"error": "Email y contraseña son requeridos"}), 400

    # Verificar si ya existe el usuario
    user_ref = db.collection("users").document(email)
    user = user_ref.get()

    if user.exists:
        return jsonify({"error": "El usuario ya existe"}), 409

    hashed = generate_password_hash(password)

    user_ref.set({
        "email": email,
        "password": hashed,
        "role": role,
        "full_name": full_name
    })

    return jsonify({"message": "Usuario registrado con éxito"}), 201


# Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    user_ref = db.collection("users").document(email)
    user = user_ref.get()

    if not user.exists:
        return jsonify({"error": "Usuario no encontrado"}), 404

    user_data = user.to_dict()
    print("Email enviado:", email)
    print("Contraseña enviada:", password)
    print("Password guardada (hash):", user_data["password"])

    print("Contraseña ingresada:", password)
    print("Hash guardado:", user_data["password"])
    print("Coincide?", check_password_hash(user_data["password"], password))

    if not check_password_hash(user_data["password"], password):
        return jsonify({"error": "Contraseña incorrecta"}), 401

    # Crear token CORRECTO
    token = create_access_token(
        identity=email,
        additional_claims={
            "role": user_data["role"],
            "full_name": user_data.get("full_name", "")
        }
    )

    return jsonify({"token": token}), 200

@auth_bp.route("/catalogo", methods=["GET"])
@jwt_required()
def catalogo():
    identity = get_jwt_identity()
    claims = get_jwt()

    return jsonify({"identity": identity, "claims": claims})