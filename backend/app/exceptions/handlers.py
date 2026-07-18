from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.exceptions.base import AppException
import logging

logger = logging.getLogger(__name__)


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    logger.warning(f"AppException: {exc.message} - Errors: {exc.errors}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "message": exc.message,
            "data": None,
            "warnings": [],
            "errors": exc.errors,
        },
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    errors = [f"{err['loc'][-1]}: {err['msg']}" for err in exc.errors()]
    logger.warning(f"Validation Error: {errors}")
    return JSONResponse(
        status_code=422,
        content={
            "status": "error",
            "message": "Input validation failed",
            "data": None,
            "warnings": [],
            "errors": errors,
        },
    )


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "An unexpected internal server error occurred.",
            "data": None,
            "warnings": [],
            "errors": [],
        },
    )
