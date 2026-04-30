"""
auth.py — Authentication utilities for Ask My Docs API

Libraries used:
- python-jose: JWT token creation and verification
  - JWTError: Exception raised when token is invalid
  - jwt: Encodes and decodes JSON Web Tokens
- passlib: Password hashing library
  - CryptContext: Manages password hashing schemes
  - bcrypt==4.0.1: The hashing algorithm used (industry standard)
    Note: Use bcrypt==4.0.1 — newer versions have passlib compatibility issues
- fastapi.security: OAuth2 password bearer token scheme
"""

from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from config import settings

# ── Password Hashing ──────────────────────────────────────────
# CryptContext sets up bcrypt as the hashing algorithm.
# bcrypt is a slow, salted hash — ideal for storing passwords securely.
# 'deprecated="auto"' means old hashes are automatically upgraded.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ── OAuth2 Scheme ─────────────────────────────────────────────
# OAuth2PasswordBearer tells FastAPI to expect a Bearer token
# in the Authorization header for protected routes.
# tokenUrl points to the login endpoint that issues tokens.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def hash_password(password: str) -> str:
    """
    Hashes a plain text password using bcrypt.
    The result is a salted hash that cannot be reversed.

    Note: bcrypt has a 72-byte limit — password is truncated for safety.

    Args:
        password: Plain text password from the user
    Returns:
        Hashed password string to store in database
    """
    # bcrypt has a 72 byte limit — truncate to avoid ValueError
    return pwd_context.hash(password[:72])


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain text password against a stored bcrypt hash.
    Uses bcrypt's built-in comparison (timing-safe).

    Args:
        plain_password: Password entered by user during login
        hashed_password: Hash stored in Supabase database
    Returns:
        True if passwords match, False otherwise
    """
    # Truncate to 72 bytes — same as hash_password
    return pwd_context.verify(plain_password[:72], hashed_password)


def create_access_token(data: dict) -> str:
    """
    Creates a signed JWT access token with short expiry (30 min).

    JWT (JSON Web Token) contains:
    - Payload: user data (e.g., user_id)
    - Expiry: token expires after ACCESS_TOKEN_EXPIRE_MINUTES
    - Signature: signed with SECRET_KEY using HS256 algorithm
    - Type: "access" to distinguish from refresh token

    Args:
        data: Dictionary containing user info (e.g., {"sub": user_id})
    Returns:
        Encoded JWT access token string
    """
    to_encode = data.copy()

    # Set token expiry time — 30 minutes
    expire = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire, "type": "access"})

    # Encode and sign the token using SECRET_KEY and HS256 algorithm
    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )


def create_refresh_token(data: dict) -> str:
    """
    Creates a signed JWT refresh token with long expiry (7 days).

    Refresh token is used to get a new access token without re-login.
    It has a longer expiry than access token.
    Type is set to "refresh" to distinguish from access token.

    Args:
        data: Dictionary containing user info (e.g., {"sub": user_id})
    Returns:
        Encoded JWT refresh token string
    """
    to_encode = data.copy()

    # Set token expiry time — 7 days
    expire = datetime.utcnow() + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    to_encode.update({"exp": expire, "type": "refresh"})

    # Encode and sign the token
    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )


def verify_refresh_token(token: str) -> str:
    """
    Verifies a refresh token and returns user_id.

    Checks:
    1. Token is valid and not expired
    2. Token type is "refresh" (not access)
    3. user_id exists in payload

    Args:
        token: Refresh token string
    Returns:
        user_id (str) extracted from token payload
    Raises:
        HTTPException 401: If token is invalid, expired, or wrong type
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        # Ensure it's a refresh token — not an access token
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token type"
            )

        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )

        return user_id

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )


def verify_token(token: str = Depends(oauth2_scheme)) -> str:
    """
    Dependency function that verifies JWT access token on protected routes.

    FastAPI's Depends() injects this automatically on protected endpoints.
    If token is invalid or expired, raises 401 Unauthorized.

    Args:
        token: Bearer token extracted from Authorization header
    Returns:
        user_id (str) extracted from token payload
    Raises:
        HTTPException 401: If token is invalid, expired, or missing
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decode the JWT token using SECRET_KEY
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        # Ensure it's an access token — not a refresh token
        if payload.get("type") != "access":
            raise credentials_exception

        # Extract user_id from token payload
        # "sub" (subject) is a standard JWT claim for user identity
        user_id: str = payload.get("sub")

        if user_id is None:
            raise credentials_exception

        return user_id

    except JWTError:
        # Token is invalid, expired, or tampered with
        raise credentials_exception
