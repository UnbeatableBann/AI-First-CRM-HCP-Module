from sqlalchemy import Column, String, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.models.base import Base

class HCPMemory(Base):
    __tablename__ = "hcp_memory"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    hcp_id = Column(UUID(as_uuid=True), ForeignKey("hcps.id", ondelete="CASCADE"), unique=True, nullable=False)
    communication_style = Column(String, nullable=True)
    clinical_interests = Column(JSON, nullable=True)
    preferred_products = Column(JSON, nullable=True)
    common_objections = Column(JSON, nullable=True)
    preferred_meeting_time = Column(String, nullable=True)
    favorite_materials = Column(JSON, nullable=True)
    notes = Column(String, nullable=True)
