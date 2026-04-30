"""
ingestion.py — Document processing and embedding pipeline

This module handles the complete RAG ingestion pipeline:
1. PDF text extraction
2. Text chunking
3. Embedding generation
4. Vector storage in ChromaDB
5. BM25 index creation for keyword search

Libraries used:
- pypdf: Extract text from PDF files
- langchain: Document loading and text splitting
  - RecursiveCharacterTextSplitter: Splits text into overlapping chunks
- sentence-transformers: Generate dense vector embeddings
  - Model: all-MiniLM-L6-v2 (fast, accurate, 384 dimensions)
- chromadb: Vector database for storing and querying embeddings
- rank_bm25: BM25Okapi for keyword-based sparse retrieval
"""

import os
import pickle
import traceback
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import chromadb
from chromadb.config import Settings
from rank_bm25 import BM25Okapi

# ── Lazy Loading ──────────────────────────────────────────────
_embedding_model = None
_chroma_client = None


def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        print("Loading embedding model...")
        import torch
        torch.set_num_threads(1)  # ← Windows crash fix
        from sentence_transformers import SentenceTransformer
        _embedding_model = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")
        print("Embedding model loaded!")
    return _embedding_model


def get_chroma_client():
    global _chroma_client
    if _chroma_client is None:
        _chroma_client = chromadb.PersistentClient(
            path="./chroma_db",
            settings=Settings(anonymized_telemetry=False)
        )
    return _chroma_client


# ── Text Splitter ─────────────────────────────────────────────
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\n\n", "\n", ".", "!", "?", ",", " ", ""]
)

# ── BM25 Storage ──────────────────────────────────────────────
BM25_DIR = "./bm25_indexes"
os.makedirs(BM25_DIR, exist_ok=True)


def extract_text_from_pdf(file_path: str) -> list[dict]:
    reader = PdfReader(file_path)
    pages = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text and text.strip():
            pages.append({
                "text": text.strip(),
                "page": i + 1
            })
    return pages


def chunk_text(pages: list[dict]) -> list[dict]:
    chunks = []
    chunk_index = 0
    for page_data in pages:
        page_chunks = text_splitter.split_text(page_data["text"])
        for chunk in page_chunks:
            if chunk.strip():
                chunks.append({
                    "text": chunk.strip(),
                    "page": page_data["page"],
                    "chunk_index": chunk_index
                })
                chunk_index += 1
    return chunks


def generate_embeddings(texts: list[str]) -> list[list[float]]:
    model = get_embedding_model()
    embeddings = model.encode(texts, show_progress_bar=False)
    return embeddings.tolist()


def store_in_chromadb(document_id: str, chunks: list[dict]) -> None:
    client = get_chroma_client()
    collection = client.get_or_create_collection(
        name=f"doc_{document_id}",
        metadata={"hnsw:space": "cosine"}
    )
    texts = [chunk["text"] for chunk in chunks]
    embeddings = generate_embeddings(texts)
    ids = [f"{document_id}_chunk_{i}" for i in range(len(chunks))]
    metadatas = [{"page": chunk["page"], "chunk_index": chunk["chunk_index"]} for chunk in chunks]
    collection.add(
        embeddings=embeddings,
        documents=texts,
        metadatas=metadatas,
        ids=ids
    )


def create_bm25_index(document_id: str, chunks: list[dict]) -> None:
    tokenized_chunks = [chunk["text"].lower().split() for chunk in chunks]
    bm25 = BM25Okapi(tokenized_chunks)
    index_path = f"{BM25_DIR}/{document_id}.pkl"
    with open(index_path, "wb") as f:
        pickle.dump({"bm25": bm25, "chunks": chunks}, f)


def ingest_document(document_id: str, file_path: str) -> dict:
    try:
        print(f"Starting ingestion for {document_id}")

        # Step 1 — Extract text
        pages = extract_text_from_pdf(file_path)
        print(f"Pages extracted: {len(pages)}")
        if not pages:
            raise ValueError("No text found in PDF")

        # Step 2 — Chunk text
        chunks = chunk_text(pages)
        print(f"Chunks created: {len(chunks)}")
        if not chunks:
            raise ValueError("No chunks created from PDF")

        # Step 3 + 4 — Embed and store in ChromaDB
        print("Loading embedding model & storing in ChromaDB...")
        store_in_chromadb(document_id, chunks)
        print("Stored in ChromaDB ✅")

        # Step 5 — Create BM25 index
        create_bm25_index(document_id, chunks)
        print("BM25 index created ✅")

        return {
            "document_id": document_id,
            "pages": len(pages),
            "chunks": len(chunks),
            "status": "ingested"
        }

    except Exception as e:
        print(f"INGESTION ERROR: {e}")
        traceback.print_exc()
        raise
