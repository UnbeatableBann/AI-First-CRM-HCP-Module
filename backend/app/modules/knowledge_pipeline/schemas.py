from pydantic import BaseModel, Field
from typing import List

class MemoryFactExtraction(BaseModel):
    category: str = Field(description="Must be one of COMMUNICATION, BEHAVIOR, RELATIONSHIP, CLINICAL, COMMERCIAL, PREFERENCE, FOLLOWUP")
    attribute: str
    value: str
    confidence: float = Field(ge=0.0, le=1.0)
    evidence: str
    reasoning: str

class MemoryExtractionResult(BaseModel):
    facts: List[MemoryFactExtraction]
