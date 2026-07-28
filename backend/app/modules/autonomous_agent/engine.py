from langgraph.prebuilt import create_react_agent
from app.llm.factory import LLMFactory
from app.modules.autonomous_agent.tools import get_autonomous_tools

def build_execution_engine():
    llm = LLMFactory.get_llm()
    tools = get_autonomous_tools()
    
    system_prompt = """You are the Autonomous Execution Agent for Curis. 
You execute approved actions on behalf of the pharmaceutical representative.
You have access to tools to schedule meetings, send literature, and update commitments.
1. Reason about the action requested.
2. Execute the required tools to fulfill the action.
3. Once done, provide a concise, professional summary of what you did (e.g. 'I have scheduled the meeting and sent the literature.').
Do NOT ask the user for confirmation. The action has already been approved by the user."""
    
    return create_react_agent(llm, tools, prompt=system_prompt)

execution_agent = build_execution_engine()
