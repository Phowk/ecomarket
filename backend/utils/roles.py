from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import jsonify

def role_required(required_role):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            try:
                verify_jwt_in_request()
                identity = get_jwt_identity()
                user_role = identity.get("role")

                if user_role != required_role:
                    return jsonify({"error": "No tienes permisos suficientes"}), 403

            except Exception as e:
                return jsonify({"error": "Token inválido"}), 401

            return fn(*args, **kwargs)

        return decorator
    return wrapper
