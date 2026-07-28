from abc import ABC, abstractmethod
from typing import List, Dict, Any

class KnowledgeExtractor(ABC):
    @abstractmethod
    def extract(self, interaction_data: str) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def merge(self, new_facts: List[Dict[str, Any]], existing_facts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def validate(self, facts: List[Dict[str, Any]]) -> bool:
        pass
