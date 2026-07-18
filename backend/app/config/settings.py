from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True
    )

    # Project setup
    PROJECT_NAME: str = "AI-First CRM Backend"
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = Field(default="development")
    HEALTH_CHECK_RETRIES: int = Field(default=3)

    # Database
    POSTGRES_USER: str = Field(default="postgres")
    POSTGRES_PASSWORD: str = Field(default="postgres")
    POSTGRES_DB: str = Field(default="crm_db")
    POSTGRES_SERVER: str = Field(default="localhost")
    POSTGRES_PORT: int = Field(default=5432)
    DATABASE_URL: str = Field(default="")

    # Redis
    REDIS_URL: str = Field(default="redis://localhost:6379/0")

    # Groq API
    GROQ_API_KEY: str = Field(default="")
    LLM_MODEL: str = Field(default="llama-3.3-70b-versatile")
    LLM_FALLBACK_MODEL: str = Field(default="llama3-8b-8192")

    # Security
    SECRET_KEY: str = Field(default="super-secret-key")
    ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)


settings = Settings()
