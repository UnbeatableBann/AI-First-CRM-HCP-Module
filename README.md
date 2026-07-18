# AI-First CRM HCP Module

The **AI-First CRM HCP (Healthcare Professional) Module** is an intelligent, context-aware CRM designed for medical representatives. It streamlines the process of logging interactions, meetings, and shared materials with healthcare professionals by combining a powerful React frontend with an AI-driven LangGraph backend.

Instead of manually filling out tedious forms, users can simply type or dictate their interactions naturally (e.g., *"I met with Dr. Smit today and shared the latest clinical brochure"*). The AI autonomously parses the information, matches the HCP to the database, extracts structured fields (date, time, topics, sentiment), and instantly syncs these updates to a live UI form via Redux.

## Tech Stack

### Frontend
- **Framework:** React + Vite (TypeScript)
- **State Management:** Redux Toolkit
- **Forms:** React Hook Form with Zod validation
- **Styling:** Tailwind CSS + Lucide React icons

### Backend
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL (with SQLAlchemy and asyncpg)
- **AI/LLM:** LangGraph + Langchain + Groq API (LLaMA-3)
- **Deployment:** Docker Compose

---

## Project Structure

```text
├── backend/                # FastAPI application and LangGraph agent
│   ├── app/                # Core API, LangGraph nodes, DB models, and schemas
│   ├── alembic/            # Database migrations
│   ├── docker-compose.yml  # Backend and DB services
│   └── requirements.txt    # Python dependencies
├── frontend/               # React UI
│   ├── src/                # Components, Redux slices, API hooks
│   ├── package.json        # NPM dependencies
│   └── tailwind.config.js  # Tailwind CSS configuration
├── .gitignore
├── .gitattributes
└── README.md
```

---

## Setup & Installation

### Prerequisites
- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) (v18+)
- A [Groq API Key](https://console.groq.com/) for the AI capabilities

### 1. Backend Setup (Docker)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Set up your environment variables. Create a `.env` file in the `backend` folder containing your Groq API key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   LLM_MODEL=llama-3.3-70b-versatile
   DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/crm_db
   ```
3. Start the backend and database containers:
   ```bash
   docker compose up -d
   ```
   *This command will build the API container, pull the PostgreSQL image, run database migrations (Alembic), and expose the API on `http://localhost:8000`.*

### 2. Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will now be accessible at `http://localhost:5173`. It is configured to automatically proxy API requests to the local backend on port 8000.*

---

## Usage

1. **Open the Application:** Navigate to `http://localhost:5173` in your browser.
2. **Chat with the AI:** Use the chat panel to naturally describe your interaction. For example:
   > *"Hi, today I met Dr. Smit at Apollo Hospital. We discussed Ozempic and its efficacy for Type 2 diabetes patients. I shared the latest clinical brochure and two sample kits. The doctor seemed quite positive."*
3. **Live UI Sync:** Watch as the AI autonomously extracts the interaction type, date, time, attendees, topics, shared materials, and sentiment, instantly populating the manual form on the left.
4. **Manual Edits:** You can seamlessly blend AI and manual entry. Edit any field on the form (like adding a custom "Sample Distributed" tag), and it will automatically save to the active draft.
5. **Save:** When you're ready, simply tell the AI to save the interaction, and it will persist the structured data into the PostgreSQL database.
