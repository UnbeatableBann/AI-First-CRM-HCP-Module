from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func

from app.models.base import Base

class MissionControlCache(Base):
    __tablename__ = "mission_control_cache"
    id = Column(String, primary_key=True, default="global")
    feed_json = Column(JSONB, nullable=False)
    generated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=True)
