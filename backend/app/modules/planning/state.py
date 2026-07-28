from typing import TypedDict, Dict, Any, List

class PlanningState(TypedDict):
    hcp_id: str
    digital_twin: Dict[str, Any]
    recent_interactions: List[Dict[str, Any]]
    knowledge: List[Dict[str, Any]]
    commitments: List[Dict[str, Any]]
    meeting_context: str
    objectives: Dict[str, Any]
    conversation_strategy: Dict[str, Any]
    literature: Dict[str, Any]
    risks: Dict[str, Any]
    brief: Dict[str, Any]
    metadata: Dict[str, Any]
