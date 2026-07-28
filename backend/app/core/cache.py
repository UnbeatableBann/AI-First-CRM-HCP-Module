import json
import logging
from typing import Callable, Any
from functools import wraps
from redis.asyncio import Redis, ConnectionPool
from fastapi import Request
from app.config.settings import settings

logger = logging.getLogger(__name__)

redis_pool = ConnectionPool.from_url(settings.REDIS_URL, decode_responses=True)

def get_redis_client() -> Redis:
    return Redis(connection_pool=redis_pool)

def cache_response(expire_seconds: int = 3600):
    """
    Decorator to cache FastAPI route responses using Redis.
    Requires a `request: Request` parameter in the route function.
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs) -> Any:
            # Find the Request object in kwargs or args
            request = kwargs.get('request')
            if not request:
                for arg in args:
                    if isinstance(arg, Request):
                        request = arg
                        break
            
            cache_key = None
            if request:
                # Build key based on path and query parameters
                cache_key = f"cache:{request.url.path}"
                if request.url.query:
                    cache_key += f"?{request.url.query}"
            
            client = get_redis_client()
            
            if cache_key:
                try:
                    cached_data = await client.get(cache_key)
                    if cached_data:
                        # Return the parsed JSON directly (FastAPI automatically handles dicts)
                        return json.loads(cached_data)
                except Exception as e:
                    logger.error(f"Redis cache read error for {cache_key}: {e}")

            # Execute the actual route function
            result = await func(*args, **kwargs)

            if cache_key:
                try:
                    # Serialize Pydantic models or dicts to JSON
                    if hasattr(result, "model_dump"):
                        data_to_cache = result.model_dump(mode='json')
                    else:
                        data_to_cache = result
                    
                    await client.setex(cache_key, expire_seconds, json.dumps(data_to_cache))
                except Exception as e:
                    logger.error(f"Redis cache write error for {cache_key}: {e}")

            return result
        return wrapper
    return decorator

async def invalidate_cache_prefix(prefix: str):
    """Invalidate all cache keys starting with a specific prefix."""
    client = get_redis_client()
    try:
        # SCAN for keys matching the prefix to avoid blocking the single thread
        cursor = '0'
        while cursor != 0:
            cursor, keys = await client.scan(cursor=cursor, match=f"cache:{prefix}*", count=100)
            if keys:
                await client.delete(*keys)
    except Exception as e:
        logger.error(f"Redis cache invalidation error for prefix {prefix}: {e}")
