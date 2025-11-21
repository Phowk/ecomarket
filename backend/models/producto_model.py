from config.firebase import db

class ProductosModel:
    @staticmethod
    def listar():
        docs = db.collection("productos").get()
        return [doc.to_dict() for doc in docs]