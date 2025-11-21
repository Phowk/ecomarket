from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from blueprints.auth import auth_bp
from blueprints.productos import productos_bp
from config.firebase import db

# Inicializar Flask
app = Flask(__name__)
CORS(app)

# JWT
app.config["JWT_SECRET_KEY"] = "clave_super_secreta_escuela"
jwt = JWTManager(app)

# Registrar blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(productos_bp, url_prefix="/api/productos")

@app.route("/")
def index():
    return "Backend Flask funcionando"

if __name__ == "__main__":
    app.run(debug=True)
