from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings


def setup_middlewares(app: FastAPI) -> None:
    """Configure all application middlewares."""
    origins = [url.strip() for url in settings.FRONTEND_URL.split(",") if url.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
