from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime, date
import datetime as dt
import uuid

class HCPMemoryBase(BaseModel):
    communication_style: Optional[str] = None
    clinical_interests: Optional[List[str]] = None
    preferred_products: Optional[List[str]] = None
    common_objections: Optional[List[str]] = None
    preferred_meeting_time: Optional[str] = None
    favorite_materials: Optional[List[str]] = None
    notes: Optional[str] = None

class HCPProfile(BaseModel):
    id: uuid.UUID
    name: str
    specialization: Optional[str] = None
    hospital: Optional[str] = None
    city: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class HCPOverview(BaseModel):
    interaction_count: int
    last_visit: Optional[date]
    next_follow_up: Optional[date]
    products_discussed: List[str]
    latest_summary: Optional[str]

class HCPTimelineInteraction(BaseModel):
    id: uuid.UUID
    date: Optional[dt.date] = None
    type: Optional[str] = None
    summary: Optional[str] = None
    products: Optional[str] = None
    sentiment: Optional[str] = None
    outcome: Optional[str] = None

class HCPInsights(BaseModel):
    relationship_summary: Optional[str] = None
    meeting_frequency: Optional[str] = None
    most_discussed_product: Optional[str] = None
    overall_sentiment: Optional[str] = None
    follow_up_pending: Optional[str] = None
    latest_ai_summary: Optional[str] = None

class HCPWorkspaceResponse(BaseModel):
    profile: HCPProfile
    overview: HCPOverview
    memory: HCPMemoryBase
    timeline: List[HCPTimelineInteraction]
    insights: HCPInsights
