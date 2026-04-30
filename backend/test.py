
print("Step 1 - starting")
import sys
sys.stdout.flush()

print("Step 2 - importing fastapi")
from fastapi import FastAPI
print("Step 3 - fastapi ok")

print("Step 4 - importing auth")
from routes.auth_routes import router as auth_router
print("Step 5 - auth ok")

print("Step 6 - importing documents")
from routes.document_routes import router as document_router
print("Step 7 - documents ok")

print("Step 8 - all imports done!")
