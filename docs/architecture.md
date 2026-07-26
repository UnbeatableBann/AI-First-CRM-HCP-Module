# Architecture & Technical Information

## System Architecture

The application uses a client-server architecture with decoupled frontend and backend services communicating via a RESTful API.

### 1. Frontend (Client)

The frontend is a Single Page Application (SPA) that acts as the presentation layer. It manages local state, handles routing without page reloads, and interacts with the user.

* **State Management**: The chat interface and drafting process utilize Redux Toolkit to maintain the conversation state and current draft details globally, ensuring smooth transitions between the form view and the chat view.
* **Network**: Axios is used to communicate with the backend, structured through an API service layer.

### 2. Backend (API Layer)

The backend is a high-performance ASGI application built with FastAPI. It follows a Domain-Driven Design (DDD) directory structure.

* **Routers**: Map HTTP endpoints to service methods.
* **Services**: Contain the core business logic (e.g., interacting with the LLM, managing draft lifecycles).
* **Repositories**: Handle database abstraction, providing clean async methods to query SQLAlchemy models.
* **Schemas**: Pydantic models for strict request validation and response serialization.

### 3. AI Integration (Groq & LLaMA)

The core intelligence of the application is powered by Groq's API utilizing the `llama-3.3-70b-versatile` model.

* **Workflow**:
  1. The user sends a chat message.
  2. The backend retrieves the interaction context and previous chat history.
  3. The backend sends the conversation to the LLM with a highly specific system prompt instructing it to act as an assistant that extracts structured JSON data.
  4. The LLM returns a response containing conversational text for the user, alongside a hidden structured JSON payload.
  5. The backend parses the JSON, auto-updates the draft in the PostgreSQL database, and sends the conversational text back to the frontend.

### 4. Database Schema

The system utilizes a relational Postgres database consisting of three main tables:

* **`hcps` (Healthcare Professionals)**
  * `id`: UUID (Primary Key)
  * `name`: String
  * `specialty`: String
  * `hospital_affiliation`: String
  * `contact_email`, `contact_phone`: Strings
  * `created_at`, `updated_at`, `is_deleted`: Timestamps & Soft Delete flag

* **`interactions`**
  * `id`: UUID (Primary Key)
  * `hcp_id`: UUID (Foreign Key -> `hcps.id`, Nullable for unassigned drafts)
  * `status`: String (`DRAFT` or `COMPLETED`)
  * `interaction_type`, `date`, `time`, `attendees`, `topics_discussed`: Extracted fields
  * `materials_shared`, `samples_distributed`, `sentiment`, `outcomes`: Extracted fields
  * `summary`, `follow_up_actions`: Text fields
  * `created_at`, `updated_at`, `completed_at`: Timestamps

* **`chat_messages`**
  * `id`: UUID (Primary Key)
  * `interaction_id`: UUID (Foreign Key -> `interactions.id`)
  * `role`: String (`user` or `assistant`)
  * `content`: Text

## Deployment Architecture

* **Frontend**: Built into static HTML/JS/CSS using Vite and served globally via the Cloudflare Pages CDN.
* **Backend**: Dockerized and deployed as a stateless serverless container on Google Cloud Run. Scale-to-zero capabilities are utilized to minimize costs.
* **Database**: Neon provides serverless Postgres connection pooling, ensuring the backend does not exhaust database connections during cold starts or scaling.
