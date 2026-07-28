import asyncio
import sys
import os

sys.path.insert(0, os.path.abspath('.'))

from app.database.session import async_session_factory
from app.domains.interaction.service import InteractionService

async def test():
    async with async_session_factory() as db:
        res = await InteractionService.get_all_interactions(db)
        print(f"Got {len(res)} interactions")

if __name__ == '__main__':
    asyncio.run(test())
