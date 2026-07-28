from langgraph.graph import StateGraph, END
from app.modules.planning.state import PlanningState
from app.modules.planning.nodes import (
    load_twin, load_context, context_builder, objective_planner,
    strategy_planner, literature_planner, risk_analyzer, brief_composer, cache_brief
)

def build_planning_graph():
    workflow = StateGraph(PlanningState)
    
    workflow.add_node("load_twin", load_twin)
    workflow.add_node("load_context", load_context)
    workflow.add_node("context_builder", context_builder)
    workflow.add_node("objective_planner", objective_planner)
    workflow.add_node("strategy_planner", strategy_planner)
    workflow.add_node("literature_planner", literature_planner)
    workflow.add_node("risk_analyzer", risk_analyzer)
    workflow.add_node("brief_composer", brief_composer)
    workflow.add_node("cache_brief", cache_brief)
    
    workflow.set_entry_point("load_twin")
    
    workflow.add_edge("load_twin", "load_context")
    workflow.add_edge("load_context", "context_builder")
    workflow.add_edge("context_builder", "objective_planner")
    
    workflow.add_edge("objective_planner", "strategy_planner")
    workflow.add_edge("strategy_planner", "literature_planner")
    workflow.add_edge("literature_planner", "risk_analyzer")
    workflow.add_edge("risk_analyzer", "brief_composer")
    workflow.add_edge("brief_composer", "cache_brief")
    workflow.add_edge("cache_brief", END)
    
    return workflow.compile()

planning_pipeline = build_planning_graph()
