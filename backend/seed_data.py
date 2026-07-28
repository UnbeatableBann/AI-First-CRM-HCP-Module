import asyncio
import uuid
import datetime
import random
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

# Mock the environment to allow loading app modules if needed
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.session import async_session_factory
import app.models # IMPORT THIS FIRST to resolve circular imports
from app.domains.hcp.models import HCP
from app.domains.interaction.models import Interaction, ChatMessage
from app.modules.digital_twin.service import DigitalTwinService

async def seed_data():
    async with async_session_factory() as db:
        # Create HCPs
        hcps_data = [
            {
                "name": "Dr. Sarah Chen",
                "specialization": "Cardiology",
                "hospital_name": "Memorial Heart Institute",
                "city": "Boston",
                "notes": "Key Opinion Leader in heart failure management. Very analytical, prefers data-heavy presentations."
            },
            {
                "name": "Dr. Michael Roberts",
                "specialization": "Oncology",
                "hospital_name": "City Cancer Center",
                "city": "New York",
                "notes": "Focuses on breast cancer immunotherapy. Often asks about patient quality of life outcomes."
            },
            {
                "name": "Dr. Elena Rodriguez",
                "specialization": "Neurology",
                "hospital_name": "Westside Neurology Clinic",
                "city": "San Francisco",
                "notes": "Specializes in multiple sclerosis. Prefers quick, 5-minute virtual check-ins."
            },
            {
                "name": "Dr. James Wilson",
                "specialization": "Endocrinology",
                "hospital_name": "Metro General Hospital",
                "city": "Chicago",
                "notes": "Handles large volume of Type 2 Diabetes patients. Very interested in new GLP-1 data."
            },
            {
                "name": "Dr. Emily Taylor",
                "specialization": "Rheumatology",
                "hospital_name": "Joint Health Associates",
                "city": "Denver",
                "notes": "Treats severe rheumatoid arthritis cases. Value-driven and cautious about new biologics."
            }
        ]

        hcp_objs = []
        for data in hcps_data:
            stmt = select(HCP).where(HCP.name == data["name"])
            result = await db.execute(stmt)
            existing_hcp = result.scalar_one_or_none()
            if existing_hcp:
                hcp_objs.append(existing_hcp)
                print(f"HCP already exists: {existing_hcp.name}")
            else:
                new_hcp = HCP(**data)
                db.add(new_hcp)
                await db.flush()
                hcp_objs.append(new_hcp)
                print(f"Created HCP: {new_hcp.name}")

        # Interactions for Dr. Sarah Chen (Cardiology)
        interactions_chen = [
            {
                "hcp_id": hcp_objs[0].id,
                "status": "COMPLETED",
                "interaction_type": "In-Person",
                "date": datetime.date(2026, 6, 15),
                "time": datetime.time(10, 30),
                "attendees": "Dr. Sarah Chen, Head Nurse Amanda",
                "topics_discussed": "New heart failure outcomes data from the ATLAS trial. Efficacy vs standard of care.",
                "materials_shared": "ATLAS Trial Summary deck, Clinical Reprints",
                "samples_distributed": "None",
                "sentiment": "POSITIVE",
                "outcomes": "Dr. Chen agreed the mortality benefit is significant. She will start identifying eligible Class III HF patients.",
                "follow_up_actions": "Send digital copy of the full peer-reviewed ATLAS paper.",
                "summary": "Excellent meeting. She was highly receptive to the data. Expecting 2-3 new patient starts this month.",
                "completed_at": datetime.datetime(2026, 6, 15, 11, 0, tzinfo=datetime.timezone.utc)
            },
            {
                "hcp_id": hcp_objs[0].id,
                "status": "COMPLETED",
                "interaction_type": "Virtual",
                "date": datetime.date(2026, 7, 2),
                "time": datetime.time(14, 0),
                "attendees": "Dr. Sarah Chen",
                "topics_discussed": "Follow up on ATLAS paper. Dosing titration guidelines.",
                "materials_shared": "Dosing Titration Guide (PDF)",
                "samples_distributed": "None",
                "sentiment": "NEUTRAL",
                "outcomes": "Clarified some concerns about hypotensive episodes during up-titration.",
                "follow_up_actions": "Check in next month on her first 2 patient starts.",
                "summary": "Brief 10 minute call. Addressed her safety concerns.",
                "completed_at": datetime.datetime(2026, 7, 2, 14, 15, tzinfo=datetime.timezone.utc)
            }
        ]

        # Interactions for Dr. Michael Roberts (Oncology)
        interactions_roberts = [
            {
                "hcp_id": hcp_objs[1].id,
                "status": "COMPLETED",
                "interaction_type": "Lunch & Learn",
                "date": datetime.date(2026, 7, 10),
                "time": datetime.time(12, 0),
                "attendees": "Dr. Roberts, 3 Fellows",
                "topics_discussed": "First-line combination therapy for metastatic TNBC.",
                "materials_shared": "Patient Profiling Guide",
                "samples_distributed": "None",
                "sentiment": "POSITIVE",
                "outcomes": "Fellows were engaged. Dr. Roberts confirmed he is using the combo as preferred 1st line.",
                "follow_up_actions": "Connect with pharmacy regarding reimbursement hotline.",
                "summary": "Strong advocacy from Dr. Roberts in front of his fellows. Solidified position.",
                "completed_at": datetime.datetime(2026, 7, 10, 13, 0, tzinfo=datetime.timezone.utc)
            }
        ]

        # Interactions for Dr. Elena Rodriguez (Neurology)
        interactions_rodriguez = [
            {
                "hcp_id": hcp_objs[2].id,
                "status": "COMPLETED",
                "interaction_type": "In-Person",
                "date": datetime.date(2026, 6, 28),
                "time": datetime.time(9, 15),
                "attendees": "Dr. Rodriguez",
                "topics_discussed": "B-cell depletion therapies in relapsing MS.",
                "materials_shared": "Safety Profile Update",
                "samples_distributed": "None",
                "sentiment": "NEGATIVE",
                "outcomes": "She had a patient experience severe infusion reactions. Very hesitant to start new patients right now.",
                "follow_up_actions": "Schedule time with our Medical Science Liaison (MSL) to review the safety case.",
                "summary": "Tough call. Need MSL support to rebuild clinical confidence.",
                "completed_at": datetime.datetime(2026, 6, 28, 9, 45, tzinfo=datetime.timezone.utc)
            }
        ]

        # Interactions for Dr. James Wilson (Endocrinology)
        interactions_wilson = [
            {
                "hcp_id": hcp_objs[3].id,
                "status": "COMPLETED",
                "interaction_type": "In-Person",
                "date": datetime.date(2026, 7, 20),
                "time": datetime.time(15, 30),
                "attendees": "Dr. Wilson",
                "topics_discussed": "New GLP-1 weight loss indications for T2D.",
                "materials_shared": "Clinical Trial Efficacy Summary",
                "samples_distributed": "10 Starter Kits",
                "sentiment": "POSITIVE",
                "outcomes": "Very excited about the weight loss data. Requested 10 starter kits for immediate use.",
                "follow_up_actions": "Bring more starter kits next week. Provide patient education materials.",
                "summary": "Huge win. He is shifting share from competitor to our product.",
                "completed_at": datetime.datetime(2026, 7, 20, 16, 0, tzinfo=datetime.timezone.utc)
            }
        ]

        all_interactions = interactions_chen + interactions_roberts + interactions_rodriguez + interactions_wilson

        for data in all_interactions:
            # Check if this exact interaction exists to prevent duplicates on multiple runs
            stmt = select(Interaction).where(
                Interaction.hcp_id == data["hcp_id"],
                Interaction.date == data["date"],
                Interaction.topics_discussed == data["topics_discussed"]
            )
            result = await db.execute(stmt)
            if not result.scalar_one_or_none():
                new_interaction = Interaction(**data)
                db.add(new_interaction)
                print(f"Created interaction for HCP ID: {data['hcp_id']} on {data['date']}")

        await db.commit()
        print("Database seeded with genuine HCP and Interaction data!")
        
        # After inserting, let's trigger rebuilding the digital twins so they have the latest data
        for hcp in hcp_objs:
            try:
                await DigitalTwinService.rebuild_twin(db, hcp.id)
                print(f"Rebuilt Digital Twin for {hcp.name}")
            except Exception as e:
                print(f"Failed to rebuild twin for {hcp.name}: {e}")

if __name__ == "__main__":
    asyncio.run(seed_data())
