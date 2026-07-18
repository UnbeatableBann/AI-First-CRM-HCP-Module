from typing import Any
from langgraph.graph import END, StateGraph, START
from langgraph.checkpoint.memory import MemorySaver

from app.langgraph.nodes import (
    initialize_state,
    load_conversation_history,
    reasoning_agent,
    execute_tools_and_update,
    validate_interaction,
    should_continue,
    save_chat,
)
from app.langgraph.state import GraphState


def create_agent_graph() -> Any:
    workflow = StateGraph(GraphState)

    workflow.add_node("initialize_state", initialize_state)
    workflow.add_node("load_conversation_history", load_conversation_history)
    workflow.add_node("reasoning_agent", reasoning_agent)
    workflow.add_node("execute_tools_and_update", execute_tools_and_update)
    workflow.add_node("validate_interaction", validate_interaction)
    workflow.add_node("save_chat", save_chat)

    workflow.add_edge(START, "initialize_state")
    workflow.add_edge("initialize_state", "load_conversation_history")
    workflow.add_edge("load_conversation_history", "reasoning_agent")
    
    workflow.add_conditional_edges(
        "reasoning_agent",
        should_continue,
        {
            "execute_tools_and_update": "execute_tools_and_update",
            "save_chat": "save_chat",
        }
    )
    
    workflow.add_edge("execute_tools_and_update", "validate_interaction")
    workflow.add_edge("validate_interaction", "reasoning_agent")
    
    workflow.add_edge("save_chat", END)

    # Use checkpointer to persist state across turns in memory!
    checkpointer = MemorySaver()
    return workflow.compile(checkpointer=checkpointer)


agent_app = create_agent_graph()
