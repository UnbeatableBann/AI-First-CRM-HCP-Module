from fastapi import APIRouter, Depends, Path
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.domains.hcp_workspace.service import HCPWorkspaceService
from app.domains.hcp_workspace.schemas import HCPWorkspaceResponse
from app.schemas.common import APIResponse

router = APIRouter()

@router.get("/{id}/workspace", response_model=APIResponse[HCPWorkspaceResponse])
async def get_workspace(
    id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse[HCPWorkspaceResponse]:
    data = await HCPWorkspaceService.get_workspace(db, id)
    return APIResponse(status="success", message="Workspace loaded.", data=data)  # type: ignore

# The other routes (/timeline, /memory) are combined into /workspace for performance 
# per user request: "The workspace is loaded with a single backend request."
