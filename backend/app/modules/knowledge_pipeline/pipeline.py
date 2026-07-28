from langgraph.graph import StateGraph, END
from app.modules.knowledge_pipeline.state import KnowledgePipelineState
from app.modules.knowledge_pipeline.nodes import (
    load_interaction, load_snapshot, entity_extractor, topic_extractor,
    memory_extractor, action_extractor, validator, conflict_detector,
    knowledge_merger, snapshot_builder, publish_event
)

def build_knowledge_pipeline():
    workflow = StateGraph(KnowledgePipelineState)
    
    workflow.add_node("load_interaction", load_interaction)
    workflow.add_node("load_snapshot", load_snapshot)
    workflow.add_node("entity_extractor", entity_extractor)
    workflow.add_node("topic_extractor", topic_extractor)
    workflow.add_node("memory_extractor", memory_extractor)
    workflow.add_node("action_extractor", action_extractor)
    workflow.add_node("validator", validator)
    workflow.add_node("conflict_detector", conflict_detector)
    workflow.add_node("knowledge_merger", knowledge_merger)
    workflow.add_node("snapshot_builder", snapshot_builder)
    workflow.add_node("publish_event", publish_event)
    
    workflow.set_entry_point("load_interaction")
    
    workflow.add_edge("load_interaction", "load_snapshot")
    workflow.add_edge("load_snapshot", "entity_extractor")
    workflow.add_edge("entity_extractor", "topic_extractor")
    workflow.add_edge("topic_extractor", "memory_extractor")
    workflow.add_edge("memory_extractor", "action_extractor")
    workflow.add_edge("action_extractor", "validator")
    workflow.add_edge("validator", "conflict_detector")
    workflow.add_edge("conflict_detector", "knowledge_merger")
    workflow.add_edge("knowledge_merger", "snapshot_builder")
    workflow.add_edge("snapshot_builder", "publish_event")
    workflow.add_edge("publish_event", END)
    
    return workflow.compile()

knowledge_pipeline = build_knowledge_pipeline()
