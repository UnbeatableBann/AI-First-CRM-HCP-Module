import uuid
import json
from typing import Optional, List, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from app.domains.hcp_workspace.repository import hcp_workspace_repo
from app.domains.hcp.repository import hcp_repo
from app.domains.interaction.models import Interaction
from app.exceptions.base import NotFoundException
from langchain_core.messages import SystemMessage, HumanMessage
from app.langgraph.nodes import llm  # Reuse existing llm instance
from collections import Counter

class HCPWorkspaceService:
    @staticmethod
    async def get_workspace(db: AsyncSession, hcp_id: uuid.UUID) -> dict:
        # Get HCP Profile
        hcp = await hcp_repo.get(db, hcp_id)
        if not hcp:
            raise NotFoundException(f"HCP with ID {hcp_id} not found.")

        profile = {
            "id": hcp.id,
            "name": hcp.name,
            "specialization": getattr(hcp, "specialty", None),
            "hospital": getattr(hcp, "hospital_affiliation", None),
            "city": getattr(hcp, "city", None),
            "created_at": hcp.created_at,
            "updated_at": hcp.updated_at,
        }

        # Get Timeline
        interactions = await hcp_workspace_repo.get_timeline(db, hcp_id)
        timeline = []
        for i in interactions:
            timeline.append({
                "id": i.id,
                "date": i.date,
                "type": getattr(i, "interaction_type", None),
                "summary": getattr(i, "summary", None),
                "products": getattr(i, "topics_discussed", None),
                "sentiment": getattr(i, "sentiment", None),
                "outcome": getattr(i, "outcomes", None)
            })

        # Get Memory
        memory_obj = await hcp_workspace_repo.get_memory(db, hcp_id)
        if memory_obj:
            memory = {
                "communication_style": memory_obj.communication_style,
                "clinical_interests": memory_obj.clinical_interests or [],
                "preferred_products": memory_obj.preferred_products or [],
                "common_objections": memory_obj.common_objections or [],
                "preferred_meeting_time": memory_obj.preferred_meeting_time,
                "favorite_materials": memory_obj.favorite_materials or [],
                "notes": memory_obj.notes
            }
        else:
            memory = {
                "communication_style": None, "clinical_interests": [], 
                "preferred_products": [], "common_objections": [],
                "preferred_meeting_time": None, "favorite_materials": [], "notes": None
            }

        # Generate Overview
        overview = HCPWorkspaceService._generate_overview(interactions)

        # Generate Insights dynamically
        insights = HCPWorkspaceService._generate_insights(interactions, memory)

        return {
            "profile": profile,
            "overview": overview,
            "memory": memory,
            "timeline": timeline,
            "insights": insights
        }

    @staticmethod
    def _generate_overview(interactions: List[Interaction]) -> dict:
        interaction_count = len(interactions)
        last_visit = interactions[0].date if interactions else None
        next_follow_up = None # Simple logic, could extract from follow_up_actions of latest
        
        products_discussed = []
        for i in interactions:
            topics = getattr(i, "topics_discussed", "")
            if topics:
                products_discussed.extend([p.strip() for p in topics.split(",") if p.strip()])
        # get unique products
        products_discussed = list(set(products_discussed))
        
        latest_summary = getattr(interactions[0], "summary", None) if interactions else None

        return {
            "interaction_count": interaction_count,
            "last_visit": last_visit,
            "next_follow_up": next_follow_up,
            "products_discussed": products_discussed,
            "latest_summary": latest_summary
        }

    @staticmethod
    def _generate_insights(interactions: List[Interaction], memory: dict) -> dict:
        if not interactions:
            return {
                "relationship_summary": "No interactions yet.",
                "meeting_frequency": "None",
                "most_discussed_product": "None",
                "overall_sentiment": "Unknown",
                "follow_up_pending": "None",
                "latest_ai_summary": "No data to summarize."
            }
            
        sentiments = [getattr(i, "sentiment", "") for i in interactions if getattr(i, "sentiment", None)]
        overall_sentiment = Counter(sentiments).most_common(1)[0][0] if sentiments else "Neutral"
        
        products = []
        for i in interactions:
            topics = getattr(i, "topics_discussed", "")
            if topics:
                products.extend([p.strip() for p in topics.split(",") if p.strip()])
        most_discussed_product = Counter(products).most_common(1)[0][0] if products else "None"
        
        return {
            "relationship_summary": f"Interacted {len(interactions)} times.",
            "meeting_frequency": "Based on history",
            "most_discussed_product": most_discussed_product,
            "overall_sentiment": overall_sentiment,
            "follow_up_pending": getattr(interactions[0], "follow_up_actions", "None") if interactions else "None",
            "latest_ai_summary": "Generated insights based on interaction frequency."
        }

    @staticmethod
    async def update_hcp_memory_tool(db: AsyncSession, hcp_id: uuid.UUID, interaction_data: dict) -> None:
        # Get existing memory
        memory_obj = await hcp_workspace_repo.get_memory(db, hcp_id)
        current_memory = {}
        if memory_obj:
            current_memory = {
                "communication_style": memory_obj.communication_style,
                "clinical_interests": memory_obj.clinical_interests or [],
                "preferred_products": memory_obj.preferred_products or [],
                "common_objections": memory_obj.common_objections or [],
                "preferred_meeting_time": memory_obj.preferred_meeting_time,
                "favorite_materials": memory_obj.favorite_materials or [],
                "notes": memory_obj.notes
            }

        system_prompt = f"""You are an AI specialized in extracting and maintaining long-term Healthcare Professional (HCP) memory profiles.
Your task is to merge new interaction data with the existing HCP memory.
Never duplicate list items (always merge uniquely). Do not overwrite existing long-term preferences unless the new interaction explicitly indicates a change.

Current Memory:
{json.dumps(current_memory, indent=2)}

New Interaction Data:
{json.dumps(interaction_data, indent=2)}

Return ONLY a JSON object with the updated memory matching this structure exactly (arrays for lists):
{{
  "communication_style": "string or null",
  "clinical_interests": ["string"],
  "preferred_products": ["string"],
  "common_objections": ["string"],
  "preferred_meeting_time": "string or null",
  "favorite_materials": ["string"],
  "notes": "string or null"
}}
Ensure the output starts with ```json and ends with ```
"""
        response = await llm.ainvoke([SystemMessage(content=system_prompt)])
        content = response.content
        import re
        json_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", content, re.DOTALL)
        if json_match:
            try:
                new_memory_data = json.loads(json_match.group(1))
                await hcp_workspace_repo.update_memory(db, hcp_id, new_memory_data)
            except json.JSONDecodeError:
                pass
