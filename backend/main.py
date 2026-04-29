from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth_routes import router as auth_router

app = FastAPI(
    title="Ask My Docs API",
    description="Production RAG System with Hybrid Retrieval",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Development ke liye
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)

@app.get("/")
async def root():
    return {"message": "Ask My Docs API is running! 🚀"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
