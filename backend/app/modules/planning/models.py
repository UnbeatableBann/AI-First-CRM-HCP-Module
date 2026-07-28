from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func

from app.models.base import Base

class MeetingBriefCache(Base):
    __tablename__ = "meeting_brief_cache"

    hcp_id = Column(UUID(as_uuid=True), primary_key=True)
    digital_twin_version = Column(String, nullable=False)
    brief_json = Column(JSONB, nullable=False)
    generated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=True)
