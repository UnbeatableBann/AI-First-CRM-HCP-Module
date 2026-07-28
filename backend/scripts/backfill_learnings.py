import asyncio
import json
import uuid
import sys
import os

# Ensure backend path is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database.session import async_session_factory
from sqlalchemy import select
from app.domains.interaction.models import Interaction
from app.domains.hcp_workspace.service import HCPWorkspaceService
from app.modules.knowledge_pipeline.services.pipeline_service import run_pipeline_and_memory_update

async def backfill():
    async with async_session_factory() as db:
        stmt = select(Interaction).where(Interaction.status == "COMPLETED")
        result = await db.execute(stmt)
        interactions = result.scalars().all()
        
        print(f"Found {len(interactions)} completed interactions to process.")
        
        for interaction in interactions:
            print(f"Processing interaction {interaction.id} for HCP {interaction.hcp_id}")
            
            # create interaction_data dump
            interaction_data = {
                "id": str(interaction.id),
                "hcp_id": str(interaction.hcp_id),
                "interaction_type": interaction.interaction_type,
                "date": interaction.date.isoformat() if interaction.date else None,
                "topics_discussed": interaction.topics_discussed,
                "sentiment": interaction.sentiment,
                "outcomes": interaction.outcomes,
                "follow_up_actions": interaction.follow_up_actions
            }
            content = json.dumps(interaction_data)
            
            initial_state = {
                "interaction_id": str(interaction.id),
                "hcp_id": str(interaction.hcp_id),
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
            
            await run_pipeline_and_memory_update(initial_state, interaction.hcp_id, content)
            print("Done with interaction")
            
if __name__ == "__main__":
    asyncio.run(backfill())
