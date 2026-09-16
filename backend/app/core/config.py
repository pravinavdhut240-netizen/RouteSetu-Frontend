from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings


BACKEND_DIR = Path(__file__).resolve().parents[2]
REQUIRED_CORS_ORIGINS = (
    "https://routesetu-frontend.onrender.com",
    "http://localhost:5173",
    "http://localhost:8000",
)


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./routesetu.db"
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"
    SECRET_KEY: str = "development-only-change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    WEATHER_API_TIMEOUT_SECONDS: float = 5.0

    @field_validator("DATABASE_URL")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+psycopg2://", 1)
        return value

    @field_validator("CORS_ORIGINS")
    @classmethod
    def normalize_cors_origins(cls, value: str) -> str:
        configured_origins = [origin.strip() for origin in value.split(",") if origin.strip()]
        return ",".join(dict.fromkeys((*configured_origins, *REQUIRED_CORS_ORIGINS)))

    class Config:
        env_file = BACKEND_DIR / ".env"


settings = Settings()