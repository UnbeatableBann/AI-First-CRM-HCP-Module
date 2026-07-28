from app.modules.autonomous_agent.schemas import ActionRequest, ActionResponse
from app.modules.autonomous_agent.engine import execution_agent
from langchain_core.messages import HumanMessage
import logging

logger = logging.getLogger(__name__)

class AutonomousAgentService:
    @staticmethod
    async def execute_action(request: ActionRequest) -> ActionResponse:
        logger.info(f"Executing autonomous action for HCP {request.hcp_id}: {request.action_title}")
        
        prompt = f"Please execute the following action for HCP {request.hcp_id}.\nAction: {request.action_title}\nReason: {request.action_reason}\nContext: {request.additional_context}"
        
        result = await execution_agent.ainvoke({"messages": [HumanMessage(content=prompt)]})
        
        final_message = result["messages"][-1].content
        logger.info(f"Action Execution Result: {final_message}")
        
        return ActionResponse(status="completed", summary=final_message)
