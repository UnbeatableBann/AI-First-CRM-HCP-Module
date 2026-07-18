from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class HCPBase(BaseModel):
    name: str
    specialization: Optional[str] = None
    hospital_name: Optional[str] = None
    city: Optional[str] = None
    notes: Optional[str] = None


class HCPCreate(HCPBase):
    pass


class HCPUpdate(BaseModel):
    name: Optional[str] = None
    specialization: Optional[str] = None
    hospital_name: Optional[str] = None
    city: Optional[str] = None
    notes: Optional[str] = None


class HCPResponse(HCPBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
