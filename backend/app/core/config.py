from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./routesetu.db"
    SECRET_KEY: str = "development-only-change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    WEATHER_API_TIMEOUT_SECONDS: float = 5.0

    class Config:
        env_file = ".env"


settings = Settings()