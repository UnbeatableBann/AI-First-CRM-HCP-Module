from typing import List
import uuid
from typing import Optional, Any
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.domains.interaction.repository import interaction_repo, chat_repo
from app.domains.hcp.repository import hcp_repo
from app.domains.interaction.schemas import ChatMessageCreate
from app.domains.interaction.models import Interaction, ChatMessage
from app.exceptions.base import NotFoundException


class InteractionService:
    @staticmethod
    async def create_draft(db: AsyncSession, hcp_id: Optional[uuid.UUID] = None) -> Interaction:
        interaction_data = {"status": "DRAFT"}
        if hcp_id:
            hcp = await hcp_repo.get(db, hcp_id)
            if not hcp:
                raise NotFoundException(f"HCP with ID {hcp_id} not found.")
            interaction_data["hcp_id"] = str(hcp_id)

        interaction = await interaction_repo.create(db, obj_in=interaction_data)
        return interaction

    @staticmethod
    async def get_interaction(db: AsyncSession, interaction_id: uuid.UUID) -> Interaction:
        interaction = await interaction_repo.get(db, interaction_id)
        if not interaction:
            raise NotFoundException(f"Interaction with ID {interaction_id} not found.")
        return interaction

    @staticmethod
    async def update_interaction(
        db: AsyncSession,
        interaction_id: uuid.UUID,
        interaction_in: dict[str, Any],  # allow dict for PATCH updates directly
    ) -> Interaction:
        interaction = await interaction_repo.get(db, interaction_id)
        if not interaction:
            raise NotFoundException(f"Interaction with ID {interaction_id} not found.")

        updated_interaction = await interaction_repo.update(
            db, db_obj=interaction, obj_in=interaction_in
        )
        return updated_interaction

    @staticmethod
    async def mark_completed(db: AsyncSession, interaction_id: uuid.UUID) -> Interaction:
        interaction = await interaction_repo.get(db, interaction_id)
        if not interaction:
            raise NotFoundException(f"Interaction with ID {interaction_id} not found.")

        updated_interaction = await interaction_repo.update(
            db,
            db_obj=interaction,
            obj_in={"status": "COMPLETED", "completed_at": datetime.now(timezone.utc)},
        )
        return updated_interaction

    @staticmethod
    async def get_hcp_history(db: AsyncSession, hcp_id: uuid.UUID) -> List[Interaction]:
        return await interaction_repo.get_history_by_hcp(db, hcp_id)

    @staticmethod
    async def get_home(db: AsyncSession) -> dict[str, Any]:
        drafts_db = await interaction_repo.get_drafts(db)
        saved_hcps_db = await interaction_repo.get_saved_hcps(db)

        # Format drafts to include hcp_name if available
        # Wait, the HCP relationship is not eager loaded in get_drafts by default if we didn't specify joinedload,
        # but we can fetch them or just let the lazy load happen if using async properly, 
        # actually, let's eager load or just fetch manually.
        # It's better to fetch hcp for each draft if hcp_id is present.
        drafts_res = []
        for d in drafts_db:
            hcp_name = None
            if d.hcp_id:
                hcp = await hcp_repo.get(db, d.hcp_id)
                if hcp:
                    hcp_name = hcp.name
            drafts_res.append({
                "id": d.id,
                "hcp_name": hcp_name,
                "updated_at": d.updated_at,
                "status": d.status
            })

        saved_hcps_res = [
            {
                "hcp_id": row.hcp_id,
                "hcp_name": row.hcp_name,
                "interaction_count": row.interaction_count,
                "latest_interaction": row.latest_interaction,
            }
            for row in saved_hcps_db
        ]

        return {
            "drafts": drafts_res,
            "saved_hcps": saved_hcps_res,
        }

    @staticmethod
    async def delete_interaction(db: AsyncSession, interaction_id: uuid.UUID) -> None:
        await interaction_repo.remove(db, id=interaction_id)

    @staticmethod
    async def add_chat_message(
        db: AsyncSession, interaction_id: uuid.UUID, msg_in: ChatMessageCreate
    ) -> ChatMessage:
        return await chat_repo.create(
            db, obj_in={**msg_in.model_dump(), "interaction_id": interaction_id}
        )

    @staticmethod
    async def get_chat_history(db: AsyncSession, interaction_id: uuid.UUID) -> List[ChatMessage]:
        return await chat_repo.get_messages_by_interaction(db, interaction_id)
