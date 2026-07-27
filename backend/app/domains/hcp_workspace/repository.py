from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from app.domains.hcp_workspace.models import HCPMemory
from app.domains.interaction.models import Interaction
import uuid

class HCPWorkspaceRepository:
    @staticmethod
    async def get_memory(db: AsyncSession, hcp_id: uuid.UUID) -> HCPMemory | None:
        stmt = select(HCPMemory).where(HCPMemory.hcp_id == hcp_id)
        result = await db.execute(stmt)
        return result.scalars().first()

    @staticmethod
    async def update_memory(db: AsyncSession, hcp_id: uuid.UUID, data: dict) -> HCPMemory:
        memory = await HCPWorkspaceRepository.get_memory(db, hcp_id)
        if not memory:
            memory = HCPMemory(hcp_id=hcp_id)
            db.add(memory)
        for k, v in data.items():
            setattr(memory, k, v)
        await db.flush()
        return memory

    @staticmethod
    async def get_timeline(db: AsyncSession, hcp_id: uuid.UUID) -> list[Interaction]:
        stmt = (
            select(Interaction)
            .where(Interaction.hcp_id == str(hcp_id), Interaction.status == "COMPLETED")
            .order_by(desc(Interaction.date))
        )
        result = await db.execute(stmt)
        return list(result.scalars().all())

hcp_workspace_repo = HCPWorkspaceRepository()
