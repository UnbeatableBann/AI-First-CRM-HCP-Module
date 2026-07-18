import pytest
from unittest.mock import patch, AsyncMock
from langchain_core.messages import AIMessage
from app.langgraph.nodes import intent_detection, planner

pytestmark = pytest.mark.asyncio


@patch("app.langgraph.nodes.llm")
async def test_intent_detection(mock_llm):
    mock_llm.ainvoke = AsyncMock(return_value=AIMessage(content="LogInteractionTool"))

    state = {
        "message": "I met Dr. Smith today and left samples.",
        "chat_history": [],
        "errors": [],
        "warnings": [],
    }

    new_state = await intent_detection(state)
    assert new_state["tool_name"] == "LogInteractionTool"


@patch("app.langgraph.nodes.llm")
async def test_planner(mock_llm):
    mock_llm.ainvoke = AsyncMock(return_value=AIMessage(content='```json\n{"topics_discussed": "test"}\n```'))

    state = {
        "tool_name": "LogInteractionTool",
        "message": "I met Dr. Smith today.",
        "current_draft": {},
        "chat_history": [],
        "errors": [],
        "warnings": [],
    }

    new_state = await planner(state)
    assert new_state["tool_input"]["topics_discussed"] == "test"
