import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.repositories.base import BaseRepository
from app.domains.interaction.models import Interaction, ChatMessage

from app.domains.interaction.schemas import InteractionCreate, InteractionUpdate, ChatMessageCreate


class InteractionRepository(BaseRepository[Interaction, InteractionCreate, InteractionUpdate]):
    async def get_history_by_hcp(self, db: AsyncSession, hcp_id: uuid.UUID) -> list[Interaction]:
        result = await db.execute(
            select(Interaction)
            .where(
                Interaction.hcp_id == hcp_id, 
                Interaction.status == "COMPLETED", 
                Interaction.is_deleted.is_(False)
            )
            .order_by(Interaction.date.desc().nullslast(), Interaction.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_drafts(self, db: AsyncSession) -> list[Interaction]:
        result = await db.execute(
            select(Interaction)
            .where(Interaction.status == "DRAFT", Interaction.is_deleted.is_(False))
            .order_by(Interaction.updated_at.desc())
        )
        return list(result.scalars().all())

    async def get_saved_hcps(self, db: AsyncSession):
        from sqlalchemy import func
        from app.domains.hcp.models import HCP
        
        # Join Interactions with HCP, group by HCP, return count and max date
        query = (
            select(
                HCP.id.label("hcp_id"),
                HCP.name.label("hcp_name"),
                func.count(Interaction.id).label("interaction_count"),
                func.max(Interaction.date).label("latest_interaction"),
            )
            .join(Interaction, Interaction.hcp_id == HCP.id)
            .where(Interaction.status == "COMPLETED", Interaction.is_deleted.is_(False))
            .group_by(HCP.id, HCP.name)
            .order_by(func.max(Interaction.date).desc().nullslast())
        )
        result = await db.execute(query)
        return result.all()


interaction_repo = InteractionRepository(Interaction)


class ChatMessageRepository(BaseRepository[ChatMessage, ChatMessageCreate, ChatMessageCreate]):
    async def get_messages_by_interaction(
        self, db: AsyncSession, interaction_id: uuid.UUID, limit: int = 20
    ) -> list[ChatMessage]:
        # To get the last N messages, we can order by desc, limit, then reverse, but for now asc is fine
        # if the total messages rarely exceed 20. Let's do asc limit to simplify.
        result = await db.execute(
            select(ChatMessage)
            .where(ChatMessage.interaction_id == interaction_id)
            .order_by(ChatMessage.created_at.asc())
            .limit(limit)
        )
        return list(result.scalars().all())


chat_repo = ChatMessageRepository(ChatMessage)
