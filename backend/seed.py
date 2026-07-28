import asyncio
import uuid
import json
from datetime import datetime, date, time, timezone

from app.database.session import async_session_factory
from app.domains.hcp.models import HCP
from app.domains.interaction.models import Interaction, ChatMessage
from app.modules.knowledge.models import KnowledgeFact
from app.modules.knowledge.enums import FactCategory, FactStatus, FactSource
from app.domains.hcp_workspace.models import HCPMemory
from sqlalchemy.orm import selectinload
from sqlalchemy import text

async def seed_data():
    async with async_session_factory() as session:
        # Clear existing
        await session.execute(text("TRUNCATE TABLE chat_messages CASCADE;"))
        await session.execute(text("TRUNCATE TABLE interactions CASCADE;"))
        await session.execute(text("TRUNCATE TABLE knowledge_facts CASCADE;"))
        await session.execute(text("TRUNCATE TABLE hcp_memory CASCADE;"))
        await session.execute(text("TRUNCATE TABLE hcps CASCADE;"))
        
        # 1. Create HCPs
        hcp1 = HCP(
            id=uuid.uuid4(),
            name="Dr. Sarah Jenkins",
            specialization="Cardiology",
            hospital_name="Mercy General Hospital",
            city="New York",
            notes="Key opinion leader in hypertension."
        )
        hcp2 = HCP(
            id=uuid.uuid4(),
            name="Dr. Rahul Sharma",
            specialization="Endocrinology",
            hospital_name="Apollo Medical Center",
            city="San Francisco",
            notes="Interested in new diabetes treatments."
        )
        hcp3 = HCP(
            id=uuid.uuid4(),
            name="Dr. Emily Chen",
            specialization="Neurology",
            hospital_name="City Central",
            city="Chicago",
            notes="Prefers email communication."
        )
        
        session.add_all([hcp1, hcp2, hcp3])
        await session.commit()
        
        # 2. Interactions (Completed & Drafts)
        interaction1 = Interaction(
            id=uuid.uuid4(),
            hcp_id=hcp1.id,
            status="COMPLETED",
            interaction_type="In-Person Meeting",
            date=date(2026, 7, 10),
            time=time(14, 30),
            attendees="Dr. Sarah Jenkins, Sales Rep",
            topics_discussed="New guidelines for hypertension.",
            materials_shared="Hypertension clinical study 2026",
            sentiment="POSITIVE",
            outcomes="Dr. Jenkins agreed to try the new drug on 5 patients.",
            follow_up_actions="Send samples by next week.",
            summary="A very productive meeting discussing the latest clinical study.",
            completed_at=datetime.now(timezone.utc)
        )
        
        interaction2 = Interaction(
            id=uuid.uuid4(),
            hcp_id=hcp2.id,
            status="DRAFT", # This serves as a "draft"
            interaction_type="Email",
            date=date(2026, 7, 29),
            time=time(10, 0),
            topics_discussed="Follow up on obesity study.",
            sentiment="NEUTRAL"
        )
        
        interaction3 = Interaction(
            id=uuid.uuid4(),
            hcp_id=hcp3.id,
            status="COMPLETED",
            interaction_type="Virtual Call",
            date=date(2026, 6, 15),
            topics_discussed="New migraine treatment options.",
            sentiment="POSITIVE",
            summary="Dr. Chen is very interested in the new drug.",
            completed_at=datetime.now(timezone.utc)
        )
        
        session.add_all([interaction1, interaction2, interaction3])
        
        # Add chat messages for interaction 2 (Draft)
        msg1 = ChatMessage(id=uuid.uuid4(), interaction_id=interaction2.id, role="USER", content="Schedule a visit with Dr. Rahul.")
        msg2 = ChatMessage(id=uuid.uuid4(), interaction_id=interaction2.id, role="ASSISTANT", content="Would you like me to book a visit with Dr. Rahul and send the obesity study?")
        session.add_all([msg1, msg2])
        
        # 3. HCP Memory (Workspace)
        mem1 = HCPMemory(
            id=uuid.uuid4(),
            hcp_id=hcp1.id,
            communication_style="Direct and data-driven.",
            clinical_interests=["Hypertension", "Heart Failure"],
            preferred_products=["CardioDrug A", "CardioDrug B"],
            common_objections=["Price is too high"],
            preferred_meeting_time="Tuesday afternoons"
        )
        mem2 = HCPMemory(
            id=uuid.uuid4(),
            hcp_id=hcp2.id,
            communication_style="Prefers detailed case studies.",
            clinical_interests=["Type 2 Diabetes", "Obesity"],
            preferred_products=["EndoDrug X"],
            preferred_meeting_time="Friday mornings"
        )
        session.add_all([mem1, mem2])
        
        # 4. Knowledge Facts (for Knowledge Base)
        fact1 = KnowledgeFact(
            id=uuid.uuid4(),
            hcp_id=hcp1.id,
            category=FactCategory.PREFERENCE,
            attribute="Communication Preference",
            value="In-person meetings",
            confidence=0.9,
            source=FactSource.INTERACTION
        )
        fact2 = KnowledgeFact(
            id=uuid.uuid4(),
            hcp_id=hcp2.id,
            category=FactCategory.COMMERCIAL,
            attribute="Concern",
            value="Side effects profile of EndoDrug X",
            confidence=0.8,
            source=FactSource.INTERACTION
        )
        fact3 = KnowledgeFact(
            id=uuid.uuid4(),
            hcp_id=hcp1.id,
            category=FactCategory.CLINICAL,
            attribute="Interest",
            value="Advanced Hypertension Management",
            confidence=0.95,
            source=FactSource.INTERACTION
        )
        
        session.add_all([fact1, fact2, fact3])
        
        await session.commit()
        
        print("Database seeded successfully with HCPs, Interactions, Drafts, and Knowledge Facts!")

if __name__ == "__main__":
    asyncio.run(seed_data())
