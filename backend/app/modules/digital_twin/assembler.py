from app.modules.digital_twin.schemas import (
    DigitalTwin, TwinIdentity, TwinCommunication, TwinClinicalProfile,
    TwinCommercialProfile, TwinBehavior, TwinRelationship, TwinCommitments,
    TwinTimeline, TwinMetadata
)
from app.modules.knowledge.models import KnowledgeFact
from app.domains.hcp.models import HCP
from typing import List, Dict, Any
from datetime import datetime
import uuid

class DigitalTwinAssembler:
    @staticmethod
    def assemble(hcp_id: uuid.UUID, hcp: HCP, facts: List[KnowledgeFact], snapshot: Dict[str, Any], knowledge_version: str) -> DigitalTwin:
        identity = TwinIdentity(
            name=hcp.name if hcp else "Unknown",
            specialization=hcp.specialization if hcp else "Unknown",
            hospital=hcp.hospital_name if hcp else "Unknown",
            city=hcp.city if hcp else "Unknown",
            hcp_type="Doctor",
            territory="General",
            created_at=hcp.created_at if hcp else datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        communication = TwinCommunication(
            preferred_channel=snapshot.get("communication", {}).get("preferred_channel", ""),
            preferred_time=snapshot.get("communication", {}).get("preferred_time", ""),
            meeting_style=snapshot.get("communication", {}).get("meeting_style", ""),
            communication_style=snapshot.get("communication", {}).get("communication_style", ""),
            preferred_material=snapshot.get("communication", {}).get("preferred_material", ""),
            language=snapshot.get("communication", {}).get("language", "")
        )
        
        clinical_profile = TwinClinicalProfile(
            clinical_interests=snapshot.get("clinical_interests", []),
            recent_topics=snapshot.get("recent_topics", []),
            evidence_preference=snapshot.get("behavior", {}).get("evidence_preference", "")
        )
        
        commercial_profile = TwinCommercialProfile(
            products_discussed=snapshot.get("products", []),
            competitors=snapshot.get("competitors", [])
        )
        
        behavior = TwinBehavior(
            decision_style=snapshot.get("behavior", {}).get("decision_style", ""),
            engagement_style=snapshot.get("behavior", {}).get("engagement_style", ""),
            scientific_depth=snapshot.get("behavior", {}).get("scientific_depth", "")
        )
        
        relationship = TwinRelationship(
            relationship_trend=snapshot.get("relationship_notes", [])
        )
        
        commitments = TwinCommitments(
            pending_actions=snapshot.get("open_commitments", [])
        )
        
        timeline = TwinTimeline()
        
        metadata = TwinMetadata(
            twin_version=f"v{datetime.utcnow().timestamp()}",
            generated_at=datetime.utcnow(),
            knowledge_version=knowledge_version,
            last_updated=datetime.utcnow()
        )
        
        twin = DigitalTwin(
            hcp_id=hcp_id,
            identity=identity,
            communication=communication,
            clinical_profile=clinical_profile,
            commercial_profile=commercial_profile,
            behavior=behavior,
            relationship=relationship,
            commitments=commitments,
            timeline=timeline,
            metadata=metadata
        )
        
        return twin
