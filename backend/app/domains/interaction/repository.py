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
            .where(Interaction.hcp_id == hcp_id)
            .order_by(Interaction.date.desc().nullslast(), Interaction.created_at.desc())
        )
        return list(result.scalars().all())


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
