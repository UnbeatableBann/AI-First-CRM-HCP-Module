from typing import Callable, Dict, List, Type, Any
import asyncio

class EventDispatcher:
    _handlers: Dict[Type, List[Callable]] = {}

    @classmethod
    def subscribe(cls, event_type: Type, handler: Callable):
        if event_type not in cls._handlers:
            cls._handlers[event_type] = []
        cls._handlers[event_type].append(handler)

    @classmethod
    async def publish(cls, event: Any):
        event_type = type(event)
        if event_type in cls._handlers:
            for handler in cls._handlers[event_type]:
                if asyncio.iscoroutinefunction(handler):
                    await handler(event)
                else:
                    handler(event)

dispatcher = EventDispatcher()
