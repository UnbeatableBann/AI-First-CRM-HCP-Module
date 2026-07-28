from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.database.session import get_db
from app.modules.planning.service import PlanningService
from app.modules.planning.schemas import MeetingBrief
from app.schemas.common import APIResponse

router = APIRouter(prefix="/hcp/{hcp_id}/meeting-brief", tags=["Planning System"])

@router.get("", response_model=APIResponse[MeetingBrief])
async def get_meeting_brief(
    hcp_id: uuid.UUID,
    refresh: bool = Query(False, description="Force a refresh of the meeting brief"),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns the AI-generated Meeting Brief for the HCP.
    """
    brief = await PlanningService.get_or_generate_brief(db, hcp_id, force_refresh=refresh)
    return APIResponse(status="success", message="Meeting brief loaded.", data=brief)  # type: ignore
