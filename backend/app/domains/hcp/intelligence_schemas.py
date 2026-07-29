from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime

class IntelligenceEvidence(BaseModel):
    confidence: float
    last_confirmed: Optional[datetime] = None
    interaction_ids: List[str] = Field(default_factory=list)
    excerpts: List[str] = Field(default_factory=list)

class IntelligenceItem(BaseModel):
    value: str
    evidence_count: int = 0
    confidence: float = 0.0
    evidence: Optional[IntelligenceEvidence] = None

class ClinicalIntelligenceItem(IntelligenceItem):
    trend: str = "stable"  # increasing, decreasing, stable
    last_confirmed: Optional[datetime] = None

class Playbook(BaseModel):
    best_approach: IntelligenceItem
    ideal_conversation_style: IntelligenceItem
    best_opening: IntelligenceItem
    topics_to_avoid: List[IntelligenceItem] = Field(default_factory=list)
    recommended_scientific_depth: IntelligenceItem
    typical_meeting_duration: IntelligenceItem
    communication_preference: IntelligenceItem
    reminders: List[IntelligenceItem] = Field(default_factory=list)

class DecisionDNA(BaseModel):
    influences: List[IntelligenceItem] = Field(default_factory=list)
    clinical_evidence_weight: IntelligenceItem
    peer_recommendations_weight: IntelligenceItem
    guidelines_weight: IntelligenceItem
    pricing_sensitivity: IntelligenceItem
    innovation_interest: IntelligenceItem
    adoption_speed: IntelligenceItem
    risk_tolerance: IntelligenceItem
    strengths: List[str] = Field(default_factory=list)
    uncertainties: List[str] = Field(default_factory=list)

class ClinicalIntelligence(BaseModel):
    clinical_interests: List[ClinicalIntelligenceItem] = Field(default_factory=list)
    emerging_interests: List[ClinicalIntelligenceItem] = Field(default_factory=list)
    declining_interests: List[ClinicalIntelligenceItem] = Field(default_factory=list)
    frequent_diseases: List[ClinicalIntelligenceItem] = Field(default_factory=list)
    frequent_therapies: List[ClinicalIntelligenceItem] = Field(default_factory=list)
    products_discussed: List[ClinicalIntelligenceItem] = Field(default_factory=list)
    competitors_discussed: List[ClinicalIntelligenceItem] = Field(default_factory=list)

class RelationshipIntelligence(BaseModel):
    relationship_evolution: str = ""
    trust_signals: List[str] = Field(default_factory=list)
    engagement_trend: str = ""
    meeting_consistency: str = ""
    followup_completion: str = ""
    commitment_reliability: str = ""
    recent_milestones: List[str] = Field(default_factory=list)
    rep_observations: List[str] = Field(default_factory=list)

class ConversationIntelligence(BaseModel):
    productive_topics: List[str] = Field(default_factory=list)
    avoided_topics: List[str] = Field(default_factory=list)
    frequent_questions: List[str] = Field(default_factory=list)
    typical_objections: List[str] = Field(default_factory=list)
    conversation_flow: str = ""
    preferred_sequence: str = ""
    best_opener: str = ""
    worst_opener: str = ""
    rep_tips: List[str] = Field(default_factory=list)

class KnowledgeGap(BaseModel):
    topic: str
    importance: str  # high, medium, low
    reason: str
    suggested_question: str

class Contradiction(BaseModel):
    conflict: str
    evidence: str
    recommendation: str

class OpportunitySignal(BaseModel):
    signal_type: str
    description: str
    reasoning: str

class Coaching(BaseModel):
    previous_mistakes: List[str] = Field(default_factory=list)
    missed_commitments: List[str] = Field(default_factory=list)
    conversation_improvements: List[str] = Field(default_factory=list)
    unanswered_questions: List[str] = Field(default_factory=list)
    next_meeting_suggestions: List[str] = Field(default_factory=list)
    rep_strengths: List[str] = Field(default_factory=list)

class FutureExpectations(BaseModel):
    likely_topics: List[str] = Field(default_factory=list)
    likely_questions: List[str] = Field(default_factory=list)
    recommended_literature: List[str] = Field(default_factory=list)
    likely_products: List[str] = Field(default_factory=list)
    potential_objections: List[str] = Field(default_factory=list)

class TimelineEvent(BaseModel):
    date: datetime
    action: str
    description: str
    previous_value: Optional[str] = None
    new_value: Optional[str] = None

class IntelligenceHeader(BaseModel):
    hcp_name: str
    specialization: str
    hospital: str
    last_updated: datetime
    digital_twin_version: str
    knowledge_confidence: float
    interaction_count: int

class CurisIntelligence(BaseModel):
    header: IntelligenceHeader
    playbook: Playbook
    decision_dna: DecisionDNA
    clinical_intelligence: ClinicalIntelligence
    relationship_intelligence: RelationshipIntelligence
    conversation_intelligence: ConversationIntelligence
    knowledge_gaps: List[KnowledgeGap] = Field(default_factory=list)
    contradictions: List[Contradiction] = Field(default_factory=list)
    opportunities: List[OpportunitySignal] = Field(default_factory=list)
    coaching: Coaching
    predictions: FutureExpectations
    timeline: List[TimelineEvent] = Field(default_factory=list)
