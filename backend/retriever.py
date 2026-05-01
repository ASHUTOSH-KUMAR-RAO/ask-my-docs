"""
retriever.py — Hybrid Retrieval Pipeline

Steps:
1. BM25 keyword search
2. ChromaDB vector search
3. Combine and deduplicate results
4. Return top K chunks
"""

import pickle
import os
from rank_bm25 import BM25Okapi
import chromadb
from chromadb.config import Settings

# ── ChromaDB Client ───────────────────────────────────────────
_chroma_client = None

def get_chroma_client():
    global _chroma_client
    if _chroma_client is None:
        _chroma_client = chromadb.PersistentClient(
            path="./chroma_db",
            settings=Settings(anonymized_telemetry=False)
        )
    return _chroma_client

BM25_DIR = "./bm25_indexes"


def bm25_search(document_id: str, query: str, top_k: int = 10) -> list[dict]:
    """
    BM25 keyword search on a document.

    Args:
        document_id: Document to search in
        query: User query
        top_k: Number of results to return
    Returns:
        List of chunks with scores
    """
    index_path = f"{BM25_DIR}/{document_id}.pkl"

    if not os.path.exists(index_path):
        return []

    with open(index_path, "rb") as f:
        data = pickle.load(f)

    bm25: BM25Okapi = data["bm25"]
    chunks: list[dict] = data["chunks"]

    # Tokenize query
    tokenized_query = query.lower().split()

    # Get BM25 scores
    scores = bm25.get_scores(tokenized_query)

    # Get top K indices
    top_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:top_k]

    results = []
    for idx in top_indices:
        if scores[idx] > 0:  # Only include relevant results
            results.append({
                "text": chunks[idx]["text"],
                "page": chunks[idx]["page"],
                "chunk_index": chunks[idx]["chunk_index"],
                "score": float(scores[idx]),
                "source": "bm25"
            })

    return results


def vector_search(document_id: str, query: str, top_k: int = 10) -> list[dict]:
    """
    ChromaDB vector/semantic search on a document.

    Args:
        document_id: Document to search in
        query: User query
        top_k: Number of results to return
    Returns:
        List of chunks with scores
    """
    client = get_chroma_client()

    try:
        collection = client.get_collection(name=f"doc_{document_id}")
    except Exception:
        return []

    results = collection.query(
        query_texts=[query],
        n_results=min(top_k, collection.count())
    )

    chunks = []
    if results["documents"] and results["documents"][0]:
        for i, doc in enumerate(results["documents"][0]):
            chunks.append({
                "text": doc,
                "page": results["metadatas"][0][i]["page"],
                "chunk_index": results["metadatas"][0][i]["chunk_index"],
                "score": 1 - results["distances"][0][i],  # Convert distance to similarity
                "source": "vector"
            })

    return chunks


def hybrid_search(document_id: str, query: str, top_k: int = 10) -> list[dict]:
    """
    Hybrid search combining BM25 + Vector search.

    Steps:
    1. BM25 search
    2. Vector search
    3. Combine and deduplicate by chunk_index
    4. Sort by score
    5. Return top K

    Args:
        document_id: Document to search in
        query: User query
        top_k: Number of results to return
    Returns:
        List of top K chunks
    """
    # Step 1 — BM25 search
    bm25_results = bm25_search(document_id, query, top_k)

    # Step 2 — Vector search
    vector_results = vector_search(document_id, query, top_k)

    # Step 3 — Combine and deduplicate
    seen_chunks = {}

    for chunk in bm25_results:
        key = chunk["chunk_index"]
        if key not in seen_chunks:
            seen_chunks[key] = chunk
        else:
            # If already seen, take higher score
            if chunk["score"] > seen_chunks[key]["score"]:
                seen_chunks[key] = chunk

    for chunk in vector_results:
        key = chunk["chunk_index"]
        if key not in seen_chunks:
            seen_chunks[key] = chunk
        else:
            # Combine scores from both sources
            seen_chunks[key]["score"] += chunk["score"]
            seen_chunks[key]["source"] = "hybrid"

    # Step 4 — Sort by score
    combined = list(seen_chunks.values())
    combined.sort(key=lambda x: x["score"], reverse=True)

    # Step 5 — Return top K
    return combined[:top_k]
