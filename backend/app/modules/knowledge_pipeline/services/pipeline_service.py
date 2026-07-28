import uuid
import logging
import asyncio
from app.modules.knowledge_pipeline.pipeline import knowledge_pipeline

logger = logging.getLogger(__name__)

class PipelineService:
    @staticmethod
    async def trigger_pipeline(interaction_id: uuid.UUID, hcp_id: uuid.UUID, content: str):
        logger.info(f"Triggering Knowledge Pipeline for Interaction {interaction_id}")
        initial_state = {
            "interaction_id": str(interaction_id),
            "hcp_id": str(hcp_id),
            "interaction": {"content": content},
            "hcp": {},
            "current_snapshot": {},
            "existing_facts": [],
            "entities": [],
            "topics": [],
            "memory_facts": [],
            "followups": [],
            "validation_errors": [],
            "conflicts": [],
            "merged_facts": [],
            "snapshot": {},
            "metadata": {}
        }
        
        # Fire and forget or await, typically run in background
        asyncio.create_task(knowledge_pipeline.ainvoke(initial_state))
        logger.info(f"Knowledge Pipeline started in background for Interaction {interaction_id}")
