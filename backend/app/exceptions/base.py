from typing import Optional


class AppException(Exception):
    """Base exception for application errors."""

    def __init__(self, message: str, status_code: int = 400, errors: Optional[list[str]] = None):
        self.message = message
        self.status_code = status_code
        self.errors = errors or []
        super().__init__(self.message)


class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message=message, status_code=404)


class ValidationException(AppException):
    def __init__(self, message: str = "Validation failed", errors: Optional[list[str]] = None):
        super().__init__(message=message, status_code=422, errors=errors)


class LLMServiceException(AppException):
    def __init__(self, message: str = "LLM Service failed"):
        super().__init__(message=message, status_code=502)
