from typing import Dict, Any, List
from langchain_core.prompts import ChatPromptTemplate
import json

from app.modules.knowledge_pipeline.prompts import MEMORY_EXTRACTOR_PROMPT
from app.modules.knowledge_pipeline.schemas import MemoryExtractionResult
from app.llm.factory import LLMFactory

class MemoryExtractor:
    @staticmethod
    async def extract(interaction_text: str, current_snapshot: dict) -> List[Dict[str, Any]]:
        llm = LLMFactory.get_llm().with_structured_output(MemoryExtractionResult)
        prompt = ChatPromptTemplate.from_template(MEMORY_EXTRACTOR_PROMPT)
        
        chain = prompt | llm
        
        result: MemoryExtractionResult = await chain.ainvoke({
            "transcript": interaction_text,
            "snapshot": json.dumps(current_snapshot) if current_snapshot else "{}"
        })
        
        if not result:
            return []
            
        facts = []
        for f in result.facts:
            if f.confidence >= 0.70:
                facts.append(f.model_dump())
        return facts
