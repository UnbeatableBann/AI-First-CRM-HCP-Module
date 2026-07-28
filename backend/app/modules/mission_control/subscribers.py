from app.core.events.dispatcher import dispatcher
from app.core.events.events import TwinUpdatedEvent, KnowledgeUpdatedEvent
from app.modules.mission_control.service import MissionControlService
from app.database.session import async_session_factory
import logging
import asyncio

logger = logging.getLogger(__name__)

async def on_mission_trigger(event):
    logger.info(f"Triggering Mission Control rebuild due to event: {type(event).__name__}")
    asyncio.create_task(_rebuild_in_background())

async def _rebuild_in_background():
    async with async_session_factory() as db:
        await MissionControlService.rebuild_feed_background(db)

def register_subscribers():
    dispatcher.subscribe(TwinUpdatedEvent, on_mission_trigger)
    dispatcher.subscribe(KnowledgeUpdatedEvent, on_mission_trigger)
    logger.info("Mission Control subscribers registered")
