# Frontend - Markdown Notes App

React + TypeScript + Tailwind CSS frontend for the full-stack Markdown Notes application.

## Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - type-check and build production assets
- `npm run preview` - preview production build locally

## API Integration

The frontend calls `/api/*` and Vite proxies those requests to `http://localhost:4000` during development.

Optional environment override:

- `VITE_API_BASE_URL=/api`

## Main UI Features

- Notes list with pagination
- Search by title/content
- Markdown editor + live preview split screen
- Debounced auto-save
- Dark mode toggle
