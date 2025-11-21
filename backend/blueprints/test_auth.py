import requests

BASE_URL = "http://127.0.0.1:5000/api/auth"

# ---------- PROBAR REGISTRO ----------
def test_register():
    data = {
        "email": input("Email para registro: "),
        "password": input("Contraseña para registro: ")
    }
    r = requests.post(f"{BASE_URL}/register", json=data)
    print("Registro:", r.status_code, r.json())

# ---------- PROBAR LOGIN ----------
def test_login():
    
    data = {
        "email": input("Email para login: "),
        "password": "" + input("Contraseña para login: ")
    }
    r = requests.post(f"{BASE_URL}/login", json=data)
    print("Login:", r.status_code, r.json())
    return r.json().get("token")


# ---------- PROBAR RUTA PROTEGIDA ----------
def test_me(token):
    headers = {
        "Authorization": f"Bearer {token}"
    }
    r = requests.get(f"{BASE_URL}/catalogo", headers=headers)
    print("STATUS:", r.status_code)
    print("TEXT:", r.text)
    print("ME:", r.status_code, r.json())


if __name__ == "__main__":
    # print("\n--- PROBANDO REGISTRO ---")
    # test_register()

    print("\n--- PROBANDO LOGIN ---")
    token = test_login()

    if token:
        print("\n--- PROBANDO RUTA PROTEGIDA ---")
        test_me(token)