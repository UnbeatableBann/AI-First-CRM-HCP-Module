import uuid
import logging
import asyncio
import json
from app.modules.knowledge_pipeline.pipeline import knowledge_pipeline
from app.domains.hcp_workspace.service import HCPWorkspaceService
from app.database.session import async_session_factory

logger = logging.getLogger(__name__)

async def run_pipeline_and_memory_update(initial_state: dict, hcp_id: uuid.UUID, content: str):
    try:
        # Run standard knowledge pipeline
        await knowledge_pipeline.ainvoke(initial_state)
    except Exception as e:
        logger.error(f"Knowledge Pipeline failed: {e}")
        
    try:
        # Parse content as interaction data
        interaction_data = json.loads(content) if content else {}
        async with async_session_factory() as db:
            await HCPWorkspaceService.update_hcp_memory_tool(db, hcp_id, interaction_data)
            await db.commit()
    except Exception as e:
        logger.error(f"HCP Memory Update failed: {e}")

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
        
        asyncio.create_task(run_pipeline_and_memory_update(initial_state, hcp_id, content))
        logger.info(f"Knowledge Pipeline started in background for Interaction {interaction_id}")
