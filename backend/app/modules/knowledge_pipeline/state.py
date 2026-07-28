from typing import TypedDict, List, Dict, Any

class KnowledgePipelineState(TypedDict):
    interaction_id: str
    hcp_id: str
    interaction: Dict[str, Any]
    hcp: Dict[str, Any]
    current_snapshot: Dict[str, Any]
    existing_facts: List[Dict[str, Any]]
    
    entities: List[Dict[str, Any]]
    topics: List[Dict[str, Any]]
    memory_facts: List[Dict[str, Any]]
    followups: List[Dict[str, Any]]
    
    validation_errors: List[str]
    conflicts: List[Dict[str, Any]]
    merged_facts: List[Dict[str, Any]]
    snapshot: Dict[str, Any]
    metadata: Dict[str, Any]
