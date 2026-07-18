import uuid
from typing import Any
from sqlalchemy import String, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional
from app.models.base import Base


class AuditLog(Base):
    """Audit trail for trackable changes"""

    __tablename__ = "audit_logs"

    entity_name: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g. Interaction, HCP
    entity_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    action: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g. CREATE, UPDATE, DELETE

    previous_state: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON, nullable=True)
    new_state: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON, nullable=True)
