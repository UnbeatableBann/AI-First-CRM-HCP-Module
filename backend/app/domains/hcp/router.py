from fastapi import APIRouter, Depends, Path, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid
from app.database.session import get_db
from app.domains.hcp.service import HCPService
from app.domains.interaction.service import InteractionService
from app.domains.hcp.schemas import HCPResponse
from app.domains.interaction.schemas import InteractionResponse
from app.schemas.common import APIResponse
from app.core.cache import cache_response

router = APIRouter()


@router.get("", response_model=APIResponse[List[HCPResponse]])
@router.get("/", response_model=APIResponse[List[HCPResponse]])
@cache_response(expire_seconds=3600)
async def list_hcps(
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> APIResponse[List[HCPResponse]]:
    hcps = await HCPService.get_all_hcps(db)
    return APIResponse(status="success", message="HCPs retrieved.", data=hcps)  # type: ignore


@router.get("/{id}", response_model=APIResponse[HCPResponse])
@cache_response(expire_seconds=3600)
async def get_hcp(
    request: Request,
    id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse[HCPResponse]:
    hcp = await HCPService.get_hcp(db, id)
    return APIResponse(status="success", message="HCP retrieved.", data=hcp)  # type: ignore


@router.get("/{id}/interactions", response_model=APIResponse[List[InteractionResponse]])
@cache_response(expire_seconds=3600)
async def get_hcp_history(
    request: Request,
    id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse[List[InteractionResponse]]:
    history = await InteractionService.get_hcp_history(db, id)
    return APIResponse(status="success", message="HCP history retrieved.", data=history)  # type: ignore

from app.domains.hcp.intelligence_schemas import CurisIntelligence
from app.domains.hcp.intelligence_service import IntelligenceService

@router.get("/{id}/intelligence", response_model=APIResponse[CurisIntelligence])
@cache_response(expire_seconds=86400) # 24 hours cache as per requirements
async def get_hcp_intelligence(
    request: Request,
    id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse[CurisIntelligence]:
    intelligence = await IntelligenceService.get_intelligence(db, id)
    if not intelligence:
        # Fallback empty or 404
        return APIResponse(status="error", message="HCP Intelligence not found or could not be generated.", data=None) # type: ignore
    return APIResponse(status="success", message="Curis Intelligence retrieved.", data=intelligence) # type: ignore
