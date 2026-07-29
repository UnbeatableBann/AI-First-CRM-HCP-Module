from sqlalchemy.ext.asyncio import AsyncSession
import uuid
import logging
from datetime import datetime, timezone
from typing import Optional

from app.modules.digital_twin.service import DigitalTwinService
from app.modules.digital_twin.schemas import DigitalTwin
from app.domains.hcp.intelligence_schemas import (
    CurisIntelligence, IntelligenceHeader, Playbook, DecisionDNA, 
    ClinicalIntelligence, RelationshipIntelligence, ConversationIntelligence,
    Coaching, FutureExpectations, IntelligenceItem, ClinicalIntelligenceItem,
    KnowledgeGap
)
from app.domains.hcp.repository import hcp_repo

logger = logging.getLogger(__name__)

class IntelligenceService:
    @staticmethod
    async def get_intelligence(db: AsyncSession, hcp_id: uuid.UUID) -> Optional[CurisIntelligence]:
        hcp = await hcp_repo.get(db, hcp_id)
        if not hcp:
            return None
            
        twin = await DigitalTwinService.get_twin(db, hcp_id)
        if not twin:
            # If no twin exists, try to rebuild it
            twin = await DigitalTwinService.rebuild_twin(db, hcp_id)
            if not twin:
                return None

        # Build Playbook
        playbook = Playbook(
            best_approach=IntelligenceItem(value=twin.behavior.engagement_style or "Unknown", confidence=0.7),
            ideal_conversation_style=IntelligenceItem(value=twin.communication.communication_style or "Unknown", confidence=0.8),
            best_opening=IntelligenceItem(value="Discuss recent " + (twin.clinical_profile.clinical_interests[0] if twin.clinical_profile.clinical_interests else "topics"), confidence=0.6),
            recommended_scientific_depth=IntelligenceItem(value=twin.behavior.scientific_depth or "Moderate", confidence=0.8),
            typical_meeting_duration=IntelligenceItem(value=twin.communication.preferred_time or "15 mins", confidence=0.6),
            communication_preference=IntelligenceItem(value=twin.communication.preferred_channel or "Unknown", confidence=0.9)
        )
        
        if not twin.communication.preferred_channel:
            playbook.reminders.append(IntelligenceItem(value="Ask about preferred communication channel.", confidence=1.0))

        # Build Decision DNA
        decision_dna = DecisionDNA(
            clinical_evidence_weight=IntelligenceItem(value="High" if "Data" in twin.behavior.decision_style else "Medium", confidence=0.8),
            peer_recommendations_weight=IntelligenceItem(value="Medium", confidence=0.5),
            guidelines_weight=IntelligenceItem(value="High", confidence=0.6),
            pricing_sensitivity=IntelligenceItem(value="Unknown", confidence=0.0),
            innovation_interest=IntelligenceItem(value="Early Adopter" if "Innovation" in twin.behavior.decision_style else "Moderate", confidence=0.6),
            adoption_speed=IntelligenceItem(value="Moderate", confidence=0.5),
            risk_tolerance=IntelligenceItem(value="Moderate", confidence=0.5),
            strengths=[],
            uncertainties=["Not enough data on pricing sensitivity"]
        )

        # Build Clinical Intelligence
        clinical_intelligence = ClinicalIntelligence(
            clinical_interests=[ClinicalIntelligenceItem(value=interest, confidence=0.8) for interest in twin.clinical_profile.clinical_interests],
            frequent_diseases=[ClinicalIntelligenceItem(value=disease, confidence=0.7) for disease in twin.clinical_profile.disease_focus],
            products_discussed=[ClinicalIntelligenceItem(value=prod, confidence=0.9) for prod in twin.commercial_profile.products_discussed],
            competitors_discussed=[ClinicalIntelligenceItem(value=comp, confidence=0.8) for comp in twin.commercial_profile.competitors]
        )

        # Build Relationship Intelligence
        relationship_intelligence = RelationshipIntelligence(
            relationship_evolution="Developing" if twin.relationship.interaction_count > 0 else "New",
            trust_signals=twin.relationship.trust_signals,
            engagement_trend="Stable",
            meeting_consistency="Unknown",
            followup_completion="Unknown",
            commitment_reliability="Unknown",
            recent_milestones=twin.timeline.major_milestones,
            rep_observations=[]
        )

        # Build Conversation Intelligence
        conversation_intelligence = ConversationIntelligence(
            productive_topics=twin.clinical_profile.recent_topics,
            avoided_topics=[],
            frequent_questions=[twin.behavior.question_frequency] if twin.behavior.question_frequency else [],
            typical_objections=twin.behavior.common_objections,
            conversation_flow="Unknown",
            preferred_sequence="Clinical Data -> Guidelines -> Application",
            best_opener="Acknowledge recent publications" if twin.clinical_profile.publications_discussed else "Ask about current challenges",
            worst_opener="Pushing products immediately",
            rep_tips=[]
        )
        
        # Knowledge Gaps
        gaps = []
        if not twin.communication.preferred_time:
            gaps.append(KnowledgeGap(
                topic="Meeting Preference",
                importance="High",
                reason="No preferred meeting time logged.",
                suggested_question="What time of day generally works best for a brief discussion?"
            ))

        if not twin.clinical_profile.clinical_interests:
            gaps.append(KnowledgeGap(
                topic="Clinical Focus",
                importance="High",
                reason="Insufficient data on primary clinical interests.",
                suggested_question="Are there specific therapeutic areas you are currently prioritizing?"
            ))

        # Header
        header = IntelligenceHeader(
            hcp_name=hcp.name,
            specialization=hcp.specialization or "Specialist",
            hospital=hcp.hospital_name or "Hospital",
            last_updated=twin.metadata.last_updated,
            digital_twin_version=twin.metadata.twin_version,
            knowledge_confidence=0.75,
            interaction_count=twin.relationship.interaction_count
        )
        
        coaching = Coaching(
            previous_mistakes=[],
            missed_commitments=[],
            conversation_improvements=[],
            unanswered_questions=[],
            next_meeting_suggestions=["Verify meeting preferences.", "Probe deeper on clinical interests."],
            rep_strengths=[]
        )
        
        predictions = FutureExpectations(
            likely_topics=twin.clinical_profile.recent_topics[:3] if twin.clinical_profile.recent_topics else [],
            likely_questions=[],
            recommended_literature=[],
            likely_products=twin.commercial_profile.products_discussed[:2] if twin.commercial_profile.products_discussed else [],
            potential_objections=twin.behavior.common_objections[:2] if twin.behavior.common_objections else []
        )

        return CurisIntelligence(
            header=header,
            playbook=playbook,
            decision_dna=decision_dna,
            clinical_intelligence=clinical_intelligence,
            relationship_intelligence=relationship_intelligence,
            conversation_intelligence=conversation_intelligence,
            knowledge_gaps=gaps,
            coaching=coaching,
            predictions=predictions
        )
