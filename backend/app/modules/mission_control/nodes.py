import logging
from app.modules.mission_control.state import MissionControlState
from app.modules.digital_twin.repository import DigitalTwinRepository
from app.modules.planning.repository import PlanningRepository
from app.domains.hcp.repository import hcp_repo
from app.database.session import async_session_factory
from app.llm.factory import LLMFactory
from langchain_core.prompts import ChatPromptTemplate
from datetime import datetime, timedelta, timezone

logger = logging.getLogger(__name__)

async def load_territory(state: MissionControlState) -> dict:
    async with async_session_factory() as db:
        hcps = await hcp_repo.get_multi(db)
        return {"hcps": [{"id": str(h.id), "name": h.name} for h in hcps]}

async def load_digital_twins(state: MissionControlState) -> dict:
    twins = {}
    async with async_session_factory() as db:
        for hcp in state.get("hcps", []):
            cache = await DigitalTwinRepository.get_twin_cache(db, hcp["id"])
            if cache:
                twins[hcp["id"]] = cache.twin_json
    return {"digital_twins": twins}

async def load_planning_outputs(state: MissionControlState) -> dict:
    briefs = {}
    async with async_session_factory() as db:
        for hcp in state.get("hcps", []):
            cache = await PlanningRepository.get_brief_cache(db, hcp["id"])
            if cache:
                briefs[hcp["id"]] = cache.brief_json
    return {"meeting_briefs": briefs}

async def load_commitments(state: MissionControlState) -> dict:
    all_commitments = []
    twins = state.get("digital_twins", {})
    for hcp_id, twin in twins.items():
        hcp_name = next((h["name"] for h in state.get("hcps", []) if h["id"] == hcp_id), "Unknown")
        commitments = twin.get("commitments", {}).get("pending_actions", [])
        for c in commitments:
            all_commitments.append({"hcp_id": hcp_id, "hcp_name": hcp_name, "commitment": c})
    return {"commitments": all_commitments}

async def load_trends(state: MissionControlState) -> dict:
    return {"trends": {}}

async def risk_detector(state: MissionControlState) -> dict:
    risks = []
    for hcp_id, twin in state.get("digital_twins", {}).items():
        hcp_name = next((h["name"] for h in state.get("hcps", []) if h["id"] == hcp_id), "Unknown")
        
        last_meeting = twin.get("relationship", {}).get("last_meeting")
        if last_meeting:
            try:
                lm_date = datetime.fromisoformat(last_meeting)
                if (datetime.now(timezone.utc) - lm_date).days > 30:
                    risks.append({
                        "hcp_id": hcp_id, "hcp_name": hcp_name, "type": "Risk", "priority": "High",
                        "title": "Long Inactivity", "reason": f"No visit in >30 days.", "action": "Schedule visit", "confidence": 1.0
                    })
            except Exception:
                pass
                
        commits = twin.get("commitments", {}).get("pending_actions", [])
        if len(commits) > 0:
            risks.append({
                "hcp_id": hcp_id, "hcp_name": hcp_name, "type": "Task", "priority": "Medium",
                "title": "Pending Commitments", "reason": f"{len(commits)} open commitments.", "action": "Fulfill commitments", "confidence": 1.0
            })
            
    return {"risks": risks}

async def opportunity_detector(state: MissionControlState) -> dict:
    ops = []
    for hcp_id, twin in state.get("digital_twins", {}).items():
        hcp_name = next((h["name"] for h in state.get("hcps", []) if h["id"] == hcp_id), "Unknown")
        
        interests = twin.get("clinical_profile", {}).get("clinical_interests", [])
        if interests:
            ops.append({
                "hcp_id": hcp_id, "hcp_name": hcp_name, "type": "Opportunity", "priority": "Medium",
                "title": "Discuss Interest", "reason": f"Interested in {interests[0]}.", "action": "Share literature", "confidence": 0.8
            })
    return {"opportunities": ops}

async def priority_engine(state: MissionControlState) -> dict:
    items = state.get("risks", []) + state.get("opportunities", [])
    
    p_map = {"Critical": 4, "High": 3, "Medium": 2, "Low": 1}
    items.sort(key=lambda x: p_map.get(x.get("priority", "Low"), 1), reverse=True)
    
    return {"priorities": items}

async def mission_feed_builder(state: MissionControlState) -> dict:
    feed = state.get("priorities", [])
    wins = []
    learnings = []
    
    for hcp_id, twin in state.get("digital_twins", {}).items():
        hcp_name = next((h["name"] for h in state.get("hcps", []) if h["id"] == hcp_id), "Unknown")
        
        # Extract Learnings
        pref = twin.get("communication", {}).get("preferred_channel")
        if pref:
            learnings.append({
                "hcp_id": hcp_id, "hcp_name": hcp_name, "type": "Learning", "priority": "Low",
                "title": "Preference Learned", "reason": f"Prefers {pref} communication", "action": "", "confidence": 1.0
            })
            
        style = twin.get("behavior", {}).get("decision_style")
        if style:
            learnings.append({
                "hcp_id": hcp_id, "hcp_name": hcp_name, "type": "Learning", "priority": "Low",
                "title": "Behavior Identified", "reason": f"Decision style: {style}", "action": "", "confidence": 1.0
            })

        focus = twin.get("clinical_profile", {}).get("disease_focus", [])
        if focus and len(focus) > 0:
            learnings.append({
                "hcp_id": hcp_id, "hcp_name": hcp_name, "type": "Learning", "priority": "Low",
                "title": "Clinical Focus", "reason": f"Focuses on {focus[0]}", "action": "", "confidence": 1.0
            })
            
        # Extract Wins
        trust_signals = twin.get("relationship", {}).get("trust_signals", [])
        for signal in trust_signals[:1]:
            wins.append({
                "hcp_id": hcp_id, "hcp_name": hcp_name, "type": "Win", "priority": "Low",
                "title": "Trust Built", "reason": signal, "action": "", "confidence": 1.0
            })
            
        milestones = twin.get("timeline", {}).get("major_milestones", [])
        for milestone in milestones[:1]:
            wins.append({
                "hcp_id": hcp_id, "hcp_name": hcp_name, "type": "Win", "priority": "Medium",
                "title": "Milestone Achieved", "reason": milestone, "action": "", "confidence": 1.0
            })
            
    from app.modules.mission_control.schemas import MissionSummary
    summary = MissionSummary(
        greeting="Good Morning, Representative",
        daily_mission=f"You have {len(feed)} priority actions across your territory today."
    )
    
    return {
        "feed": feed,
        "wins": wins,
        "learnings": learnings,
        "summary": summary.model_dump()
    }

async def cache_feed(state: MissionControlState) -> dict:
    from app.modules.mission_control.repository import MissionControlRepository

    
    async with async_session_factory() as db:
        feed_data = {
            "summary": state.get("summary", {}),
            "priority_queue": state.get("priorities", []),
            "feed": state.get("feed", []),
            "wins": state.get("wins", []),
            "learnings": state.get("learnings", [])
        }
        await MissionControlRepository.save_cache(
            db=db,
            feed_json=feed_data,
            expires_at=datetime.utcnow() + timedelta(minutes=15)
        )
    return state
