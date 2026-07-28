import logging

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
from app.modules.knowledge_pipeline.subscribers import register_subscribers as register_knowledge_subscribers
from app.modules.digital_twin.subscribers import register_subscribers as register_twin_subscribers
from app.modules.mission_control.subscribers import register_subscribers as register_mission_subscribers

setup_logging()
logger = logging.getLogger(__name__)
register_knowledge_subscribers()
register_twin_subscribers()
register_mission_subscribers()

app = FastAPI(
    title="AI-First Healthcare CRM API",
    description="Backend for the AI-First CRM focusing on HCPs.",
    version="0.1.0",
    docs_url=None,
    redoc_url=None,
)

# Setup Middlewares
setup_middlewares(app)

# Exception Handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Routers
app.include_router(api_router)


@app.get("/scalar", include_in_schema=False)
async def scalar_reference() -> Any:
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title=app.title,
    )
