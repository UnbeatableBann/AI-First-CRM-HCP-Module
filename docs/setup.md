# Project Setup Guide

This guide details how to set up the project for local development.

## Prerequisites

* **Node.js** (v18 or higher) & **npm**
* **Python** (v3.13 recommended) & **uv** package manager
* **Docker** (optional, for local postgres/redis services)
* **PostgreSQL** (if running a local database without Docker)

## 1. Backend Setup

### Environment Variables

Navigate to the `backend` directory and create a `.env` file based on `.env.example` (or configure it manually):

```env
# Database Configuration
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/crm_db
# Groq AI Key
GROQ_API_KEY=your_groq_api_key_here
# Security
SECRET_KEY=generate_a_secure_random_key
ALGORITHM=HS256
# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

*Note: If you are connecting to Neon, update `DATABASE_URL` with your Neon connection string.*

### Installation

We use `uv` for blazing fast Python dependency management.

```bash
cd backend
# Sync dependencies (creates a virtual environment automatically)
uv sync

# Activate the virtual environment
# On Windows:
.venv\Scripts\activate
# On Mac/Linux:
source .venv/bin/activate
```

### Database Migrations

Before running the server, apply the database migrations to create the tables.

```bash
alembic upgrade head
```

### Running the Server

Start the FastAPI backend with hot-reloading:

```bash
uv run uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. You can view the interactive Swagger documentation at `http://localhost:8000/docs`.

---

## 2. Frontend Setup

### Frontend Environment Variables

Navigate to the `frontend` directory and create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

### Frontend Installation

Install the required NPM packages.

```bash
cd frontend
npm install
```

### Running the Application

Start the Vite development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## 3. Production Deployment Notes

* **Backend (Cloud Run)**: Ensure you expose port 8000 in your Docker container or map it correctly. Set your `FRONTEND_URL` environment variable in the Cloud Run GUI without trailing slashes.
* **Frontend (Cloudflare Pages)**: Set `VITE_API_URL` to your Cloud Run URL in the Cloudflare Pages settings *before* deploying to ensure the API URL is baked into the build.
