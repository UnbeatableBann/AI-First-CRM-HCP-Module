from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.repositories.base import BaseRepository
from app.domains.hcp.models import HCP

from app.domains.hcp.schemas import HCPCreate, HCPUpdate


class HCPRepository(BaseRepository[HCP, HCPCreate, HCPUpdate]):
    async def get_by_name(self, db: AsyncSession, name: str) -> HCP | None:
        result = await db.execute(select(HCP).where(HCP.name.ilike(f"%{name}%")))
        return result.scalars().first()


hcp_repo = HCPRepository(HCP)
