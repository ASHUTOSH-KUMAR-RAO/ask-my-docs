"""
auth_routes.py — Authentication API routes for Ask My Docs

Routes:
- POST /auth/signup  → Register new user
- POST /auth/login   → Login and get JWT tokens
- POST /auth/refresh → Get new access token using refresh token
- GET  /auth/me      → Get current user info (protected)

Libraries used:
- FastAPI: APIRouter for grouping related routes
- Supabase: Database to store and fetch user data
- auth.py: Our custom JWT and password utilities
"""

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from supabase import create_client
from config import settings
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_refresh_token,
    verify_token
)

# ── Router Setup ──────────────────────────────────────────────
router = APIRouter(prefix="/auth", tags=["Authentication"])

# ── Supabase Client ───────────────────────────────────────────
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


# ── Request Models ────────────────────────────────────────────

class SignupRequest(BaseModel):
    """Request body for user registration"""
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    """Request body for user login"""
    email: EmailStr
    password: str

class RefreshRequest(BaseModel):
    """Request body for token refresh"""
    refresh_token: str


# ── Response Models ───────────────────────────────────────────

class AuthResponse(BaseModel):
    """Response returned after successful login/signup"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_id: str
    name: str
    email: str

class TokenResponse(BaseModel):
    """Response returned after token refresh"""
    access_token: str
    token_type: str = "bearer"


# ── Routes ────────────────────────────────────────────────────

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(request: SignupRequest):
    """
    Register a new user.

    Steps:
    1. Check if email already exists in Supabase
    2. Hash the password using bcrypt
    3. Store user in Supabase 'users' table
    4. Return JWT access token + refresh token
    """
    # Check if user already exists
    existing = supabase.table("users").select("*").eq("email", request.email).execute()
    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash password before storing
    hashed = hash_password(request.password)

    # Insert new user into Supabase
    result = supabase.table("users").insert({
        "name": request.name,
        "email": request.email,
        "password": hashed,
    }).execute()

    user = result.data[0]

    # Create access token (30 min) + refresh token (7 days)
    access_token = create_access_token({"sub": str(user["id"])})
    refresh_token = create_refresh_token({"sub": str(user["id"])})

    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=str(user["id"]),
        name=user["name"],
        email=user["email"],
    )


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """
    Login existing user.

    Steps:
    1. Find user by email in Supabase
    2. Verify password using bcrypt
    3. Return JWT access token + refresh token
    """
    # Find user by email
    result = supabase.table("users").select("*").eq("email", request.email).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    user = result.data[0]

    # Verify password
    if not verify_password(request.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create access token (30 min) + refresh token (7 days)
    access_token = create_access_token({"sub": str(user["id"])})
    refresh_token = create_refresh_token({"sub": str(user["id"])})

    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=str(user["id"]),
        name=user["name"],
        email=user["email"],
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(request: RefreshRequest):
    """
    Get new access token using refresh token.
    No re-login needed!

    Steps:
    1. Verify refresh token
    2. Get user from Supabase
    3. Return new access token
    """
    # Verify refresh token and get user_id
    user_id = verify_refresh_token(request.refresh_token)

    # Get user from Supabase
    result = supabase.table("users").select("*").eq("id", user_id).execute()
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Create new access token
    new_access_token = create_access_token({"sub": user_id})

    return TokenResponse(access_token=new_access_token)


@router.get("/me")
async def get_me(user_id: str = Depends(verify_token)):
    """
    Get current logged in user info.
    Protected route — requires valid JWT access token.
    """
    result = supabase.table("users").select("*").eq("id", user_id).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user = result.data[0]
    return {
        "user_id": user["id"],
        "name": user["name"],
        "email": user["email"],
    }
