from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid
from typing import List, Optional
from datetime import datetime

from app.modules.knowledge.models import KnowledgeFact, KnowledgeRelation, KnowledgeSnapshot
from app.modules.knowledge.enums import FactStatus
from app.modules.knowledge.schemas import KnowledgeFactCreate

class KnowledgeRepository:
    @staticmethod
    async def create_fact(db: AsyncSession, hcp_id: uuid.UUID, fact_data: KnowledgeFactCreate) -> KnowledgeFact:
        fact = KnowledgeFact(
            hcp_id=hcp_id,
            category=fact_data.category,
            attribute=fact_data.attribute,
            value=fact_data.value,
            confidence=fact_data.confidence,
            evidence_interaction_id=fact_data.evidence_interaction_id,
            source=fact_data.source
        )
        db.add(fact)
        await db.commit()
        await db.refresh(fact)
        return fact

    @staticmethod
    async def update_fact(db: AsyncSession, fact_id: uuid.UUID, updates: dict) -> Optional[KnowledgeFact]:
        result = await db.execute(select(KnowledgeFact).where(KnowledgeFact.id == fact_id))
        fact = result.scalar_one_or_none()
        if not fact:
            return None
        for key, value in updates.items():
            setattr(fact, key, value)
        await db.commit()
        await db.refresh(fact)
        return fact

    @staticmethod
    async def archive_fact(db: AsyncSession, fact_id: uuid.UUID) -> bool:
        result = await db.execute(select(KnowledgeFact).where(KnowledgeFact.id == fact_id))
        fact = result.scalar_one_or_none()
        if not fact:
            return False
        fact.status = FactStatus.ARCHIVED
        await db.commit()
        return True

    @staticmethod
    async def get_fact(db: AsyncSession, fact_id: uuid.UUID) -> Optional[KnowledgeFact]:
        result = await db.execute(select(KnowledgeFact).where(KnowledgeFact.id == fact_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_all_facts(db: AsyncSession, hcp_id: uuid.UUID, active_only: bool = True) -> List[KnowledgeFact]:
        query = select(KnowledgeFact).where(KnowledgeFact.hcp_id == hcp_id)
        if active_only:
            query = query.where(KnowledgeFact.status == FactStatus.ACTIVE)
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_all_relations(db: AsyncSession, hcp_id: uuid.UUID) -> List[KnowledgeRelation]:
        query = select(KnowledgeRelation).where(KnowledgeRelation.hcp_id == hcp_id)
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_snapshot(db: AsyncSession, hcp_id: uuid.UUID) -> Optional[KnowledgeSnapshot]:
        result = await db.execute(select(KnowledgeSnapshot).where(KnowledgeSnapshot.hcp_id == hcp_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def save_snapshot(db: AsyncSession, hcp_id: uuid.UUID, snapshot_json: dict, version: str) -> KnowledgeSnapshot:
        result = await db.execute(select(KnowledgeSnapshot).where(KnowledgeSnapshot.hcp_id == hcp_id))
        snapshot = result.scalar_one_or_none()
        
        if snapshot:
            snapshot.snapshot_json = snapshot_json
            snapshot.version = version
            snapshot.generated_at = datetime.utcnow()
        else:
            snapshot = KnowledgeSnapshot(
                hcp_id=hcp_id,
                snapshot_json=snapshot_json,
                version=version
            )
            db.add(snapshot)
            
        await db.commit()
        await db.refresh(snapshot)
        return snapshot
