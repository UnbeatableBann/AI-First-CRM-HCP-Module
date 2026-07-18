import uuid
from typing import Any, Dict, List, Optional

import structlog
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.langgraph.graph import agent_app

router = APIRouter()

logger = structlog.get_logger(__name__)

class AgentRequest(BaseModel):
    interaction_id: uuid.UUID
    message: str
    interaction: Optional[Dict[str, Any]] = None

class AgentResponse(BaseModel):
    assistant_response: str
    interaction: Dict[str, Any]
    current_hcp_name: Optional[str] = None
    tool: Optional[str] = None
    warnings: List[str] = []
    errors: List[str] = []


@router.post("/", response_model=AgentResponse)
async def process_message(request: AgentRequest, db: AsyncSession = Depends(get_db)) -> AgentResponse:
    initial_state: Dict[str, Any] = {
        "interaction_id": str(request.interaction_id),
        "latest_user_message": request.message,
        "interaction": request.interaction,
    }


    config = {"configurable": {"thread_id": str(request.interaction_id)}}
    final_state = await agent_app.ainvoke(initial_state, config=config)
    logger.info(f"Final state after processing: {final_state}")
    
    # Check if tools were executed
    executed_tools = []
    for msg in final_state.get("messages", []):
        if getattr(msg, "tool_calls", None):
            executed_tools.extend([tc["name"] for tc in msg.tool_calls])
            
    tool_name_str = ", ".join(executed_tools) if executed_tools else None
    
    current_hcp = final_state.get("current_hcp")
    hcp_name = current_hcp.get("name") if current_hcp else None

    return AgentResponse(
        assistant_response=final_state.get("assistant_response") or "Processed.",
        interaction=final_state.get("interaction", {}),
        current_hcp_name=hcp_name,
        tool=tool_name_str,
        warnings=final_state.get("warnings", []),
        errors=final_state.get("errors", []),
    )
