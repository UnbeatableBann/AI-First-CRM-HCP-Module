from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid

class MissionItem(BaseModel):
    hcp_id: uuid.UUID
    hcp_name: str
    type: str = Field(description="Opportunity, Risk, Task, Learning, Win")
    priority: str = Field(description="Critical, High, Medium, Low")
    title: str
    reason: str
    action: str
    confidence: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class MissionSummary(BaseModel):
    greeting: str
    daily_mission: str

class MissionControlResponse(BaseModel):
    summary: MissionSummary
    mission: Dict[str, Any] = Field(default_factory=dict)
    priority_queue: List[MissionItem] = Field(default_factory=list)
    feed: List[MissionItem] = Field(default_factory=list)
    wins: List[MissionItem] = Field(default_factory=list)
    learnings: List[MissionItem] = Field(default_factory=list)
