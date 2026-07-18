from app.database import registry  # noqa: F401
from fastapi import FastAPI
from typing import Any
from scalar_fastapi import get_scalar_api_reference
from fastapi.exceptions import RequestValidationError

from app.middleware.setup import setup_middlewares
from app.api.router import api_router
from app.exceptions.base import AppException
from app.exceptions.handlers import (
    app_exception_handler,
    validation_exception_handler,
    global_exception_handler,
)

from app.core.logger import setup_logging

setup_logging()

app = FastAPI(
    title="AI-First Healthcare CRM API",
    description="Backend for the AI-First CRM focusing on HCPs.",
    version="0.1.0",
)

# Setup Middlewares
setup_middlewares(app)

# Exception Handlers
app.add_exception_handler(AppException, app_exception_handler)  # type: ignore
app.add_exception_handler(RequestValidationError, validation_exception_handler)  # type: ignore
app.add_exception_handler(Exception, global_exception_handler)

# Routers
app.include_router(api_router)


@app.get("/scalar", include_in_schema=False)
async def scalar_reference() -> Any:
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title=app.title,
    )
