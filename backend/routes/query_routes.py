"""
query_routes.py — Query and Chat routes

Routes:
- POST /query  → Query a document

Pipeline:
1. Hybrid search (BM25 + Vector)
2. Cross-encoder reranking
3. LLM answer generation with citations
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from auth import verify_token
from retriever import hybrid_search
from reranker import rerank
from generator import generate_answer

router = APIRouter(prefix="/query", tags=["Query"])


class QueryRequest(BaseModel):
    document_id: str
    query: str
    top_k: int = 5


@router.post("/")
async def query_document(
    request: QueryRequest,
    user_id: str = Depends(verify_token)
):
    """
    Query a document using hybrid RAG pipeline.

    Steps:
    1. Hybrid search (BM25 + ChromaDB)
    2. Cross-encoder reranking
    3. LLM answer generation
    4. Citation enforcement
    """
    print(f"Query from user {user_id}: {request.query}")
    print(f"Document: {request.document_id}")

    # Step 1 — Hybrid search
    print("Running hybrid search...")
    chunks = hybrid_search(
        document_id=request.document_id,
        query=request.query,
        top_k=10
    )
    print(f"Found {len(chunks)} chunks")

    if not chunks:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No relevant content found in document"
        )

    # Step 2 — Rerank
    print("Reranking chunks...")
    reranked_chunks = rerank(
        query=request.query,
        chunks=chunks,
        top_k=request.top_k
    )
    print(f"Reranked to {len(reranked_chunks)} chunks")

    # Step 3 — Generate answer
    print("Generating answer...")
    result = generate_answer(
        query=request.query,
        chunks=reranked_chunks
    )
    print("Answer generated")

    return {
        "query": request.query,
        "answer": result["answer"],
        "citations": result["citations"],
        "model": result["model"],
        "chunks_used": result["chunks_used"]
    }
