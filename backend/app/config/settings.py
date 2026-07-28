from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, model_validator
from typing import Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True
    )

    # Project setup
    PROJECT_NAME: str = "AI-First CRM Backend"
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = Field(default="development")
    HEALTH_CHECK_RETRIES: int = Field(default=3)
    FRONTEND_URL: str = Field(default="http://localhost:5173")

    # Database
    DATABASE_URL: Optional[str] = Field(default=None)
    POSTGRES_USER: Optional[str] = Field(default=None)
    POSTGRES_PASSWORD: Optional[str] = Field(default=None)
    POSTGRES_DB: Optional[str] = Field(default=None)
    POSTGRES_SERVER: Optional[str] = Field(default=None)
    POSTGRES_PORT: Optional[int] = Field(default=None)

    @model_validator(mode='after')
    def assemble_env_vars(self) -> 'Settings':
        # Database URL
        if not self.DATABASE_URL:
            user = self.POSTGRES_USER or "postgres"
            password = self.POSTGRES_PASSWORD or "postgres"
            server = self.POSTGRES_SERVER or "localhost"
            port = self.POSTGRES_PORT or 5432
            db = self.POSTGRES_DB or "crm_db"
            self.DATABASE_URL = f"postgresql+asyncpg://{user}:{password}@{server}:{port}/{db}"
            
        # Select the correct Redis URL based on the environment
        if self.ENVIRONMENT == "production":
            self.REDIS_URL = self.REDIS_URL_PROD
        else:
            self.REDIS_URL = self.REDIS_URL_DEV
            
        # Strict validation for Production vs Development
        if self.ENVIRONMENT == "production":
            # Forbid localhost in production
            if "localhost" in self.FRONTEND_URL or "127.0.0.1" in self.FRONTEND_URL:
                self.FRONTEND_URL = "https://dev.ai-first-crm-hcp-module.pages.dev,https://curis.shadabjamadar.me"
            
            if "localhost" in self.REDIS_URL or "127.0.0.1" in self.REDIS_URL:
                raise ValueError(
                    "Localhost Redis is forbidden in production! "
                    "Please configure a valid Upstash (or external) REDIS_URL_PROD in your environment."
                )
        elif self.ENVIRONMENT == "development":
            # In development, keep whatever is provided (localhost with any port, or production URLs)
            if not self.FRONTEND_URL:
                self.FRONTEND_URL = "http://localhost:5173"
                
        return self

    # Redis configuration
    REDIS_URL_DEV: str = Field(default="redis://localhost:6379/0")
    REDIS_URL_PROD: str = Field(default="rediss://default:password@endpoint.upstash.io:6379/0")
    REDIS_URL: str = Field(default="") # Dynamically populated based on environment

    # Groq API
    GROQ_API_KEY: str = Field(default="")
    LLM_MODEL: str = Field(default="llama-3.3-70b-versatile")
    LLM_FALLBACK_MODEL: str = Field(default="llama3-8b-8192")

    # Security
    SECRET_KEY: str = Field(default="super-secret-key")
    ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)


settings = Settings()
