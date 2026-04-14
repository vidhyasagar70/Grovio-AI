# Markdown Notes Application (Full Stack)

Production-ready Markdown Notes app with clean architecture and scalable foundations.

## Live Deployment

- Frontend (Vercel): https://grovio-ai-pied.vercel.app/
- Backend (Render): https://grovio-ai.onrender.com/

## Tech Stack

- Frontend: React + TypeScript + Tailwind CSS (Vite)
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL

## Architecture

Backend follows layered architecture:

- routes -> controllers -> services -> repositories -> database

Frontend follows component + API client separation:

- API client + hooks + typed components + page orchestration in `App.tsx`

## Step-by-Step Implementation

### 1) Backend Setup

1. Create backend project and install dependencies.
2. Configure strict TypeScript compiler settings.
3. Add `.env` support for port, CORS origin, database URL, and JWT secret.

Key files:

- `backend/package.json`
- `backend/tsconfig.json`
- `backend/src/server.ts`
- `backend/src/app.ts`

### 2) Database Setup (PostgreSQL)

1. Initialize a Postgres connection pool via `pg`.
2. Auto-create `users` and `notes` tables plus indexes.
3. Add explicit migration command for local setup and CI pipelines.

Schema:

- `users`: `id`, `email`, `password_hash`, `created_at`, `updated_at`
- `notes`: `id`, `user_id`, `title`, `content`, `created_at`, `updated_at`

Key files:

- `backend/src/db/postgres.ts`
- `backend/src/db/migrate.ts`

### 3) REST API Implementation

Implemented endpoints:

- `GET /notes` (pagination + search)
- `GET /notes/:id`
- `POST /notes`
- `PUT /notes/:id`
- `DELETE /notes/:id`

Engineering quality details:

- Consistent response format:
  - `{ success: boolean, data: any, message?: string }`
- Proper HTTP status codes (`200`, `201`, `400`, `404`, `500`)
- Request validation with `zod`
- Error handling middleware + not found middleware

Key files:

- `backend/src/routes/noteRoutes.ts`
- `backend/src/controllers/noteController.ts`
- `backend/src/services/noteService.ts`
- `backend/src/repositories/noteRepository.ts`
- `backend/src/middleware/errorHandler.ts`

### 4) Frontend Integration

Implemented features:

- Notes list with pagination
- Search by title/content
- Select note and edit
- Create and delete note
- Markdown split-screen editor/preview
- Real-time preview with `react-markdown`
- Debounced auto-save
- Dark mode toggle

Key files:

- `frontend/src/App.tsx`
- `frontend/src/api/notesApi.ts`
- `frontend/src/components/NotesList.tsx`
- `frontend/src/components/NoteEditor.tsx`
- `frontend/src/components/MarkdownPreview.tsx`
- `frontend/src/hooks/useDebouncedValue.ts`

## Local Setup

## Prerequisites

- Node.js 20+
- npm 10+

### Backend

```bash
cd backend
npm install
npm run migrate
npm run dev
```

Create `.env` from `.env.example` before running the server.

Backend default URL: `http://localhost:4000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`

Note: Vite dev server proxies `/api/*` to backend `http://localhost:4000`.

## Production Configuration

For deployed frontend-backend communication, set:

- `VITE_API_BASE_URL=https://grovio-ai.onrender.com`

This ensures frontend API calls resolve to the Render backend in production.

## Environment Variables

Backend `.env` values:

- `PORT=4000`
- `CORS_ORIGIN=http://localhost:5173`
- `DATABASE_URL=postgresql://...`
- `DATABASE_SSL=true` for Render or other hosted Postgres providers
- `JWT_SECRET=your-production-secret`

Frontend optional `.env`:

- `VITE_API_BASE_URL=/api` (default is already `/api`)

## Build Commands

```bash
# backend
cd backend
npm run build

# frontend
cd frontend
npm run build
```

## API Response Example

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "My Note",
    "content": "# Markdown",
    "created_at": "2026-04-13T09:00:00.000Z",
    "updated_at": "2026-04-13T09:00:00.000Z"
  },
  "message": "Note created successfully."
}
```

## Deployment Notes

The recommended production setup is:

- Frontend on Vercel.
- Backend on Render as a Web Service.
- PostgreSQL from Render, Neon, Supabase, or another managed provider.

If the frontend is deployed separately, set `VITE_API_BASE_URL` to the backend URL or add a Vercel rewrite so `/api` forwards to the Render service.

## API Endpoints (Production)

Base URL: `https://grovio-ai.onrender.com`

- `GET /health`
- `POST /auth/signup`
- `POST /auth/login`
- `GET /notes` (requires Bearer token)
- `GET /notes/:id` (requires Bearer token)
- `POST /notes` (requires Bearer token)
- `PUT /notes/:id` (requires Bearer token)
- `DELETE /notes/:id` (requires Bearer token)

## Postman Collection (Submission Format)

Submission-ready Postman collection is included at:

- `postman/Grovio-AI.postman_collection.json`

Import steps:

1. Open Postman.
2. Click **Import**.
3. Select `postman/Grovio-AI.postman_collection.json`.
4. Confirm collection variables:
  - `baseUrl=https://grovio-ai.onrender.com`
  - `password=Passw0rd!` (or your preferred test password)
5. Run requests in this order for a full flow:
  - `Auth / Signup` (optional, auto-generates email)
  - `Auth / Login` (stores `token`)
  - `Notes / Create Note` (stores `noteId`)
  - `Notes / List Notes`
  - `Notes / Get Note By Id`
  - `Notes / Update Note`
  - `Notes / Delete Note`
