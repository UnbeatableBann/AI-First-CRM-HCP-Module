from langgraph.graph import StateGraph, END
from app.modules.mission_control.state import MissionControlState
from app.modules.mission_control.nodes import (
    load_territory, load_digital_twins, load_planning_outputs,
    load_commitments, load_trends, risk_detector, opportunity_detector,
    priority_engine, mission_feed_builder, cache_feed
)

def build_mission_engine():
    workflow = StateGraph(MissionControlState)
    
    workflow.add_node("load_territory", load_territory)
    workflow.add_node("load_digital_twins", load_digital_twins)
    workflow.add_node("load_planning_outputs", load_planning_outputs)
    workflow.add_node("load_commitments", load_commitments)
    workflow.add_node("load_trends", load_trends)
    workflow.add_node("risk_detector", risk_detector)
    workflow.add_node("opportunity_detector", opportunity_detector)
    workflow.add_node("priority_engine", priority_engine)
    workflow.add_node("mission_feed_builder", mission_feed_builder)
    workflow.add_node("cache_feed", cache_feed)
    
    workflow.set_entry_point("load_territory")
    
    workflow.add_edge("load_territory", "load_digital_twins")
    workflow.add_edge("load_digital_twins", "load_planning_outputs")
    workflow.add_edge("load_planning_outputs", "load_commitments")
    workflow.add_edge("load_commitments", "load_trends")
    workflow.add_edge("load_trends", "risk_detector")
    workflow.add_edge("risk_detector", "opportunity_detector")
    workflow.add_edge("opportunity_detector", "priority_engine")
    workflow.add_edge("priority_engine", "mission_feed_builder")
    workflow.add_edge("mission_feed_builder", "cache_feed")
    workflow.add_edge("cache_feed", END)
    
    return workflow.compile()

mission_engine = build_mission_engine()
