from sqlalchemy.ext.asyncio import AsyncSession
import logging

from app.modules.mission_control.repository import MissionControlRepository
from app.modules.mission_control.schemas import MissionControlResponse
from app.modules.mission_control.engine import mission_engine

logger = logging.getLogger(__name__)

class MissionControlService:
    @staticmethod
    async def get_or_generate_feed(db: AsyncSession, force_refresh: bool = False) -> MissionControlResponse:
        if not force_refresh:
            cache = await MissionControlRepository.get_cache(db)
            if cache and cache.feed_json:
                from datetime import datetime, timezone
                if not cache.expires_at or cache.expires_at > datetime.now(timezone.utc):
                    logger.info("Returning cached Mission Control Feed")
                    return MissionControlResponse.model_validate(cache.feed_json)
        
        logger.info("Generating new Mission Control Feed")
        initial_state = {
            "hcps": [],
            "digital_twins": {},
            "meeting_briefs": {},
            "commitments": [],
            "trends": {},
            "risks": [],
            "opportunities": [],
            "priorities": [],
            "recommendations": [],
            "feed": [],
            "wins": [],
            "learnings": [],
            "summary": {}
        }
        
        result = await mission_engine.ainvoke(initial_state)
        feed_data = {
            "summary": result.get("summary", {}),
            "priority_queue": result.get("priorities", []),
            "feed": result.get("feed", []),
            "wins": result.get("wins", []),
            "learnings": result.get("learnings", [])
        }
        return MissionControlResponse.model_validate(feed_data)
    
    @staticmethod
    async def rebuild_feed_background(db: AsyncSession):
        logger.info("Rebuilding Mission Control Feed in background")
        await MissionControlService.get_or_generate_feed(db, force_refresh=True)
