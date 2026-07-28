from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.modules.mission_control.service import MissionControlService
from app.modules.mission_control.schemas import MissionControlResponse
from app.schemas.common import APIResponse
from app.core.cache import cache_response

router = APIRouter(prefix="/mission-control", tags=["Mission Control"])

@router.get("", response_model=APIResponse[MissionControlResponse])
@cache_response(expire_seconds=3600)
async def get_mission_control(
    request: Request,
    refresh: bool = Query(False, description="Force a refresh of the feed"),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns the AI-generated Mission Control dashboard feed.
    """
    feed = await MissionControlService.get_or_generate_feed(db, force_refresh=refresh)
    return APIResponse(status="success", message="Mission Control loaded.", data=feed)  # type: ignore
