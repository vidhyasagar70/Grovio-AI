# Markdown Notes Application (Full Stack)

Production-ready Markdown Notes app with clean architecture and scalable foundations.

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
