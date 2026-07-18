# Stage 1: Builder
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim AS builder

WORKDIR /app

# Enable bytecode compilation and set venv path outside of /app
ENV UV_COMPILE_BYTECODE=1
ENV UV_PROJECT_ENVIRONMENT=/opt/venv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Sync dependencies into the virtual environment (without installing the project code itself yet)
RUN uv sync --frozen --no-dev --no-install-project

# Stage 2: Runtime
FROM python:3.13-slim

WORKDIR /app

# Run as non-root user for security
RUN useradd -m appuser && chown -R appuser /app
USER appuser

# Copy the pre-built virtual environment from the builder stage
COPY --from=builder /opt/venv /opt/venv

# Ensure the virtual environment is in the PATH
ENV PATH="/opt/venv/bin:$PATH"

# Copy the application code
COPY --chown=appuser:appuser . /app

EXPOSE 8000

# Run the application using the absolute path to uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
