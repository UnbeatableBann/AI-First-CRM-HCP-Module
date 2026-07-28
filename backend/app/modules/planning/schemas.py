from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

class EvidenceRecommendation(BaseModel):
    recommendation: str
    confidence: float = Field(ge=0.0, le=1.0)
    evidence: str

class ObjectivePlannerOutput(BaseModel):
    primary_objective: EvidenceRecommendation
    secondary_objectives: List[EvidenceRecommendation] = Field(default_factory=list)
    avoid_topics: List[EvidenceRecommendation] = Field(default_factory=list)
    expected_duration: str

class StrategyPlannerOutput(BaseModel):
    suggested_opening: EvidenceRecommendation
    likely_questions: List[EvidenceRecommendation] = Field(default_factory=list)
    likely_objections: List[EvidenceRecommendation] = Field(default_factory=list)
    recommended_flow: List[EvidenceRecommendation] = Field(default_factory=list)
    questions_to_ask: List[EvidenceRecommendation] = Field(default_factory=list)

class RiskAnalyzerOutput(BaseModel):
    risks: List[EvidenceRecommendation] = Field(default_factory=list)

class LiteraturePlannerOutput(BaseModel):
    recommended_materials: List[EvidenceRecommendation] = Field(default_factory=list)

class MeetingBrief(BaseModel):
    summary: str
    objectives: ObjectivePlannerOutput
    strategy: StrategyPlannerOutput
    conversation: List[EvidenceRecommendation] = Field(default_factory=list)
    risks: List[EvidenceRecommendation] = Field(default_factory=list)
    commitments: List[EvidenceRecommendation] = Field(default_factory=list)
    literature: List[EvidenceRecommendation] = Field(default_factory=list)
    expected_outcome: str
    confidence: float
    generated_at: datetime
    digital_twin_version: str
