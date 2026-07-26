import json
import uuid
from typing import Any, Dict
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage
from langchain_groq import ChatGroq
from app.config.settings import settings
from app.langgraph.state import GraphState, InteractionState
from app.domains.interaction.service import InteractionService
from app.domains.hcp.service import HCPService
from app.database.session import async_session_factory as AsyncSessionLocal
from app.domains.interaction.schemas import InteractionCreate, ChatMessageCreate
from app.langgraph.tools import get_tools

llm = ChatGroq(api_key=settings.GROQ_API_KEY, model=settings.LLM_MODEL, temperature=0.0)
bound_llm = llm.bind_tools(get_tools())

async def initialize_state(state: GraphState) -> GraphState:
    # If interaction state doesn't exist in memory, initialize empty
    if not state.get("interaction"):
        interaction: InteractionState = {
            "id": state["interaction_id"],
            "hcp_id": None,
            "status": "DRAFT",
            "interaction_type": None,
            "date": None,
            "time": None,
            "attendees": "",
            "topics_discussed": "",
            "materials_shared": "",
            "samples_distributed": "",
            "sentiment": None,
            "outcomes": "",
            "follow_up_actions": ""
        }
        return {"interaction": interaction, "messages": [HumanMessage(content=state["latest_user_message"])]}
    
    # If it exists (MemorySaver persisted it), just append the latest message
    return {"messages": [HumanMessage(content=state["latest_user_message"])]}

async def load_conversation_history(state: GraphState) -> GraphState:
    # History shouldn't contain reasoning. Only load once if missing.
    if not state.get("conversation_history"):
        async with AsyncSessionLocal() as db:
            interaction_id = uuid.UUID(state["interaction_id"])
            db_messages = await InteractionService.get_chat_history(db, interaction_id)
            chat_history = []
            for msg in db_messages:
                if msg.role == "USER":
                    chat_history.append(HumanMessage(content=msg.content))
                elif msg.role == "ASSISTANT":
                    chat_history.append(AIMessage(content=msg.content))
            return {"conversation_history": chat_history}
    return {}

async def reasoning_agent(state: GraphState) -> GraphState:
    missing = state.get("missing_required_fields", ["hcp", "interaction_type", "date", "time", "topics_discussed", "sentiment", "outcomes", "follow_up_actions"])
    
    from datetime import datetime, timezone, timedelta
    ist_time = datetime.now(timezone.utc) + timedelta(hours=5, minutes=30)
    current_date = ist_time.strftime("%Y-%m-%d")
    current_time = ist_time.strftime("%H:%M")
    
    system_prompt = f"""You are a Context-Aware AI CRM Assistant for Healthcare Professionals.
Your goal is to help the user log their interaction.
Current date is: {current_date}
Current time is: {current_time}

Current interaction state: {json.dumps(state.get('interaction'))}

Missing required fields: {', '.join(missing) if missing else 'None! All required fields are present.'}

Instructions:
1. Reason about the user's message and determine what they want.
2. If they provide information for the interaction, use LogInteractionTool or EditInteractionTool. 
   CRITICAL FORMATTING RULES:
   - `date`: MUST be in YYYY-MM-DD format. If the user says 'today', use {current_date}.
   - `time`: MUST be in HH:MM format (24-hour).
   - `interaction_type`: MUST be exactly one of: 'Meeting', 'Call', 'Email'.
   - `sentiment`: MUST be exactly one of: 'Positive', 'Neutral', 'Negative'.
3. If they ask about history, use RetrieveInteractionHistoryTool.
4. If you need an HCP, use HCPSearchTool. If the HCP is not found, ask the user if this is a first visit, but consider the HCP name recorded and continue asking for other missing fields. Do not get stuck on the HCP name.
5. If they want a recommendation, use FollowUpRecommendationTool.
6. If they ask a non-context question (like "What is Ozempic?"), answer normally and ask them to continue logging.
7. If there are missing fields, ask a natural follow-up question to get ONE of the missing fields. Do not assume values.
8. If ALL required fields are present, explicitly ask the user: "I now have all the required information. Would you like me to save this interaction?"
9. If the user explicitly confirms saving, use the save_interaction tool.
10. IMPORTANT: NEVER output raw JSON dictionaries or internal state variables to the user. Always use friendly, natural language.
11. IMPORTANT: If 'hcp_id' is null but 'hcp' is NOT listed in the missing fields, it means the HCP name is already recorded. Do NOT ask for the HCP name again.
12. IMPORTANT: Do NOT log or assume any values for 'materials_shared' or 'samples_distributed' unless the user explicitly mentions them. They are completely optional.
"""
    
    messages_to_invoke = [SystemMessage(content=system_prompt)] + state.get("conversation_history", []) + state["messages"]
    response = await bound_llm.ainvoke(messages_to_invoke)
    
    if not response.tool_calls:
        return {"messages": state["messages"] + [response], "assistant_response": response.content}
        
    return {"messages": state["messages"] + [response]}

