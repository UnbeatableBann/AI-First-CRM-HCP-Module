# Usage & Workflows

## User Interface Workflows

### 1. Home Dashboard

The home page (`/`) serves as the central hub for the user.

* **Draft Interactions**: Displays incomplete interactions that are currently in progress. Clicking on a draft resumes the session.
* **Saved Interactions**: Displays a list of Healthcare Professionals (HCPs) the user has successfully interacted with. Clicking on an HCP routes to their specific history page.
* **New Interaction**: Clicking the `+ New Interaction` button automatically triggers an API call to generate a fresh interaction draft, and navigates the user to the logging interface.

### 2. Logging an Interaction (The AI Chat)

Navigating to `/interactions/:id` brings up the core application interface divided into two panels:

* **Right Panel (Chat)**: A messaging interface where the user converses with the AI. The user can type unstructured notes like, *"I met with Dr. Smith today. We discussed the new clinical trial for Drug X. Left 5 samples."*
* **Left Panel (Form)**: A read-only representation of the structured data. As the AI extracts information from the chat, this form updates in real-time to reflect the recognized data (e.g., automatically populating "Dr. Smith" as the HCP and "Drug X" in topics discussed).
* **Completion**: Once the user is satisfied with the extracted details, they can manually finalize the interaction by clicking "Mark as Completed", which freezes the interaction as historical record.

### 3. HCP History Page

Navigating to `/hcps/:hcp_id/interactions` displays a timeline view of all past completed interactions for a specific HCP. Users can see quick summaries, sentiments, and outcomes at a glance, and can click "View" to open the detailed read-only form for a specific historical interaction.

---

## API Endpoints Overview

The backend exposes several key endpoints for the frontend application. (Visit `http://localhost:8000/docs` for the complete OpenAPI schema).

### `GET /interaction/home`

Fetches the initial dashboard data. Returns an object containing a list of `drafts` and a list of `saved_hcps`.

### `POST /interaction/draft`

Creates a brand new interaction entry in the database with the status set to `DRAFT`. Returns the newly generated interaction UUID.

### `GET /interaction/{id}`

Retrieves the complete data for a specific interaction, including all its structured fields.

### `PATCH /interaction/{id}`

Allows the frontend to manually update fields for a draft interaction. (Currently heavily utilized by the backend AI parser, but available for frontend overrides).

### `POST /interaction/{id}/chat`

Sends a new user message to the AI. The backend appends the message to the database, queries the Groq LLM, parses the returned JSON, updates the interaction fields, and responds with the AI's textual reply.

### `GET /hcp/{id}/interactions`

Retrieves all completed interactions associated with a specific HCP ID for the history timeline.
