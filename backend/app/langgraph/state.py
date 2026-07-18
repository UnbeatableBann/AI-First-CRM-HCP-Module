import operator
from typing import Annotated, TypedDict, List, Dict, Any, Optional
from langchain_core.messages import BaseMessage

class InteractionState(TypedDict):
    id: str
    hcp_id: Optional[str]
    interaction_type: Optional[str]
    date: Optional[str]
    time: Optional[str]
    attendees: str
    topics_discussed: str
    materials_shared: str
    samples_distributed: str
    sentiment: Optional[str]
    outcomes: str
    follow_up_actions: str
    status: str

class GraphState(TypedDict):
    interaction_id: str
    latest_user_message: str

    interaction: InteractionState
    conversation_history: List[BaseMessage]

    messages: List[BaseMessage]

    current_hcp: Optional[Dict[str, Any]]
    missing_required_fields: List[str]
    
    assistant_response: Optional[str]
    
    warnings: List[str]
    errors: List[str]