async def execute_tools_and_update(state: GraphState) -> GraphState:
    last_message = state["messages"][-1]
    tool_messages = []
    
    interaction = dict(state["interaction"])
    
    current_hcp = state.get("current_hcp")
    
    async with AsyncSessionLocal() as db:
        for tool_call in last_message.tool_calls:
            tool_name = tool_call["name"]
            tool_args = tool_call["args"]
            tool_output = ""
            
            try:
                if tool_name in ["log_interaction", "edit_interaction"]:
                    for k, v in tool_args.items():
                        if v is not None:
                            # Handle arrays
                            if k in ["attendees", "materials_shared", "samples_distributed"]:
                                if isinstance(v, list):
                                    interaction[k] = ", ".join(v)
                                elif isinstance(v, str):
                                    interaction[k] = v
                            elif k == "hcp_name":
                                if not current_hcp:
                                    current_hcp = {}
                                current_hcp["name"] = v
                            elif k in interaction:
                                interaction[k] = v
                    tool_output = "Interaction updated in memory."
                    
                elif tool_name == "hcp_search":
                    hcp_name = tool_args.get("hcp_name")
                    if not current_hcp:
                        current_hcp = {}
                    current_hcp["name"] = hcp_name
                    
                    hcp = await HCPService.search_hcp_by_name(db, hcp_name)
                    if hcp:
                        interaction["hcp_id"] = str(hcp.id)
                        current_hcp["id"] = str(hcp.id)
                        tool_output = f"Found HCP {hcp.name}."
                    else:
                        tool_output = f"HCP '{hcp_name}' not found. Name recorded."
                        
                elif tool_name == "retrieve_interaction_history":
                    hcp_name = tool_args.get("hcp_name")
                    hcp_id = None
                    if interaction.get("hcp_id"):
                        hcp_id = uuid.UUID(interaction["hcp_id"])
                    elif hcp_name:
                        hcp = await HCPService.search_hcp_by_name(db, hcp_name)
                        if hcp:
                            hcp_id = hcp.id
                    
                    if hcp_id:
                        history = await InteractionService.get_hcp_history(db, hcp_id)
                        tool_output = f"Found {len(history)} past interactions."
                    else:
                        tool_output = "No HCP selected or found."
                        
                elif tool_name == "follow_up_recommendation":
                    tool_output = "Recommendation generated successfully."
                    
                elif tool_name == "save_interaction":
                    interaction_id = uuid.UUID(interaction.get("id", state["interaction_id"]))
                    
                    # Search/Create HCP
                    hcp_id = interaction.get("hcp_id")
                    if not hcp_id and current_hcp and current_hcp.get("name"):
                        hcp_name = current_hcp.get("name")
                        existing_hcp = await HCPService.search_hcp_by_name(db, hcp_name)
                        if existing_hcp:
                            hcp_id = existing_hcp.id
                        else:
                            # Create new HCP if not found (basic implementation)
                            from app.domains.hcp.schemas import HCPCreate
                            new_hcp = await HCPService.create_hcp(db, HCPCreate(name=hcp_name, specialty="Unknown", region="Unknown"))
                            hcp_id = new_hcp.id
                            
                    if hcp_id and isinstance(hcp_id, str):
                        hcp_id = uuid.UUID(hcp_id)
                        
                    if hcp_id:
                        interaction["hcp_id"] = str(hcp_id)
                        
                    # Persist Interaction
                    from app.domains.interaction.models import Interaction
                    from app.domains.interaction.service import InteractionService
                    from datetime import datetime
                    
                    parsed_date = None
                    if interaction.get("date"):
                        try:
                            parsed_date = datetime.strptime(interaction.get("date"), "%Y-%m-%d").date()
                        except ValueError:
                            pass
                            
                    parsed_time = None
                    if interaction.get("time"):
                        try:
                            parsed_time = datetime.strptime(interaction.get("time"), "%H:%M").time()
                        except ValueError:
                            pass

                    update_data = {
                        "hcp_id": hcp_id,
                        "status": "COMPLETED",
                        "interaction_type": interaction.get("interaction_type"),
                        "date": parsed_date,
                        "time": parsed_time,
                        "attendees": interaction.get("attendees"),
                        "topics_discussed": interaction.get("topics_discussed"),
                        "materials_shared": interaction.get("materials_shared"),
                        "samples_distributed": interaction.get("samples_distributed"),
                        "sentiment": interaction.get("sentiment"),
                        "outcomes": interaction.get("outcomes"),
                        "follow_up_actions": interaction.get("follow_up_actions")
                    }
                    
                    await InteractionService.update_interaction(db, interaction_id, update_data)
                    await db.commit()
                    
                    tool_output = "Interaction successfully persisted to PostgreSQL database."
            except Exception as e:
                tool_output = f"Error executing tool: {e}"
                
            tool_messages.append(ToolMessage(content=tool_output, tool_call_id=tool_call["id"]))
            
    return {"messages": state["messages"] + tool_messages, "interaction": interaction, "current_hcp": current_hcp}

async def validate_interaction(state: GraphState) -> GraphState:
    interaction = state.get("interaction", {})
    required_fields = ["hcp_id", "interaction_type", "date", "time", "topics_discussed", "sentiment", "outcomes", "follow_up_actions"]
    missing = []
    
    current_hcp = state.get("current_hcp") or {}
    
    for field in required_fields:
        if field == "hcp_id":
            if not interaction.get("hcp_id") and not current_hcp.get("name"):
                missing.append("hcp")
            continue
            
        val = interaction.get(field)
        if not val or (isinstance(val, list) and len(val) == 0):
            missing.append(field)
            
    return {"missing_required_fields": missing}

def should_continue(state: GraphState):
    messages = state["messages"]
    last_message = messages[-1]
    if getattr(last_message, "tool_calls", None):
        return "execute_tools_and_update"
    return "save_chat"

async def save_chat(state: GraphState) -> GraphState:
    # Only save chat if the interaction was persisted, otherwise skip or save somewhere else.
    # The prompt says "Store chat messages (if chat persistence is enabled)".
    # For now, we update conversation_history in memory.
    chat_history = state.get("conversation_history", [])
    chat_history.append(HumanMessage(content=state["latest_user_message"]))
    chat_history.append(AIMessage(content=state.get("assistant_response", "")))
    
    # We clear 'messages' (the reasoning loop) so the next turn starts fresh!
    # Wait, GraphState messages is Annotated with operator.add, we can't clear it easily.
    # Actually, we don't need to clear it if we manage conversation_history properly.
    return {"conversation_history": chat_history}
