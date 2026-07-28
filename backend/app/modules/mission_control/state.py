from typing import TypedDict, Dict, Any, List

class MissionControlState(TypedDict):
    hcps: List[Dict[str, Any]]
    digital_twins: Dict[str, Dict[str, Any]]
    meeting_briefs: Dict[str, Dict[str, Any]]
    commitments: List[Dict[str, Any]]
    trends: Dict[str, Any]
    
    risks: List[Dict[str, Any]]
    opportunities: List[Dict[str, Any]]
    priorities: List[Dict[str, Any]]
    recommendations: List[Dict[str, Any]]
    
    feed: List[Dict[str, Any]]
    wins: List[Dict[str, Any]]
    learnings: List[Dict[str, Any]]
    summary: Dict[str, str]
