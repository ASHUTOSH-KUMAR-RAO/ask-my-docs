from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GROQ_API_KEY: str
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SECRET: str
    SECRET_KEY: str = "ask-my-docs-secret-key-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    HF_TOKEN: str = ""  # ← HuggingFace token (optional)

    class Config:
        env_file = "../.env"
        extra = "ignore"  # ← extra fields ko ignore karo

settings = Settings()
