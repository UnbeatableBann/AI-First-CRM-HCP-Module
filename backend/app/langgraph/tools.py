import json
from typing import Optional, List, Any
from langchain_core.tools import tool

@tool
def log_interaction(
    hcp_name: Optional[str] = None,
    interaction_type: Optional[str] = None,
    date: Optional[str] = None,
    time: Optional[str] = None,
    attendees: Optional[str] = None,
    topics_discussed: Optional[str] = None,
    materials_shared: Optional[str] = None,
    samples_distributed: Optional[str] = None,
    sentiment: Optional[str] = None,
    outcomes: Optional[str] = None,
    follow_up_actions: Optional[str] = None,
) -> str:
    """Log new information into the interaction draft. Returns the fields to be updated."""
    params = locals()
    return json.dumps({k: v for k, v in params.items() if v is not None})

@tool
def edit_interaction(
    interaction_type: Optional[str] = None,
    date: Optional[str] = None,
    time: Optional[str] = None,
    attendees: Optional[str] = None,
    topics_discussed: Optional[str] = None,
    materials_shared: Optional[str] = None,
    samples_distributed: Optional[str] = None,
    sentiment: Optional[str] = None,
    outcomes: Optional[str] = None,
    follow_up_actions: Optional[str] = None,
) -> str:
    """Modify or correct existing information in the interaction draft. Returns the fields to be updated."""
    params = locals()
    return json.dumps({k: v for k, v in params.items() if v is not None})

@tool
def hcp_search(hcp_name: str) -> str:
    """Search for an HCP by name in the database. Use this to find the HCP before retrieving history."""
    return json.dumps({"action": "search", "hcp_name": hcp_name})

@tool
def retrieve_interaction_history(hcp_name: Optional[str] = None) -> str:
    """Retrieve previous interactions of the selected HCP."""
    return json.dumps({"action": "history", "hcp_name": hcp_name})

@tool
def follow_up_recommendation() -> str:
    """Generate intelligent follow-up recommendations based on current interaction and previous interaction history."""
    return json.dumps({"action": "recommendation"})

@tool
def save_interaction() -> str:
    """Call this tool when the user explicitly confirms that they want to save the completed interaction."""
    return json.dumps({"action": "save"})

def get_tools() -> list[Any]:
    return [
        log_interaction,
        edit_interaction,
        hcp_search,
        retrieve_interaction_history,
        follow_up_recommendation,
        save_interaction
    ]
