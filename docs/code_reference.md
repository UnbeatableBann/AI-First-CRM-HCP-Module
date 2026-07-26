# Code & Function Reference

This document provides a deep dive into the most critical functions, methods, and hooks across the frontend and backend of the AI-First CRM HCP Module. It is designed to help developers and AI assistants understand the inner workings of the codebase.

## Backend Code Reference

### 1. `InteractionService` (`backend/app/domains/interaction/service.py`)

This is the core business logic layer for interactions. It acts as the bridge between the API routes, the Database Repositories, and the AI Service.

* **`create_draft(db: AsyncSession, hcp_id: Optional[UUID]) -> Interaction`**
  * **Purpose**: Generates a blank slate interaction in the `interactions` table with the status `"DRAFT"`.
  * **Logic**: If an `hcp_id` is provided, it validates its existence against the `hcps` table before associating it with the draft.

* **`chat_with_ai(db: AsyncSession, interaction_id: UUID, user_message: str) -> dict`** *(Conceptual)*
  * **Purpose**: This represents the primary AI loop.
  * **Logic**:
    1. Fetches the current interaction state from the DB.
    2. Saves the new `user_message` to the `chat_messages` table.
    3. Fetches the chat history for context.
    4. Calls `GroqService.generate_response()` with a strict system prompt demanding a JSON block at the end of the response.
    5. Parses the AI's textual response using Regex (`r"```json\s*(.*?)\s*```"`) to extract the structured data.
    6. Updates the database `Interaction` fields dynamically based on the extracted JSON.
    7. Saves the AI's textual response to the `chat_messages` table.
    8. Returns both the AI text and the updated fields to the frontend.

### 2. Base Repository (`backend/app/repositories/base.py`)

Implements the generic SQLAlchemy 2.0 async database operations.

* **`get(db: AsyncSession, id: Any) -> Optional[ModelType]`**: Retrieves a single record by primary key using `db.get()`.
* **`create(db: AsyncSession, obj_in: CreateSchemaType | dict) -> ModelType`**: Instantiates a SQLAlchemy model, adds it to the session, and commits it.
* **`update(db: AsyncSession, db_obj: ModelType, obj_in: UpdateSchemaType | dict) -> ModelType`**: Iterates over provided key-value pairs, updates the model fields, and commits the transaction.

### 3. Database Session (`backend/app/database/session.py`)

* **`get_db()`**: An async dependency generator yielded to FastAPI routes. It creates an `AsyncSessionLocal` instance, ensuring that database connections are properly acquired and closed/returned to the Neon connection pool after every HTTP request.

---

## Frontend Code Reference

### 1. Custom Hooks

* **`useDraftAutosave`** (`frontend/src/hooks/useDraftAutosave.ts`)
  * **Purpose**: Automatically saves form edits made by the user in the left panel to the backend without requiring a manual "Save" button click.
  * **Logic**: Monitors changes to Redux `currentDraft`. Uses a debouncing mechanism (`setTimeout` / `clearTimeout`) to wait until the user stops typing for ~1000ms before firing a `PATCH /interaction/{id}` request via Axios.

### 2. Redux State (`frontend/src/features/interaction/interactionSlice.ts`)

* **`setDraft(state, action: PayloadAction<Draft>)`**: Replaces the entire `currentDraft` object in the Redux store. Triggered when the page initially loads or when a new Draft is created.
* **`updateDraftField(state, action: PayloadAction<{field: string, value: any}>)`**: Mutates a specific field inside the `currentDraft`. This is dispatched by the input fields in the `InteractionForm`.
* **`updateFromAi(state, action: PayloadAction<Partial<Draft>>)`**: Merges incoming structured data from the AI chat response into the `currentDraft` without overwriting fields that the user might be actively typing in.

### 3. Key Components

* **`ChatPanel.tsx`**
  * **Functions**: Handles the local state of messages.
  * **`handleSendMessage()`**: Dispatches a `POST` request to the backend with the user's message. Optimistically appends the user's message to the UI instantly, shows a typing indicator, and awaits the backend AI response. Once received, it appends the AI's textual response to the chat and dispatches `updateFromAi` to sync the form panel.

* **`InteractionHomePage.tsx`**
  * **Functions**: Manages the dashboard data.
  * **`fetchHomeData()`**: Calls `GET /interaction/home` and populates the `drafts` and `savedHcps` arrays.
  * **Error Handling**: Gracefully handles network errors or CORS failures (catching `AxiosError` and setting loading to false, which renders fallback UI text instead of crashing).

### 4. API Configuration (`frontend/src/services/api/axios.ts`)

* **`api`**: An instantiated Axios client.
* **`baseURL`**: Dynamically set using `import.meta.env.VITE_API_URL`. If the environment variable is missing (common in CI/CD pipeline issues), it falls back to `http://localhost:8000`. This is the central point for all HTTP outgoing requests.
