from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from typing import Any
from app.domains.audit.models import AuditLog
from app.repositories.base import BaseRepository

audit_repo: Any = BaseRepository(AuditLog)


class AuditService:
    @staticmethod
    async def log_action(
        db: AsyncSession,
        entity_name: str,
        entity_id: uuid.UUID,
        action: str,
        previous_state: dict[str, Any] | None = None,
        new_state: dict[str, Any] | None = None,
    ) -> AuditLog:
        return await audit_repo.create( # type: ignore
            db=db,
            obj_in={
                "entity_name": entity_name,
                "entity_id": entity_id,
                "action": action,
                "previous_state": previous_state,
                "new_state": new_state,
            },
        )
