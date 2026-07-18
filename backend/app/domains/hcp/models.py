from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, TYPE_CHECKING, Optional
from app.models.base import Base

if TYPE_CHECKING:
    from app.domains.interaction.models import Interaction


class HCP(Base):
    """Healthcare Professional Model"""

    __tablename__ = "hcps"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    specialization: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    hospital_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    interactions: Mapped[List["Interaction"]] = relationship("Interaction", back_populates="hcp")
