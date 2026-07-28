import uuid
import logging
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from app.modules.knowledge.repository import KnowledgeRepository
from app.modules.knowledge.schemas import KnowledgeFactCreate
from app.modules.knowledge.knowledge_settings import knowledge_settings
from app.core.events.dispatcher import dispatcher
from app.core.events.events import KnowledgeUpdatedEvent, SnapshotGeneratedEvent

logger = logging.getLogger(__name__)

class KnowledgeService:
    @staticmethod
    async def merge_facts(db: AsyncSession, hcp_id: uuid.UUID, new_facts: List[KnowledgeFactCreate]) -> int:
        """
        Merges new facts into the knowledge base.
        """
        existing_facts = await KnowledgeRepository.get_all_facts(db, hcp_id, active_only=True)
        facts_added = 0
        
        for new_fact in new_facts:
            multi_value_attrs = ["products", "clinical_interest", "competitor_preference"]
            conflict = None
            
            for ex_fact in existing_facts:
                if ex_fact.category == new_fact.category and ex_fact.attribute == new_fact.attribute:
                    if new_fact.attribute not in multi_value_attrs:
                        conflict = ex_fact
                    elif ex_fact.value == new_fact.value:
                        conflict = ex_fact
                    
            if conflict:
                if conflict.value == new_fact.value:
                    await KnowledgeRepository.update_fact(db, conflict.id, {"last_confirmed": datetime.utcnow()})
                    logger.info(f"Fact Updated: {conflict.id}")
                else:
                    if new_fact.attribute not in multi_value_attrs:
                        await KnowledgeRepository.archive_fact(db, conflict.id)
                        logger.info(f"Fact Archived: {conflict.id}")
                        fact = await KnowledgeRepository.create_fact(db, hcp_id, new_fact)
                        logger.info(f"Fact Created: {fact.id}")
                        facts_added += 1
                    else:
                        fact = await KnowledgeRepository.create_fact(db, hcp_id, new_fact)
                        logger.info(f"Fact Created: {fact.id}")
                        facts_added += 1
            else:
                fact = await KnowledgeRepository.create_fact(db, hcp_id, new_fact)
                logger.info(f"Fact Created: {fact.id}")
                facts_added += 1
                
        if facts_added > 0:
            await dispatcher.publish(KnowledgeUpdatedEvent(hcp_id=hcp_id, new_facts_count=facts_added))
            
        return facts_added

    @staticmethod
    async def generate_snapshot(db: AsyncSession, hcp_id: uuid.UUID) -> None:
        """
        Reads all active facts and compiles them into a JSONB snapshot document.
        """
        facts = await KnowledgeRepository.get_all_facts(db, hcp_id, active_only=True)
        
        snapshot: Dict[str, Any] = {
            "identity": {},
            "communication": {},
            "clinical_interests": [],
            "commercial_interests": [],
            "behavior": {},
            "relationship_notes": [],
            "open_commitments": [],
            "recent_topics": [],
            "products": [],
            "competitors": []
        }
        
        for fact in facts:
            cat = fact.category.value.lower()
            if fact.attribute in ["products", "clinical_interest", "competitor_preference", "recent_topic", "open_commitment", "relationship_note"]:
                list_key = fact.attribute
                if list_key == "clinical_interest": list_key = "clinical_interests"
                if list_key == "competitor_preference": list_key = "competitors"
                if list_key == "recent_topic": list_key = "recent_topics"
                if list_key == "open_commitment": list_key = "open_commitments"
                if list_key == "relationship_note": list_key = "relationship_notes"
                
                if list_key in snapshot:
                    snapshot[list_key].append(fact.value)
            else:
                if cat in snapshot and isinstance(snapshot[cat], dict):
                    snapshot[cat][fact.attribute] = fact.value
                elif cat == "preference":
                    snapshot["behavior"][fact.attribute] = fact.value
        
        await KnowledgeRepository.save_snapshot(db, hcp_id, snapshot, knowledge_settings.snapshot_version)
        logger.info(f"Snapshot Generated for HCP {hcp_id}")
        await dispatcher.publish(SnapshotGeneratedEvent(hcp_id=hcp_id, version=knowledge_settings.snapshot_version))
