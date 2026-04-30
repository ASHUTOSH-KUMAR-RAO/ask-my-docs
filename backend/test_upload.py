
import requests

token = requests.post(
    'http://127.0.0.1:8000/auth/login',
    json={'email': 'battery@mail.com', 'password': 'battery'}
).json()['access_token']

print('Token mila ✅')

with open(r'C:\Users\aashu\Desktop\dsa.pdf', 'rb') as f:
    res = requests.post(
        'http://127.0.0.1:8000/documents/upload',
        headers={'Authorization': f'Bearer {token}'},
        files={'file': ('dsa.pdf', f, 'application/pdf')}
    )

print('Response:', res.json())
