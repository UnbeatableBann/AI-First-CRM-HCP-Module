from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid
import logging

from app.modules.digital_twin.assembler import DigitalTwinAssembler
from app.modules.digital_twin.schemas import DigitalTwin
from app.modules.knowledge.repository import KnowledgeRepository
from app.domains.hcp.models import HCP

logger = logging.getLogger(__name__)

class DigitalTwinBuilder:
    @staticmethod
    async def build_twin(db: AsyncSession, hcp_id: uuid.UUID) -> DigitalTwin:
        logger.info(f"Building Digital Twin for HCP {hcp_id}")
        
        hcp_result = await db.execute(select(HCP).where(HCP.id == hcp_id))
        hcp = hcp_result.scalar_one_or_none()
        
        snapshot_obj = await KnowledgeRepository.get_snapshot(db, hcp_id)
        snapshot_json = snapshot_obj.snapshot_json if snapshot_obj else {}
        knowledge_version = snapshot_obj.version if snapshot_obj else "v0"
        
        facts = await KnowledgeRepository.get_all_facts(db, hcp_id, active_only=True)
        
        twin = DigitalTwinAssembler.assemble(
            hcp_id=hcp_id,
            hcp=hcp,
            facts=facts,
            snapshot=snapshot_json,
            knowledge_version=knowledge_version
        )
        
        return twin
