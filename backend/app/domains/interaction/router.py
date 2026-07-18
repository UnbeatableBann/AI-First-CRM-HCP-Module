from fastapi import APIRouter, Depends, Path, Body
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import uuid
from app.database.session import get_db
from app.domains.interaction.service import InteractionService
from app.domains.interaction.schemas import InteractionResponse
from app.schemas.common import APIResponse

router = APIRouter()


@router.post("/draft", response_model=APIResponse[InteractionResponse])
async def create_draft(
    hcp_id: Optional[uuid.UUID] = Body(None, embed=True),
    db: AsyncSession = Depends(get_db),
) -> APIResponse[InteractionResponse]:
    interaction = await InteractionService.create_draft(db, hcp_id)
    return APIResponse(status="success", message="Draft created.", data=interaction)  # type: ignore


@router.get("/{id}", response_model=APIResponse[InteractionResponse])
async def get_interaction(
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
    return APIResponse(status="success", message="Interaction updated.", data=interaction)  # type: ignore


@router.post("/{id}/complete", response_model=APIResponse[InteractionResponse])
async def complete_interaction(
    id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse[InteractionResponse]:
    interaction = await InteractionService.mark_completed(db, id)
    return APIResponse(status="success", message="Interaction completed.", data=interaction)  # type: ignore
