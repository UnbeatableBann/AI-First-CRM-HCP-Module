from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from datetime import datetime

from app.modules.mission_control.models import MissionControlCache

class MissionControlRepository:
    @staticmethod
    async def get_cache(db: AsyncSession) -> Optional[MissionControlCache]:
        result = await db.execute(select(MissionControlCache).where(MissionControlCache.id == "global"))
        return result.scalar_one_or_none()

    @staticmethod
    async def save_cache(
        db: AsyncSession, 
        feed_json: dict,
        expires_at: Optional[datetime] = None
    ) -> MissionControlCache:
        result = await db.execute(select(MissionControlCache).where(MissionControlCache.id == "global"))
        cache = result.scalar_one_or_none()
        
        if cache:
            cache.feed_json = feed_json
            cache.generated_at = datetime.utcnow()
            cache.expires_at = expires_at
        else:
            cache = MissionControlCache(
                id="global",
                feed_json=feed_json,
                expires_at=expires_at
            )
            db.add(cache)
            
        await db.commit()
        await db.refresh(cache)
        return cache
