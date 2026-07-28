from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
import uuid

from app.models.base import Base
from app.modules.knowledge.enums import FactCategory, FactStatus, FactSource

class KnowledgeFact(Base):
    __tablename__ = "knowledge_facts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hcp_id = Column(UUID(as_uuid=True), nullable=False)
    category = Column(SQLEnum(FactCategory), nullable=False)
    attribute = Column(String, nullable=False)
    value = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    evidence_interaction_id = Column(UUID(as_uuid=True), nullable=True)
    source = Column(SQLEnum(FactSource), nullable=False, default=FactSource.INTERACTION)
    status = Column(SQLEnum(FactStatus), nullable=False, default=FactStatus.ACTIVE)
    first_seen = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_confirmed = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class KnowledgeRelation(Base):
    __tablename__ = "knowledge_relations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hcp_id = Column(UUID(as_uuid=True), nullable=False)
    from_fact = Column(UUID(as_uuid=True), ForeignKey("knowledge_facts.id"), nullable=False)
    to_fact = Column(UUID(as_uuid=True), ForeignKey("knowledge_facts.id"), nullable=False)
    relationship_type = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class KnowledgeSnapshot(Base):
    __tablename__ = "knowledge_snapshots"

    hcp_id = Column(UUID(as_uuid=True), primary_key=True)
    snapshot_json = Column(JSONB, nullable=False)
    version = Column(String, nullable=False)
    generated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
