from app.core.events.dispatcher import dispatcher
from app.core.events.events import InteractionSavedEvent
from app.modules.knowledge_pipeline.services.pipeline_service import PipelineService
import logging
import asyncio

logger = logging.getLogger(__name__)

async def on_interaction_saved(event: InteractionSavedEvent):
    logger.info(f"Received InteractionSavedEvent for Interaction {event.interaction_id}")
    await PipelineService.trigger_pipeline(
        interaction_id=event.interaction_id,
        hcp_id=event.hcp_id,
        content=event.content
    )

def register_subscribers():
    dispatcher.subscribe(InteractionSavedEvent, on_interaction_saved)
    logger.info("Knowledge Pipeline subscribers registered")
