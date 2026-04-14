# Frontend - Markdown Notes App

React + TypeScript + Tailwind CSS frontend for the full-stack Markdown Notes application.

## Live URL

- Frontend: https://grovio-ai-pied.vercel.app/
- Backend API: https://grovio-ai.onrender.com/

## Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - type-check and build production assets
- `npm run preview` - preview production build locally

## API Integration

The frontend uses a single API base URL for both notes and auth requests.

- Local development: Vite proxies `/api/*` to `http://localhost:4000`.
- Production on Vercel: set `VITE_API_BASE_URL` to your Render backend URL, or keep `/api` if you add a Vercel rewrite.

Optional environment override:

- `VITE_API_BASE_URL=/api`

Example production value:

- `VITE_API_BASE_URL=https://grovio-ai.onrender.com`

## Main UI Features

- Notes list with pagination
- Search by title/content
- Markdown editor + live preview split screen
- Debounced auto-save
- Dark mode toggle
