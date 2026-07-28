from typing import Dict, Any
import uuid
import logging
from app.modules.knowledge_pipeline.state import KnowledgePipelineState
from app.modules.knowledge_pipeline.extractors.memory_extractor import MemoryExtractor
from app.modules.knowledge.service import KnowledgeService
from app.modules.knowledge.schemas import KnowledgeFactCreate
from app.modules.knowledge.enums import FactCategory, FactSource
from app.database.session import async_session_factory

logger = logging.getLogger(__name__)

async def load_interaction(state: KnowledgePipelineState) -> dict:
    logger.info("Node: load_interaction")
    from sqlalchemy import select
    import uuid
    interaction_id = state.get("interaction_id")
    if not interaction_id:
        return {"interaction": {"content": ""}}
    async with async_session_factory() as db:
        from app.domains.interaction.models import Interaction
        result = await db.execute(select(Interaction).where(Interaction.id == uuid.UUID(interaction_id)))
        interaction = result.scalar_one_or_none()
        if interaction:
            content = f"Topics: {interaction.topics_discussed}\nOutcomes: {interaction.outcomes}\nNotes: {interaction.summary}"
            return {"interaction": {"content": content}}
    return {"interaction": {"content": ""}}

async def load_snapshot(state: KnowledgePipelineState) -> dict:
    logger.info("Node: load_snapshot")
    return {}

async def entity_extractor(state: KnowledgePipelineState) -> dict:
    logger.info("Node: entity_extractor (stub)")
    return {"entities": []}

async def topic_extractor(state: KnowledgePipelineState) -> dict:
    logger.info("Node: topic_extractor (stub)")
    return {"topics": []}

async def memory_extractor(state: KnowledgePipelineState) -> dict:
    logger.info("Node: memory_extractor")
    interaction_text = state["interaction"].get("content", "")
    if interaction_text:
        facts = await MemoryExtractor.extract(interaction_text, state.get("current_snapshot", {}))
        return {"memory_facts": facts}
    return {"memory_facts": []}

async def action_extractor(state: KnowledgePipelineState) -> dict:
    logger.info("Node: action_extractor (stub)")
    return {"followups": []}

async def validator(state: KnowledgePipelineState) -> dict:
    logger.info("Node: validator")
    valid_facts = []
    errors = []
    for fact in state.get("memory_facts", []):
        try:
            cat = FactCategory(fact["category"])
            valid_facts.append(fact)
        except ValueError:
            errors.append(f"Invalid category {fact['category']}")
    return {"memory_facts": valid_facts, "validation_errors": errors}

async def conflict_detector(state: KnowledgePipelineState) -> dict:
    logger.info("Node: conflict_detector")
    return {}

async def knowledge_merger(state: KnowledgePipelineState) -> dict:
    logger.info("Node: knowledge_merger")
    facts_to_create = []
    
    # Safely handle the possibility that interaction_id might not be set or not a UUID
    int_id_str = state.get("interaction_id")
    if int_id_str:
        try:
            interaction_id = uuid.UUID(int_id_str) if isinstance(int_id_str, str) else int_id_str
        except Exception:
            interaction_id = None
    else:
        interaction_id = None
    
    for f in state.get("memory_facts", []):
        facts_to_create.append(
            KnowledgeFactCreate(
                category=FactCategory(f["category"]),
                attribute=f["attribute"],
                value=f["value"],
                confidence=f["confidence"],
                evidence_interaction_id=interaction_id,
                source=FactSource.INTERACTION
            )
        )
        
    if facts_to_create:
        async with async_session_factory() as db:
            hcp_id = uuid.UUID(state["hcp_id"]) if isinstance(state["hcp_id"], str) else state["hcp_id"]
            await KnowledgeService.merge_facts(db, hcp_id, facts_to_create)
            
    return {}

async def snapshot_builder(state: KnowledgePipelineState) -> dict:
    logger.info("Node: snapshot_builder")
    async with async_session_factory() as db:
        hcp_id = uuid.UUID(state["hcp_id"]) if isinstance(state["hcp_id"], str) else state["hcp_id"]
        await KnowledgeService.generate_snapshot(db, hcp_id)
    return {}

async def publish_event(state: KnowledgePipelineState) -> dict:
    logger.info("Node: publish_event")
    return {}
