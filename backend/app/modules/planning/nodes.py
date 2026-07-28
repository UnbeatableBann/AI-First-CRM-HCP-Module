from typing import Dict, Any
from langchain_core.prompts import ChatPromptTemplate
import uuid
import json
import logging
from datetime import datetime

from app.modules.planning.state import PlanningState
from app.modules.planning.prompts import (
    CONTEXT_BUILDER_PROMPT, OBJECTIVE_PLANNER_PROMPT, 
    STRATEGY_PLANNER_PROMPT, RISK_ANALYZER_PROMPT, 
    LITERATURE_PLANNER_PROMPT
)
from app.modules.planning.schemas import (
    ObjectivePlannerOutput, StrategyPlannerOutput, 
    RiskAnalyzerOutput, LiteraturePlannerOutput
)
from app.llm.factory import LLMFactory
from app.modules.digital_twin.service import DigitalTwinService
from app.database.session import async_session_factory

logger = logging.getLogger(__name__)

async def load_twin(state: PlanningState) -> dict:
    logger.info("Node: load_twin")
    hcp_id = uuid.UUID(state["hcp_id"])
    async with async_session_factory() as db:
        twin = await DigitalTwinService.get_twin(db, hcp_id)
        if not twin:
            twin = await DigitalTwinService.rebuild_twin(db, hcp_id)
        
    return {"digital_twin": twin.model_dump(mode="json")}

async def load_context(state: PlanningState) -> dict:
    logger.info("Node: load_context")
    twin = state.get("digital_twin", {})
    timeline = twin.get("timeline", {})
    commitments = twin.get("commitments", {})
    return {
        "recent_interactions": timeline.get("recent_events", []),
        "commitments": commitments.get("pending_actions", [])
    }

async def context_builder(state: PlanningState) -> dict:
    logger.info("Node: context_builder")
    llm = LLMFactory.get_llm()
    prompt = ChatPromptTemplate.from_template(CONTEXT_BUILDER_PROMPT + "\n\nTwin: {twin}\nContext: {context}")
    chain = prompt | llm
    result = await chain.ainvoke({"twin": json.dumps(state.get("digital_twin", {})), "context": json.dumps(state.get("commitments", []))})
    return {"meeting_context": result.content}

async def objective_planner(state: PlanningState) -> dict:
    logger.info("Node: objective_planner")
    llm = LLMFactory.get_llm().with_structured_output(ObjectivePlannerOutput)
    prompt = ChatPromptTemplate.from_template(OBJECTIVE_PLANNER_PROMPT + "\n\nTwin: {twin}\nContext: {context}")
    chain = prompt | llm
    result = await chain.ainvoke({"twin": json.dumps(state.get("digital_twin", {})), "context": state.get("meeting_context", "")})
    
    # Provide a fallback if structured output fails
    if not result:
        from app.modules.planning.schemas import EvidenceRecommendation
        fallback = ObjectivePlannerOutput(
            primary_objective=EvidenceRecommendation(recommendation="Discuss general clinical updates", confidence=0.5, evidence="Default"),
            expected_duration="15 minutes"
        )
        return {"objectives": fallback.model_dump()}
        
    return {"objectives": result.model_dump()}

async def strategy_planner(state: PlanningState) -> dict:
    logger.info("Node: strategy_planner")
    llm = LLMFactory.get_llm().with_structured_output(StrategyPlannerOutput)
    prompt = ChatPromptTemplate.from_template(STRATEGY_PLANNER_PROMPT + "\n\nTwin: {twin}\nObjectives: {objectives}")
    chain = prompt | llm
    result = await chain.ainvoke({"twin": json.dumps(state.get("digital_twin", {})), "objectives": json.dumps(state.get("objectives", {}))})
    
    if not result:
        from app.modules.planning.schemas import EvidenceRecommendation
        fallback = StrategyPlannerOutput(
            suggested_opening=EvidenceRecommendation(recommendation="Hello Doctor, how are you?", confidence=0.5, evidence="Default")
        )
        return {"conversation_strategy": fallback.model_dump()}
        
    return {"conversation_strategy": result.model_dump()}

async def literature_planner(state: PlanningState) -> dict:
    logger.info("Node: literature_planner")
    llm = LLMFactory.get_llm().with_structured_output(LiteraturePlannerOutput)
    prompt = ChatPromptTemplate.from_template(LITERATURE_PLANNER_PROMPT + "\n\nTwin: {twin}\nObjectives: {objectives}")
    chain = prompt | llm
    result = await chain.ainvoke({"twin": json.dumps(state.get("digital_twin", {})), "objectives": json.dumps(state.get("objectives", {}))})
    
    if not result:
        return {"literature": {"recommended_materials": []}}
        
    return {"literature": result.model_dump()}

async def risk_analyzer(state: PlanningState) -> dict:
    logger.info("Node: risk_analyzer")
    llm = LLMFactory.get_llm().with_structured_output(RiskAnalyzerOutput)
    prompt = ChatPromptTemplate.from_template(RISK_ANALYZER_PROMPT + "\n\nTwin: {twin}\nContext: {context}")
    chain = prompt | llm
    result = await chain.ainvoke({"twin": json.dumps(state.get("digital_twin", {})), "context": state.get("meeting_context", "")})
    
    if not result:
        return {"risks": {"risks": []}}
        
    return {"risks": result.model_dump()}

async def brief_composer(state: PlanningState) -> dict:
    logger.info("Node: brief_composer")
    twin = state.get("digital_twin", {})
    
    brief_data = {
        "summary": state.get("meeting_context", "Meeting summary."),
        "objectives": state.get("objectives", {}),
        "strategy": state.get("conversation_strategy", {}),
        "conversation": [], 
        "risks": state.get("risks", {}).get("risks", []),
        "commitments": [], 
        "literature": state.get("literature", {}).get("recommended_materials", []),
        "expected_outcome": "Advance the relationship and deliver requested information.",
        "confidence": 0.85,
        "generated_at": datetime.utcnow().isoformat(),
        "digital_twin_version": twin.get("metadata", {}).get("twin_version", "v1.0")
    }
    
    return {"brief": brief_data}

async def cache_brief(state: PlanningState) -> dict:
    logger.info("Node: cache_brief")
    from app.modules.planning.repository import PlanningRepository
    from datetime import timedelta
    
    brief = state.get("brief", {})
    hcp_id = uuid.UUID(state["hcp_id"])
    dt_version = brief.get("digital_twin_version", "v1.0")
    
    async with async_session_factory() as db:
        expires_at = datetime.utcnow() + timedelta(days=1)
        await PlanningRepository.save_brief_cache(
            db=db,
            hcp_id=hcp_id,
            digital_twin_version=dt_version,
            brief_json=brief,
            expires_at=expires_at
        )
        
    return state
