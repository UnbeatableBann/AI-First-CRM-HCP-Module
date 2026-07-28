from pydantic import BaseModel
import uuid

class ActionRequest(BaseModel):
    hcp_id: uuid.UUID
    action_title: str
    action_reason: str
    additional_context: str = ""

class ActionResponse(BaseModel):
    status: str
    summary: str
