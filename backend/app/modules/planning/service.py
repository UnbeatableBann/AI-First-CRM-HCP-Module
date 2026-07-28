from sqlalchemy.ext.asyncio import AsyncSession
import uuid
import logging

from app.modules.planning.repository import PlanningRepository
from app.modules.planning.schemas import MeetingBrief
from app.modules.planning.planner import planning_pipeline
from app.modules.digital_twin.service import DigitalTwinService

logger = logging.getLogger(__name__)

class PlanningService:
    @staticmethod
    async def get_or_generate_brief(db: AsyncSession, hcp_id: uuid.UUID, force_refresh: bool = False) -> MeetingBrief:
        if not force_refresh:
            cache = await PlanningRepository.get_brief_cache(db, hcp_id)
            if cache and cache.brief_json:
                from datetime import datetime, timezone
                if not cache.expires_at or cache.expires_at > datetime.now(timezone.utc):
                    twin = await DigitalTwinService.get_twin(db, hcp_id)
                    if twin and twin.metadata.twin_version == cache.digital_twin_version:
                        logger.info(f"Returning cached Meeting Brief for HCP {hcp_id}")
                        return MeetingBrief.model_validate(cache.brief_json)
        
        logger.info(f"Generating new Meeting Brief for HCP {hcp_id}")
        initial_state = {
            "hcp_id": str(hcp_id),
            "digital_twin": {},
            "recent_interactions": [],
            "knowledge": [],
            "commitments": [],
            "meeting_context": "",
            "objectives": {},
            "conversation_strategy": {},
            "literature": {},
            "risks": {},
            "brief": {},
            "metadata": {}
        }
        
        result = await planning_pipeline.ainvoke(initial_state)
        brief_data = result.get("brief", {})
        return MeetingBrief.model_validate(brief_data)
