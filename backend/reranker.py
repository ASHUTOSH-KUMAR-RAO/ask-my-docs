"""
reranker.py — Cross-Encoder Reranking Pipeline

Cross-encoder query aur har chunk ko saath mein evaluate karta hai
aur zyada accurate relevance score deta hai.

Model: cross-encoder/ms-marco-MiniLM-L-6-v2
- Fast and lightweight
- Great for reranking
- Free and runs locally
"""

import subprocess
import sys
import json
import os

# Reranking subprocess script path
RERANKER_SCRIPT = os.path.join(os.path.dirname(__file__), "run_reranker.py")


def rerank(query: str, chunks: list[dict], top_k: int = 5) -> list[dict]:
    """
    Rerank chunks using cross-encoder model via subprocess.

    Args:
        query: User query
        chunks: List of chunks from hybrid search
        top_k: Number of top chunks to return after reranking
    Returns:
        Reranked list of top K chunks
    """
    if not chunks:
        return []

    try:
        # Pass data to subprocess
        input_data = json.dumps({
            "query": query,
            "chunks": chunks,
            "top_k": top_k
        })

        result = subprocess.run(
            [sys.executable, RERANKER_SCRIPT],
            input=input_data,
            capture_output=True,
            text=True,
            timeout=60
        )

        if result.returncode == 0:
            last_line = result.stdout.strip().split('\n')[-1]
            reranked = json.loads(last_line)
            return reranked
        else:
            print(f"Reranker error: {result.stderr}")
            # Fallback — return original chunks
            return chunks[:top_k]

    except Exception as e:
        print(f"Reranking failed: {e}")
        # Fallback — return original chunks
        return chunks[:top_k]
