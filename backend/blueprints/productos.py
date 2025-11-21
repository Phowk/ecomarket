from flask import Blueprint, jsonify
from models.producto_model import ProductosModel
from utils.roles import role_required

productos_bp = Blueprint("productos", __name__)

@productos_bp.route("/listar", methods=["GET"])
def listar_productos():
    productos = ProductosModel.listar()
    return jsonify(productos)

@productos_bp.route("/admin-only", methods=["GET"])
@role_required("admin")
def admin_only():
    return jsonify({"msg": "Bienvenido admin"})
