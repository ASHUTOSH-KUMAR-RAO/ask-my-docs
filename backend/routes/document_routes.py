"""
document_routes.py — Document upload and management routes

Routes:
- POST /documents/upload  → Upload PDF document
- GET  /documents         → Get all documents for current user
- DELETE /documents/{id}  → Delete a document
"""

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from auth import verify_token
from supabase import create_client
from config import settings
import uuid
import os
import sys
import subprocess
import json

router = APIRouter(prefix="/documents", tags=["Documents"])

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

# Temporary upload folder
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Depends(verify_token)
):
    print(f"Upload request received from user: {user_id}")

    # Validate PDF
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )

    print(f"File: {file.filename}")

    # Generate unique ID for file
    file_id = str(uuid.uuid4())
    file_path = f"{UPLOAD_DIR}/{file_id}.pdf"

    # Save file to disk
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    print(f"File saved to: {file_path}, size: {len(content)}")

    # Ingest document via subprocess — server crash nahi hoga
    pages = 0
    chunks = 0
    try:
        print("Starting ingestion via subprocess...")
        result = subprocess.run(
            [sys.executable, "run_ingestion.py", file_id, file_path],
            capture_output=True,
            text=True,
            timeout=120
        )
        print(f"Subprocess stdout: {result.stdout}")
        print(f"Subprocess stderr: {result.stderr}")

        if result.returncode == 0:
            # Last line mein JSON output hoga
            last_line = result.stdout.strip().split('\n')[-1]
            output = json.loads(last_line)
            pages = output.get("pages", 0)
            chunks = output.get("chunks", 0)
            print(f"Ingestion complete ✅ — pages: {pages}, chunks: {chunks}")
        else:
            print(f"Ingestion failed with return code: {result.returncode}")
    except subprocess.TimeoutExpired:
        print("Ingestion timeout — took more than 120 seconds")
    except Exception as e:
        print(f"Ingestion error: {e}")

    # Store metadata in Supabase
    supabase.table("documents").insert({
        "id": file_id,
        "user_id": user_id,
        "name": file.filename,
        "size": len(content),
        "file_path": file_path,
    }).execute()

    print("Metadata saved to Supabase ✅")

    return {
        "document_id": file_id,
        "name": file.filename,
        "size": len(content),
        "pages": pages,
        "chunks": chunks,
        "message": "Document uploaded successfully!"
    }


@router.get("/")
async def get_documents(user_id: str = Depends(verify_token)):
    result = supabase.table("documents").select("*").eq("user_id", user_id).execute()
    return {"documents": result.data}


@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    user_id: str = Depends(verify_token)
):
    result = supabase.table("documents").select("*").eq("id", document_id).eq("user_id", user_id).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    supabase.table("documents").delete().eq("id", document_id).execute()

    file_path = result.data[0]["file_path"]
    if os.path.exists(file_path):
        os.remove(file_path)

    return {"message": "Document deleted successfully!"}
