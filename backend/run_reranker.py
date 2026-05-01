"""
run_reranker.py — Subprocess script for cross-encoder reranking
"""

import sys
import json
from sentence_transformers import CrossEncoder

if __name__ == "__main__":
    # Read input from stdin
    input_data = json.loads(sys.stdin.read())
    query = input_data["query"]
    chunks = input_data["chunks"]
    top_k = input_data["top_k"]

    # Load cross-encoder model
    model = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

    # Create query-chunk pairs
    pairs = [[query, chunk["text"]] for chunk in chunks]

    # Get scores
    scores = model.predict(pairs)

    # Add scores to chunks
    for i, chunk in enumerate(chunks):
        chunk["rerank_score"] = float(scores[i])

    # Sort by rerank score
    reranked = sorted(chunks, key=lambda x: x["rerank_score"], reverse=True)

    # Return top K
    print(json.dumps(reranked[:top_k]))
