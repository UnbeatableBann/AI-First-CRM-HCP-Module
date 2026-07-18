from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime, date, time


import datetime as dt

class InteractionBase(BaseModel):
    hcp_id: Optional[UUID] = None
    status: str = "DRAFT"
    interaction_type: Optional[str] = None
    date: Optional[dt.date] = None
    time: Optional[dt.time] = None
    attendees: Optional[str] = None
    topics_discussed: Optional[str] = None
    materials_shared: Optional[str] = None
    samples_distributed: Optional[str] = None
    sentiment: Optional[str] = None
    outcomes: Optional[str] = None
    follow_up_actions: Optional[str] = None
    summary: Optional[str] = None


class InteractionCreate(InteractionBase):
    pass


class InteractionUpdate(BaseModel):
    hcp_id: Optional[UUID] = None
    status: Optional[str] = None
    interaction_type: Optional[str] = None
    date: Optional[dt.date] = None
    time: Optional[dt.time] = None
    attendees: Optional[str] = None
    topics_discussed: Optional[str] = None
    materials_shared: Optional[str] = None
    samples_distributed: Optional[str] = None
    sentiment: Optional[str] = None
    outcomes: Optional[str] = None
    follow_up_actions: Optional[str] = None
    summary: Optional[str] = None


class InteractionResponse(InteractionBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ChatMessageBase(BaseModel):
    role: str
    content: str


class ChatMessageCreate(ChatMessageBase):
    pass


class ChatMessageResponse(ChatMessageBase):
    id: UUID
    interaction_id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}


class DraftResponse(BaseModel):
    id: UUID
    hcp_name: Optional[str] = None
    updated_at: datetime
    status: str

    model_config = {"from_attributes": True}


class SavedHCPResponse(BaseModel):
    hcp_id: UUID
    hcp_name: str
    interaction_count: int
    latest_interaction: Optional[dt.date] = None

    model_config = {"from_attributes": True}


class InteractionHomeResponse(BaseModel):
    drafts: list[DraftResponse]
    saved_hcps: list[SavedHCPResponse]
