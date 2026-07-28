from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid
from app.modules.knowledge.enums import FactCategory, FactStatus, FactSource

class KnowledgeFactBase(BaseModel):
    category: FactCategory
    attribute: str
    value: str
    confidence: float
    evidence_interaction_id: Optional[uuid.UUID] = None
    source: FactSource = FactSource.INTERACTION

class KnowledgeFactCreate(KnowledgeFactBase):
    pass

class KnowledgeFactResponse(KnowledgeFactBase):
    id: uuid.UUID
    hcp_id: uuid.UUID
    status: FactStatus
    first_seen: datetime
    last_confirmed: datetime
    updated_at: datetime
    created_at: datetime

    model_config = {'from_attributes': True}

class KnowledgeRelationBase(BaseModel):
    from_fact: uuid.UUID
    to_fact: uuid.UUID
    relationship_type: str
    confidence: float

class KnowledgeRelationResponse(KnowledgeRelationBase):
    id: uuid.UUID
    hcp_id: uuid.UUID
    created_at: datetime

    model_config = {'from_attributes': True}

class KnowledgeSnapshotResponse(BaseModel):
    hcp_id: uuid.UUID
    snapshot_json: Dict[str, Any]
    version: str
    generated_at: datetime

    model_config = {'from_attributes': True}

class HCPKnowledgeResponse(BaseModel):
    snapshot: Optional[KnowledgeSnapshotResponse]
    facts: List[KnowledgeFactResponse]
    relations: List[KnowledgeRelationResponse]
