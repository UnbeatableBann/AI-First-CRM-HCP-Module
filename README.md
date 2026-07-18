<!-- markdownlint-disable MD013 -->

# AI-First CRM HCP Module

The **AI-First CRM HCP (Healthcare Professional) Module** is an intelligent, context-aware CRM designed for medical representatives. It streamlines the process of logging interactions, meetings, and shared materials with healthcare professionals by combining a powerful React frontend with an AI-driven LangGraph backend.

Instead of manually filling out tedious forms, users can simply type or dictate their interactions naturally (e.g., *"I met with Dr. Smit today and shared the latest clinical brochure"*). The AI autonomously parses the information, matches the HCP to the database, extracts structured fields (date, time, topics, sentiment), and instantly syncs these updates to a live UI form via Redux.

---

## 🌟 What's New in the `dev` Branch

**Important:** Please ensure you are on the `dev` branch to access these latest features!

- **Draft Interaction Window:** A brand new Interaction Home Screen acts as the central entry point.
- **Resume In-Progress Drafts:** In-progress interactions are now saved as drafts so you can leave and continue exactly where you left off.
- **Grouped HCP History:** Your previously saved interactions are now beautifully grouped by HCP directly on the home screen, allowing you to click in and view an entire timeline of past meetings.
- **Cloudflare Ready:** Complete routing (`_redirects`) and CORS integration with dynamic environment variables (`VITE_API_URL`, `FRONTEND_URL`) specifically designed for Cloudflare Pages and a custom subdomain backend.

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

- Git (Make sure to **checkout the `dev` branch** to get the latest features)
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
2. **Interaction Home Screen:** You will first be greeted by the new **Draft Interaction Window**. From here, you can:
   - Click **New Interaction** to start logging a new meeting.
   - Continue any in-progress **Draft Interactions** you haven't saved yet.
   - Browse your past **Saved Interactions** grouped by Healthcare Professional (HCP).
3. **Chat with the AI:** Once you start or open an interaction, use the chat panel to naturally describe your meeting. For example:
   > *"Hi, today I met Dr. Smit at Apollo Hospital. We discussed Ozempic and its efficacy for Type 2 diabetes patients. I shared the latest clinical brochure and two sample kits. The doctor seemed quite positive."*
4. **Live UI Sync:** Watch as the AI autonomously extracts the interaction type, date, time, attendees, topics, shared materials, and sentiment, instantly populating the manual form on the left.
5. **Manual Edits:** You can seamlessly blend AI and manual entry. Edit any field on the form (like adding a custom "Sample Distributed" tag), and it will automatically save to the active draft.
6. **Save:** When you're ready, simply tell the AI to save the interaction, and it will persist the structured data into the PostgreSQL database.

---

## Deployment (Cloudflare + VPS)

To deploy this structure into production using **Cloudflare** for your domain (`crm.yourdomain.com` for the frontend and `api.yourdomain.com` for the backend):

### 1. Backend Deployment (VPS / Render / Railway)

Since Cloudflare Pages only hosts static files, your FastAPI backend and PostgreSQL database must be deployed to a stateful server like a VPS, Render, or Railway.

1. Set up your backend on your server and expose it securely via HTTPS (e.g., `https://api.yourdomain.com`).
2. Update your production `backend/.env` file:
   - Make sure database credentials (`DATABASE_URL`) are completely different from your local development ones and secure.
   - Set `FRONTEND_URL=https://crm.yourdomain.com` so the FastAPI CORS middleware exclusively allows requests from your Cloudflare Pages frontend.

### 2. Frontend Deployment (Cloudflare Pages)

1. Push your combined repository to GitHub/GitLab.
2. In the **Cloudflare Dashboard**, navigate to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Select this repository and set the following build configurations:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build directory:** `dist`
   - **Root directory:** `/frontend`
4. **Environment Variables (Important):**
   - In your Cloudflare Pages build settings, add an environment variable:
     `VITE_API_URL=https://api.yourdomain.com` (pointing to your production backend subdomain).
5. Ensure the `frontend/public/_redirects` file exists in the repository with the content `/* /index.html 200` to allow Cloudflare to handle SPA (React Router) routing correctly.
6. Connect your custom subdomain (`crm.yourdomain.com`) to the Cloudflare Pages project.
