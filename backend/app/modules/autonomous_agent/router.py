from fastapi import APIRouter
from app.modules.autonomous_agent.schemas import ActionRequest, ActionResponse
from app.modules.autonomous_agent.service import AutonomousAgentService
from app.schemas.common import APIResponse

router = APIRouter(prefix="/autonomous-agent", tags=["Autonomous Agent"])

@router.post("/execute", response_model=APIResponse[ActionResponse])
async def execute_action(request: ActionRequest):
    """
    Executes an autonomous action approved by the representative.
    """
    response = await AutonomousAgentService.execute_action(request)
    return APIResponse(status="success", message="Action executed.", data=response)  # type: ignore
