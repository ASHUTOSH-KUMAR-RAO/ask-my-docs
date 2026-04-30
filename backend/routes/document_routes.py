"""
document_routes.py — Document upload and management routes

Routes:
- POST /documents/upload  → Upload PDF document
- GET  /documents         → Get all documents for current user
- DELETE /documents/{id}  → Delete a document

Libraries used:
- pypdf: Extract text from PDF files
- langchain: Document text splitting into chunks
- chromadb: Vector database for storing embeddings
- sentence-transformers: Generate text embeddings
- rank_bm25: BM25 keyword search
"""

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from auth import verify_token
from supabase import create_client
from config import settings
import uuid
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor

router = APIRouter(prefix="/documents", tags=["Documents"])

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

# Thread pool for running ingestion in background
executor = ThreadPoolExecutor(max_workers=1)

# Temporary upload folder
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Depends(verify_token)
):
    """
    Upload a PDF document.

    Steps:
    1. Validate file is PDF
    2. Save file temporarily to uploads folder
    3. Ingest document in background thread (extract text, chunk, embed, store in vector DB)
    4. Store metadata in Supabase documents table
    5. Return document info
    """
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

    # Ingest document in background thread
    pages = 0
    chunks = 0
    try:
        from ingestion import ingest_document
        loop = asyncio.get_event_loop()
        ingest_result = await loop.run_in_executor(
            executor, ingest_document, file_id, file_path
        )
        pages = ingest_result["pages"]
        chunks = ingest_result["chunks"]
        print(f"Ingestion complete ✅ — pages: {pages}, chunks: {chunks}")
    except Exception as e:
        print(f"Ingestion failed: {e}")
        import traceback
        traceback.print_exc()

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
    """
    Get all documents for current user.
    Protected route — requires valid JWT token.
    """
    result = supabase.table("documents").select("*").eq("user_id", user_id).execute()
    return {"documents": result.data}


@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    user_id: str = Depends(verify_token)
):
    """
    Delete a document by ID.
    Only document owner can delete.

    Steps:
    1. Check document exists and belongs to user
    2. Delete from Supabase
    3. Delete file from disk
    """
    # Check ownership
    result = supabase.table("documents").select("*").eq("id", document_id).eq("user_id", user_id).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    # Delete from Supabase
    supabase.table("documents").delete().eq("id", document_id).execute()

    # Delete file from disk
    file_path = result.data[0]["file_path"]
    if os.path.exists(file_path):
        os.remove(file_path)

    return {"message": "Document deleted successfully!"}
