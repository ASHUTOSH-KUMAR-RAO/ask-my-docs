import requests

BASE_URL = "http://127.0.0.1:8000"

# Login
token = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "battery@mail.com",
    "password": "battery"
}).json()["access_token"]

print("Token mila")

# Fresh upload
with open(r"C:\Users\aashu\Desktop\dsa.pdf", "rb") as f:
    upload_res = requests.post(
        f"{BASE_URL}/documents/upload",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("dsa.pdf", f, "application/pdf")}
    ).json()

print("Upload:", upload_res)
document_id = upload_res["document_id"]

# Query
response = requests.post(f"{BASE_URL}/query/",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "document_id": document_id,
        "query": "what is this document about?",
        "top_k": 5
    }
).json()

print("Response:", response)
