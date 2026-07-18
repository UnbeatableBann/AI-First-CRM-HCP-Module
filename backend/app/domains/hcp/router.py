from fastapi import APIRouter, Depends, Path
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid
from app.database.session import get_db
from app.domains.hcp.service import HCPService
from app.domains.interaction.service import InteractionService
from app.domains.hcp.schemas import HCPResponse
from app.domains.interaction.schemas import InteractionResponse
from app.schemas.common import APIResponse

router = APIRouter()


@router.get("/", response_model=APIResponse[List[HCPResponse]])
async def list_hcps(db: AsyncSession = Depends(get_db)) -> APIResponse[List[HCPResponse]]:
    hcps = await HCPService.get_all_hcps(db)
    return APIResponse(status="success", message="HCPs retrieved.", data=hcps)  # type: ignore


@router.get("/{id}", response_model=APIResponse[HCPResponse])
async def get_hcp(
    id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse[HCPResponse]:
    hcp = await HCPService.get_hcp(db, id)
    return APIResponse(status="success", message="HCP retrieved.", data=hcp)  # type: ignore


@router.get("/{id}/interactions", response_model=APIResponse[List[InteractionResponse]])
async def get_hcp_history(
    id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse[List[InteractionResponse]]:
    history = await InteractionService.get_hcp_history(db, id)
    return APIResponse(status="success", message="HCP history retrieved.", data=history)  # type: ignore
