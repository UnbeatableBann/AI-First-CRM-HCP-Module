import uuid
from datetime import datetime, date, time as datetime_time
from sqlalchemy import String, Text, DateTime, ForeignKey, Date, Time
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, TYPE_CHECKING, Optional
from app.models.base import Base

if TYPE_CHECKING:
    from app.domains.hcp.models import HCP


class Interaction(Base):
    __tablename__ = "interactions"

    hcp_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("hcps.id"), nullable=True
    )

    status: Mapped[str] = mapped_column(String(50), default="DRAFT")  # DRAFT, COMPLETED
    interaction_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    time: Mapped[Optional[datetime_time]] = mapped_column(Time, nullable=True)

    attendees: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    topics_discussed: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    materials_shared: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    samples_distributed: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    sentiment: Mapped[Optional[str]] = mapped_column(
        String(50), nullable=True
    )  # POSITIVE, NEUTRAL, NEGATIVE
    outcomes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    follow_up_actions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    hcp: Mapped[Optional["HCP"]] = relationship("HCP", back_populates="interactions")
    chat_messages: Mapped[List["ChatMessage"]] = relationship(
        "ChatMessage",
        back_populates="interaction",
        cascade="all, delete-orphan",
        order_by="ChatMessage.created_at",
    )


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    interaction_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("interactions.id"), nullable=False
    )
    role: Mapped[str] = mapped_column(String(50), nullable=False)  # USER, ASSISTANT
    content: Mapped[str] = mapped_column(Text, nullable=False)

    interaction: Mapped["Interaction"] = relationship("Interaction", back_populates="chat_messages")
