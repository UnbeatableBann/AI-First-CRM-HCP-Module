from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.database.session import get_db
from app.modules.digital_twin.service import DigitalTwinService
from app.modules.digital_twin.schemas import DigitalTwin
from app.schemas.common import APIResponse

router = APIRouter(prefix="/hcp/{hcp_id}/workspace", tags=["Digital Twin Workspace"])

@router.get("", response_model=APIResponse[DigitalTwin])
async def get_workspace(
    hcp_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Returns the canonical Digital Twin for the HCP Workspace.
    """
    twin = await DigitalTwinService.get_twin(db, hcp_id)
    if not twin:
        twin = await DigitalTwinService.rebuild_twin(db, hcp_id)
        
    return APIResponse(status="success", message="Workspace loaded.", data=twin)  # type: ignore
