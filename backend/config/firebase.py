import firebase_admin
from firebase_admin import credentials, firestore

import os
print("Ruta actual:", os.getcwd())
print("Existe archivo:", os.path.isfile("ecomarket/backend/serviceAccountKey.json"))

cred = credentials.Certificate("ecomarket/backend/serviceAccountkey.json.")
firebase_admin.initialize_app(cred)

db = firestore.client()