from dataclasses import dataclass
import uuid

@dataclass
class InteractionSavedEvent:
    interaction_id: uuid.UUID
    hcp_id: uuid.UUID
    content: str

@dataclass
class KnowledgeUpdatedEvent:
    hcp_id: uuid.UUID
    new_facts_count: int

@dataclass
class SnapshotGeneratedEvent:
    hcp_id: uuid.UUID
    version: str

@dataclass
class TwinUpdatedEvent:
    hcp_id: uuid.UUID
    twin_version: str
