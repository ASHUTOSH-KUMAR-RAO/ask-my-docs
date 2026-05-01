"""
generator.py — LLM Response Generation with Citation Enforcement

Steps:
1. Reranked chunks se context banao
2. Citation-enforced prompt banao
3. Groq LLM se answer generate karo
4. Citations parse karo
5. Response return karo
"""

from groq import Groq
from config import settings

# ── Groq Client ───────────────────────────────────────────────
_groq_client = None

def get_groq_client():
    global _groq_client
    if _groq_client is None:
        _groq_client = Groq(api_key=settings.GROQ_API_KEY)
    return _groq_client


def build_context(chunks: list[dict]) -> str:
    """
    Reranked chunks se numbered context banao.

    Example output:
    [1] (Page 2): "Arrays are linear data structures..."
    [2] (Page 3): "Linked lists store elements..."

    Args:
        chunks: Reranked chunks list
    Returns:
        Formatted context string
    """
    context_parts = []
    for i, chunk in enumerate(chunks, 1):
        context_parts.append(f"[{i}] (Page {chunk['page']}): \"{chunk['text']}\"")
    return "\n\n".join(context_parts)


def build_prompt(query: str, context: str) -> str:
    """
    Citation-enforced prompt banao.

    LLM ko force karta hai ki:
    - Sirf context se answer de
    - Har claim ke saath [1], [2] citation de
    - Context se bahar na jaye

    Args:
        query: User query
        context: Formatted context string
    Returns:
        Complete prompt
    """
    return f"""You are a helpful assistant that answers questions based ONLY on the provided context.

RULES:
1. Answer ONLY using the context below
2. Every claim MUST have a citation like [1], [2], etc.
3. If the answer is not in the context, say "I cannot find this information in the provided documents."
4. Be concise and accurate
5. Never make up information

CONTEXT:
{context}

QUESTION: {query}

ANSWER (with citations):"""


def parse_citations(answer: str, chunks: list[dict]) -> list[dict]:
    """
    Answer mein se citations parse karo.

    Example:
    "Arrays are O(1) access [1] but O(n) search [2]"
    → citations: [chunk_1_data, chunk_2_data]

    Args:
        answer: LLM generated answer
        chunks: Reranked chunks
    Returns:
        List of cited chunks
    """
    import re

    # Find all citation numbers like [1], [2], etc.
    citation_nums = re.findall(r'\[(\d+)\]', answer)
    citation_nums = list(set(int(n) for n in citation_nums))

    cited_chunks = []
    for num in sorted(citation_nums):
        idx = num - 1  # Convert to 0-indexed
        if 0 <= idx < len(chunks):
            cited_chunks.append({
                "citation_number": num,
                "text": chunks[idx]["text"],
                "page": chunks[idx]["page"]
            })

    return cited_chunks


def generate_answer(query: str, chunks: list[dict]) -> dict:
    """
    Complete generation pipeline.

    Steps:
    1. Context banao
    2. Prompt banao
    3. Groq se answer lo
    4. Citations parse karo
    5. Response return karo

    Args:
        query: User query
        chunks: Reranked chunks from reranker
    Returns:
        Dict with answer and citations
    """
    if not chunks:
        return {
            "answer": "No relevant information found in the documents.",
            "citations": [],
            "model": "none"
        }

    # Step 1 — Build context
    context = build_context(chunks)

    # Step 2 — Build prompt
    prompt = build_prompt(query, context)

    # Step 3 — Generate answer
    client = get_groq_client()

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a precise document assistant. Always cite sources using [1], [2] format."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.1,  # Low temperature for factual answers
        max_tokens=1024
    )

    answer = response.choices[0].message.content

    # Step 4 — Parse citations
    citations = parse_citations(answer, chunks)

    # Step 5 — Return response
    return {
        "answer": answer,
        "citations": citations,
        "model": "openai/gpt-oss-20b",
        "chunks_used": len(chunks)
    }
