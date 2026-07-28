from app.core.events.dispatcher import dispatcher
from app.core.events.events import KnowledgeUpdatedEvent
from app.modules.digital_twin.service import DigitalTwinService
from app.database.session import async_session_factory
import logging

logger = logging.getLogger(__name__)

async def on_knowledge_updated(event: KnowledgeUpdatedEvent):
    logger.info(f"Received KnowledgeUpdatedEvent for HCP {event.hcp_id}. Rebuilding Digital Twin.")
    async with async_session_factory() as db:
        await DigitalTwinService.rebuild_twin(db, event.hcp_id)

def register_subscribers():
    dispatcher.subscribe(KnowledgeUpdatedEvent, on_knowledge_updated)
    logger.info("Digital Twin subscribers registered")
