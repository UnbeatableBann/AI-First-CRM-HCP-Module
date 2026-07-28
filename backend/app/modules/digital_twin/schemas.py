from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class TwinIdentity(BaseModel):
    name: str = ""
    specialization: str = ""
    hospital: str = ""
    city: str = ""
    hcp_type: str = ""
    territory: str = ""
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class TwinCommunication(BaseModel):
    preferred_channel: str = ""
    preferred_time: str = ""
    meeting_style: str = ""
    communication_style: str = ""
    preferred_material: str = ""
    language: str = ""

class TwinClinicalProfile(BaseModel):
    clinical_interests: List[str] = Field(default_factory=list)
    disease_focus: List[str] = Field(default_factory=list)
    recent_topics: List[str] = Field(default_factory=list)
    publications_discussed: List[str] = Field(default_factory=list)
    conference_mentions: List[str] = Field(default_factory=list)
    evidence_preference: str = ""

class TwinCommercialProfile(BaseModel):
    products_discussed: List[str] = Field(default_factory=list)
    competitors: List[str] = Field(default_factory=list)
    sample_requests: List[str] = Field(default_factory=list)
    product_interest: List[str] = Field(default_factory=list)
    therapy_areas: List[str] = Field(default_factory=list)

class TwinBehavior(BaseModel):
    decision_style: str = ""
    common_objections: List[str] = Field(default_factory=list)
    question_frequency: str = ""
    engagement_style: str = ""
    scientific_depth: str = ""

class TwinRelationship(BaseModel):
    first_meeting: Optional[datetime] = None
    last_meeting: Optional[datetime] = None
    interaction_count: int = 0
    relationship_trend: List[str] = Field(default_factory=list)
    trust_signals: List[str] = Field(default_factory=list)
    positive_signals: List[str] = Field(default_factory=list)
    negative_signals: List[str] = Field(default_factory=list)

class TwinCommitments(BaseModel):
    pending_actions: List[str] = Field(default_factory=list)
    literature_requests: List[str] = Field(default_factory=list)
    followups: List[str] = Field(default_factory=list)
    promises: List[str] = Field(default_factory=list)

class TwinTimeline(BaseModel):
    recent_events: List[str] = Field(default_factory=list)
    major_milestones: List[str] = Field(default_factory=list)
    relationship_changes: List[str] = Field(default_factory=list)
    important_topics: List[str] = Field(default_factory=list)

class TwinMetadata(BaseModel):
    twin_version: str
    generated_at: datetime
    knowledge_version: str
    last_updated: datetime

class TwinPredictions(BaseModel):
    pass # Placeholder for future prediction layer

class DigitalTwin(BaseModel):
    hcp_id: uuid.UUID
    identity: TwinIdentity = Field(default_factory=TwinIdentity)
    communication: TwinCommunication = Field(default_factory=TwinCommunication)
    clinical_profile: TwinClinicalProfile = Field(default_factory=TwinClinicalProfile)
    commercial_profile: TwinCommercialProfile = Field(default_factory=TwinCommercialProfile)
    behavior: TwinBehavior = Field(default_factory=TwinBehavior)
    relationship: TwinRelationship = Field(default_factory=TwinRelationship)
    commitments: TwinCommitments = Field(default_factory=TwinCommitments)
    timeline: TwinTimeline = Field(default_factory=TwinTimeline)
    metadata: TwinMetadata
    predictions: TwinPredictions = Field(default_factory=TwinPredictions)
