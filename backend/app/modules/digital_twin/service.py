from sqlalchemy.ext.asyncio import AsyncSession
import uuid
import logging
from typing import Optional

from app.modules.digital_twin.builder import DigitalTwinBuilder
from app.modules.digital_twin.repository import DigitalTwinRepository
from app.modules.digital_twin.schemas import DigitalTwin
from app.core.events.dispatcher import dispatcher
from app.core.events.events import TwinUpdatedEvent

logger = logging.getLogger(__name__)

class DigitalTwinService:
    @staticmethod
    async def rebuild_twin(db: AsyncSession, hcp_id: uuid.UUID) -> DigitalTwin:
        twin = await DigitalTwinBuilder.build_twin(db, hcp_id)
        
        twin_json = twin.model_dump(mode="json")
        version = twin.metadata.twin_version
        
        await DigitalTwinRepository.save_twin_cache(db, hcp_id, version, twin_json)
        logger.info(f"Digital Twin cached for HCP {hcp_id}, version {version}")
        
        await dispatcher.publish(TwinUpdatedEvent(hcp_id=hcp_id, twin_version=version))
        return twin

    @staticmethod
    async def get_twin(db: AsyncSession, hcp_id: uuid.UUID) -> Optional[DigitalTwin]:
        cache = await DigitalTwinRepository.get_twin_cache(db, hcp_id)
        if cache:
            return DigitalTwin.model_validate(cache.twin_json)
        return None
