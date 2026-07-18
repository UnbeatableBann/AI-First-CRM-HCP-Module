.PHONY: help install-backend install-frontend install-all dev-backend dev-frontend dev-all lint-backend format-backend typecheck-backend test-backend lint-frontend typecheck-frontend test-frontend db-up db-down migrate migration docker-up docker-down docker-logs no-cache

# Backend Variables
BACKEND_DIR = backend
UV = uv

# Frontend Variables
FRONTEND_DIR = frontend
NPM = npm --prefix $(FRONTEND_DIR)

help:
	@echo "Available commands:"
	@echo "  make install-all        - Install backend and frontend dependencies"
	@echo "  --- Backend ---"
	@echo "  make install-backend    - Install backend dependencies using uv"
	@echo "  make dev-backend        - Run the backend development server (uvicorn)"
	@echo "  make lint-backend       - Run ruff linter on backend"
	@echo "  make format-backend     - Run ruff formatter on backend"
	@echo "  make typecheck-backend  - Run mypy type checker on backend"
	@echo "  make test-backend       - Run backend tests"
	@echo "  make migrate            - Apply database migrations"
	@echo "  make migration          - Create a new migration (make migration m='message')"
	@echo "  --- Frontend ---"
	@echo "  make install-frontend   - Install frontend dependencies using npm"
	@echo "  make dev-frontend       - Run the frontend development server (vite)"
	@echo "  make lint-frontend      - Run eslint on frontend"
	@echo "  make typecheck-frontend - Run tsc on frontend"
	@echo "  --- Docker & DB ---"
	@echo "  make db-up              - Start only PostgreSQL and Redis containers"
	@echo "  make db-down            - Stop database containers"
	@echo "  make docker-up          - Start all services using docker compose"
	@echo "  make docker-down        - Stop all services"
	@echo "  make docker-logs        - View logs for all services"
	@echo "  make docker-build       - Build backend docker images"

# Combined
install-all: install-backend install-frontend

# Backend Commands
install-backend:
	cd $(BACKEND_DIR) && $(UV) sync

dev-backend:
	cd $(BACKEND_DIR) && $(UV) run uvicorn app.main:app --reload

lint-backend:
	cd $(BACKEND_DIR) && $(UV) run ruff check .

format-backend:
	cd $(BACKEND_DIR) && $(UV) run ruff format .
	cd $(BACKEND_DIR) && $(UV) run ruff check . --fix

typecheck-backend:
	cd $(BACKEND_DIR) && $(UV) run mypy app

test-backend:
	cd $(BACKEND_DIR) && $(UV) run pytest

test-cov-backend:
	cd $(BACKEND_DIR) && $(UV) run pytest --cov=app

migrate:
	cd $(BACKEND_DIR) && $(UV) run alembic upgrade head

migration:
	@if [ -z "$(m)" ]; then echo "Error: Migration message required. Use 'make migration m=\"your message\"'"; exit 1; fi
	cd $(BACKEND_DIR) && $(UV) run alembic revision --autogenerate -m "$(m)"

# Frontend Commands
install-frontend:
	$(NPM) install

dev-frontend:
	$(NPM) run dev

lint-frontend:
	$(NPM) run lint

typecheck-frontend:
	cd $(FRONTEND_DIR) && npx tsc --noEmit

# Docker Commands
db-up:
	cd $(BACKEND_DIR) && docker compose up db redis

db-down:
	cd $(BACKEND_DIR) && docker compose down

docker-build:
	cd $(BACKEND_DIR) && docker compose build

docker-up:
	cd $(BACKEND_DIR) && docker compose up

docker-down:
	cd $(BACKEND_DIR) && docker compose down

docker-logs:
	cd $(BACKEND_DIR) && docker compose logs -f

no-cache:
	cd $(BACKEND_DIR) && docker compose build --no-cache
