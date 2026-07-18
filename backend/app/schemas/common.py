from pydantic import BaseModel
from typing import List, Optional, Generic, TypeVar

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    status: str
    message: str
    data: Optional[T] = None
    warnings: List[str] = []
    errors: List[str] = []
