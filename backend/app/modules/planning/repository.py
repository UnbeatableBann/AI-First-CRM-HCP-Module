from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import uuid
from datetime import datetime

from app.modules.planning.models import MeetingBriefCache

class PlanningRepository:
    @staticmethod
    async def get_brief_cache(db: AsyncSession, hcp_id: uuid.UUID) -> Optional[MeetingBriefCache]:
        result = await db.execute(select(MeetingBriefCache).where(MeetingBriefCache.hcp_id == hcp_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def save_brief_cache(
        db: AsyncSession, 
        hcp_id: uuid.UUID, 
        digital_twin_version: str, 
        brief_json: dict,
        expires_at: Optional[datetime] = None
    ) -> MeetingBriefCache:
        result = await db.execute(select(MeetingBriefCache).where(MeetingBriefCache.hcp_id == hcp_id))
        cache = result.scalar_one_or_none()
        
        if cache:
            cache.digital_twin_version = digital_twin_version
            cache.brief_json = brief_json
            cache.generated_at = datetime.utcnow()
            cache.expires_at = expires_at
        else:
            cache = MeetingBriefCache(
                hcp_id=hcp_id,
                digital_twin_version=digital_twin_version,
                brief_json=brief_json,
                expires_at=expires_at
            )
            db.add(cache)
            
        await db.commit()
        await db.refresh(cache)
        return cache
