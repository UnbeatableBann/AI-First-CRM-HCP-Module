from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.database.session import get_db
from app.modules.knowledge.schemas import HCPKnowledgeResponse, KnowledgeSnapshotResponse, KnowledgeFactResponse, KnowledgeRelationResponse
from app.modules.knowledge.repository import KnowledgeRepository
from app.schemas.common import APIResponse

router = APIRouter(prefix="/hcp", tags=["Knowledge Engine"])

@router.get("/{hcp_id}/knowledge", response_model=APIResponse[HCPKnowledgeResponse])
async def get_hcp_knowledge(
    hcp_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Returns the compiled snapshot, active facts, and relationships for an HCP.
    This API is for internal HCP Workspace usage.
    """
    snapshot = await KnowledgeRepository.get_snapshot(db, hcp_id)
    facts = await KnowledgeRepository.get_all_facts(db, hcp_id, active_only=True)
    relations = await KnowledgeRepository.get_all_relations(db, hcp_id)

    data = HCPKnowledgeResponse(
        snapshot=KnowledgeSnapshotResponse.model_validate(snapshot) if snapshot else None,
        facts=[KnowledgeFactResponse.model_validate(f) for f in facts],
        relations=[KnowledgeRelationResponse.model_validate(r) for r in relations]
    )
    
    return APIResponse(status="success", message="Knowledge retrieved.", data=data)  # type: ignore
