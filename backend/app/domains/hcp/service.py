from typing import Optional, List
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.domains.hcp.repository import hcp_repo
from app.domains.hcp.schemas import HCPCreate, HCPUpdate
from app.domains.hcp.models import HCP
from app.exceptions.base import NotFoundException


class HCPService:
    @staticmethod
    async def create_hcp(db: AsyncSession, hcp_in: HCPCreate) -> HCP:
        hcp = await hcp_repo.create(db, obj_in=hcp_in)
        return hcp

    @staticmethod
    async def get_hcp(db: AsyncSession, hcp_id: uuid.UUID) -> HCP:
        hcp = await hcp_repo.get(db, hcp_id)
        if not hcp:
            raise NotFoundException(f"HCP with ID {hcp_id} not found.")
        return hcp

    @staticmethod
    async def get_all_hcps(db: AsyncSession) -> List[HCP]:
        return await hcp_repo.get_multi(db, limit=1000)

    @staticmethod
    async def update_hcp(db: AsyncSession, hcp_id: uuid.UUID, hcp_in: HCPUpdate) -> HCP:
        hcp = await hcp_repo.get(db, hcp_id)
        if not hcp:
            raise NotFoundException(f"HCP with ID {hcp_id} not found.")
        updated_hcp = await hcp_repo.update(db, db_obj=hcp, obj_in=hcp_in)
        return updated_hcp

    @staticmethod
    async def search_hcp_by_name(db: AsyncSession, name: str) -> Optional[HCP]:
        return await hcp_repo.get_by_name(db, name)
