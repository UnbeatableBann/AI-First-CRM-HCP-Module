from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import uuid
from datetime import datetime

from app.modules.digital_twin.models import DigitalTwinCache

class DigitalTwinRepository:
    @staticmethod
    async def get_twin_cache(db: AsyncSession, hcp_id: uuid.UUID) -> Optional[DigitalTwinCache]:
        result = await db.execute(select(DigitalTwinCache).where(DigitalTwinCache.hcp_id == hcp_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def save_twin_cache(db: AsyncSession, hcp_id: uuid.UUID, version: str, twin_json: dict) -> DigitalTwinCache:
        result = await db.execute(select(DigitalTwinCache).where(DigitalTwinCache.hcp_id == hcp_id))
        cache = result.scalar_one_or_none()
        
        if cache:
            cache.version = version
            cache.twin_json = twin_json
            cache.generated_at = datetime.utcnow()
        else:
            cache = DigitalTwinCache(
                hcp_id=hcp_id,
                version=version,
                twin_json=twin_json
            )
            db.add(cache)
            
        await db.commit()
        await db.refresh(cache)
        return cache
