from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
import uuid

from app.models.base import Base

class DigitalTwinCache(Base):
    __tablename__ = "digital_twin_cache"

    hcp_id = Column(UUID(as_uuid=True), primary_key=True)
    version = Column(String, nullable=False)
    twin_json = Column(JSONB, nullable=False)
    generated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
