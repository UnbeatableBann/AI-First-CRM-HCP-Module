from pydantic_settings import BaseSettings

class KnowledgeSettings(BaseSettings):
    minimum_confidence: float = 0.5
    snapshot_version: str = "v1"
    merge_strategy: str = "conservative"

knowledge_settings = KnowledgeSettings()
