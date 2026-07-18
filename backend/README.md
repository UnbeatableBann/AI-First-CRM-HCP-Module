# AI-First Healthcare CRM Backend

A modern, production-ready backend for an AI-First Healthcare CRM, powered by FastAPI, LangGraph, and PostgreSQL.

## Architecture: Domain-Driven Design (Vertical Slices)
This project enforces a highly modular **Domain-Driven Design (DDD)** structure to ensure maximum scalability. Rather than organizing code by layer (e.g. all models in one folder, all schemas in another), code is isolated by its **business domain**.

### Domain Structure
- `app/domains/hcp/`: Logic specifically relating to Healthcare Professionals (HCPs).
- `app/domains/interaction/`: Logic specifically relating to logged interactions and generated follow-ups.
- `app/domains/audit/`: Compliance and audit trail tracking.
- `app/domains/auth/`: User and authentication boundaries.

Each domain folder acts as a self-contained microservice, encapsulating its own `models.py`, `schemas.py`, `repository.py`, `service.py`, and `router.py`.

### AI Core
- `app/langgraph/`: Centralized LLM Graph state machines and intelligent tools.
- `app/llm/`: Unified LLM factory supporting drop-in replacement of models (Gemma2, LLaMA3) via `factory.py`.

## Features
- AI intent detection and handling via LangGraph
- Strict Tool execution through `with_structured_output` entity extraction
- PostgreSQL database via SQLAlchemy 2.0 and asyncpg (UUID & Soft-Deletes)
- Pydantic v2 validation
- Centralized `structlog` formatting for development and production telemetry

## Getting Started
1. Configure environment variables in `.env`
2. Start services: `docker-compose up -d`
3. Install dependencies: `uv sync`
4. Run migrations: `uv run alembic upgrade head` (once set up)
5. Run dev server: `uv run uvicorn app.main:app --reload`
