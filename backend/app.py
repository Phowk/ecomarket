from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, auth, firestore

# Inicializar Flask
app = Flask(__name__)

# Inicializar Firebase Admin
cred = credentials.Certificate("ecomarket-9c32a-firebase-adminsdk-fbsvc-4071a3c3bf.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Ruta de prueba
@app.route("/api/protected", methods=["GET"])
def protected():
    id_token = request.headers.get("Authorization")
    if not id_token:
        return jsonify({"error": "No token provided"}), 401
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token["uid"]
        return jsonify({"message": f"Hola usuario {uid}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 401

# Ruta para obtener productos
@app.route("/api/productos", methods=["GET"])
def get_productos():
    productos_ref = db.collection("productos")
    docs = productos_ref.stream()
    productos = [doc.to_dict() for doc in docs]
    return jsonify(productos)

if __name__ == "__main__":
    app.run(debug=True)
