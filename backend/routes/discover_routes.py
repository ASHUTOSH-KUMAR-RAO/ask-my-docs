from fastapi import APIRouter
from generator import get_groq_client
import json

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/answer")
async def get_quick_answer(request: dict):
    question = request.get("question", "")

    client = get_groq_client()

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant. Answer questions clearly and concisely in 3-4 sentences."
            },
            {
                "role": "user",
                "content": question
            }
        ],
        temperature=0.7,
        max_tokens=300
    )

    return {"answer": response.choices[0].message.content}


@router.get("/questions")
async def get_popular_questions():
    client = get_groq_client()

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",  # ✅ Fix 1: Sahi model
        messages=[
            {
                "role": "system",
                "content": "Return only a JSON array of 5 popular computer science interview questions. No explanation, just the JSON array."
            },
            {
                "role": "user",
                "content": "Give me 5 popular CS/programming questions"
            }
        ],
        temperature=0.8,
        max_tokens=600  # ✅ Fix 2: Tokens badhaye
    )

    text = response.choices[0].message.content
    clean = text.strip().replace("```json", "").replace("```", "").strip()

    try:  # ✅ Fix 3: Error handling
        questions = json.loads(clean)
    except json.JSONDecodeError:
        questions = ["Could not load questions, please try again."]

    return {"questions": questions}
