from fastapi import APIRouter
from sqlalchemy import text
from redis.asyncio import Redis
from app.database.session import engine
from app.config.settings import settings
import structlog
import asyncio

from app.api.endpoints import agent
from app.domains.interaction import router as interaction_router
from app.domains.hcp import router as hcp_router

logger = structlog.get_logger(__name__)

api_router = APIRouter()

api_router.include_router(agent.router, prefix="/agent", tags=["agent"])
api_router.include_router(interaction_router.router, prefix="/interaction", tags=["interaction"])
api_router.include_router(hcp_router.router, prefix="/hcp", tags=["hcp"])


@api_router.get("/health", tags=["system"])
async def health_check() -> dict[str, str]:
    db_status = "unknown"
    redis_status = "unknown"

    # Check Database
    for attempt in range(settings.HEALTH_CHECK_RETRIES):
        try:
            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            db_status = "healthy"
            break
        except Exception as e:
            if attempt == settings.HEALTH_CHECK_RETRIES - 1:
                logger.error("Database health check failed after retries", error=str(e))
                db_status = "unhealthy"
            else:
                logger.warning(
                    f"Database health check attempt {attempt + 1} failed. Retrying...", error=str(e)
                )
                await asyncio.sleep(1)

    # Check Redis
    for attempt in range(settings.HEALTH_CHECK_RETRIES):
        try:
            redis_client = Redis.from_url(settings.REDIS_URL, socket_connect_timeout=2)
            is_ping_successful = await redis_client.ping()
            await redis_client.aclose()

            if is_ping_successful:
                redis_status = "healthy"
                break
            else:
                redis_status = "unhealthy"
                break
        except Exception as e:
            if attempt == settings.HEALTH_CHECK_RETRIES - 1:
                logger.error("Redis health check failed after retries", error=str(e))
                redis_status = "unhealthy"
            else:
                logger.warning(
                    f"Redis health check attempt {attempt + 1} failed. Retrying...", error=str(e)
                )
                await asyncio.sleep(1)

    status = "success" if db_status == "healthy" and redis_status == "healthy" else "degraded"

    return {"status": status, "database": db_status, "redis": redis_status}
