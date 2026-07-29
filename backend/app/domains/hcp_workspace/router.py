from fastapi import APIRouter, Depends, Path, Request
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.domains.hcp_workspace.service import HCPWorkspaceService
from app.domains.hcp_workspace.schemas import HCPWorkspaceResponse
from app.schemas.common import APIResponse
from app.core.cache import cache_response

router = APIRouter()

@router.get("/{id}/workspace", response_model=APIResponse[HCPWorkspaceResponse])
@cache_response(expire_seconds=3600)
async def get_workspace(
    request: Request,
    id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse[HCPWorkspaceResponse]:
    data = await HCPWorkspaceService.get_workspace(db, id)
    return APIResponse(status="success", message="Workspace loaded.", data=data)  # type: ignore

# The other routes (/timeline, /memory) are combined into /workspace for performance 
# per user request: "The workspace is loaded with a single backend request."
