from fastapi import APIRouter, Depends, Path, Body, Request
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import uuid
from app.database.session import get_db
from app.domains.interaction.service import InteractionService
from app.domains.interaction.schemas import InteractionResponse, InteractionHomeResponse
from app.schemas.common import APIResponse
from app.core.cache import cache_response, invalidate_cache_prefix

router = APIRouter()

@router.get("", response_model=APIResponse[list[dict]])
@router.get("/", response_model=APIResponse[list[dict]])
@cache_response(expire_seconds=3600)
async def get_all(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> APIResponse[list[dict]]:
    data = await InteractionService.get_all_interactions(db)
    return APIResponse(status="success", message="All interactions loaded.", data=data)  # type: ignore

@router.get("/home", response_model=APIResponse[InteractionHomeResponse])
@cache_response(expire_seconds=3600)
async def get_home(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> APIResponse[InteractionHomeResponse]:
    data = await InteractionService.get_home(db)
    return APIResponse(status="success", message="Home loaded.", data=data)  # type: ignore


@router.post("/draft", response_model=APIResponse[InteractionResponse])
async def create_draft(
    hcp_id: Optional[uuid.UUID] = Body(None, embed=True),
    db: AsyncSession = Depends(get_db),
) -> APIResponse[InteractionResponse]:
    interaction = await InteractionService.create_draft(db, hcp_id)
    await invalidate_cache_prefix("/api/v1/interaction")
    if hcp_id:
        await invalidate_cache_prefix(f"/api/v1/hcp/{hcp_id}")
    return APIResponse(status="success", message="Draft created.", data=interaction)  # type: ignore


@router.get("/{id}", response_model=APIResponse[InteractionResponse])
@cache_response(expire_seconds=3600)
async def get_interaction(
    request: Request,
    id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse[InteractionResponse]:
    interaction = await InteractionService.get_interaction(db, id)
    return APIResponse(status="success", message="Interaction retrieved.", data=interaction)  # type: ignore


@router.patch("/{id}", response_model=APIResponse[InteractionResponse])
async def update_interaction(
    interaction_in: dict[str, Any] = Body(...),
    id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse[InteractionResponse]:
    interaction = await InteractionService.update_interaction(db, id, interaction_in)
    
    await invalidate_cache_prefix("/api/v1/interaction")
    # Trigger pipeline on update to continuously refine learnings
    if interaction and getattr(interaction, "hcp_id", None):
        await invalidate_cache_prefix(f"/api/v1/hcp/{interaction.hcp_id}")
        content = ""
        try:
            content = interaction.model_dump_json()
        except BaseException:
            content = str(interaction)
        await dispatcher.publish(InteractionSavedEvent(interaction_id=id, hcp_id=interaction.hcp_id, content=content))

    return APIResponse(status="success", message="Interaction updated.", data=interaction)  # type: ignore


from app.core.events.dispatcher import dispatcher
from app.core.events.events import InteractionSavedEvent
import json

@router.post("/{id}/complete", response_model=APIResponse[InteractionResponse])
async def complete_interaction(
    id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse[InteractionResponse]:
    interaction = await InteractionService.mark_completed(db, id)
    
    await invalidate_cache_prefix("/api/v1/interaction")
    if interaction and getattr(interaction, "hcp_id", None):
        await invalidate_cache_prefix(f"/api/v1/hcp/{interaction.hcp_id}")
        content = ""
        try:
            content = interaction.model_dump_json()
        except BaseException:
            content = str(interaction)
        await dispatcher.publish(InteractionSavedEvent(interaction_id=id, hcp_id=interaction.hcp_id, content=content))
        
    return APIResponse(status="success", message="Interaction completed.", data=interaction)  # type: ignore


@router.delete("/{id}", response_model=APIResponse[None])
async def delete_interaction(
    id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse[None]:
    # We should ideally fetch the interaction first to know which hcp cache to clear, but /interaction cache is cleared anyway
    interaction = await InteractionService.get_interaction(db, id)
    await InteractionService.delete_interaction(db, id)
    await invalidate_cache_prefix("/api/v1/interaction")
    if interaction and getattr(interaction, "hcp_id", None):
        await invalidate_cache_prefix(f"/api/v1/hcp/{interaction.hcp_id}")
        
    return APIResponse(status="success", message="Interaction deleted.", data=None)  # type: ignore
