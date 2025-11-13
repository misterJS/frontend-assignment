# Frontend Assignment

Demo: https://frontend-assignment-delta-eight.vercel.app

Single-page React + Vite app with a wizard for registering employees and a paginated employees list. APIs are mocked with `json-server`; the app reads `VITE_API_STEP1`/`VITE_API_STEP2` so you can point it to any hosted JSON server (Vercel, Render, Railway, etc.).

## Architecture Overview

- **Tech stack**: Vite, React, TypeScript, Vitest, Testing Library, Tailwind-esque custom CSS utilities.
- **Features**
  - Role toggle (admin vs ops) stored in URL/query + context.
  - Wizard with autosave drafts, role-based steps, photo upload, API progress indicator.
  - Employees page with merged data from `/basicInfo` + `/details`, pagination, loading/error/empty states.
  - Path alias `@/*` for cleaner imports.
- **Mock endpoints** (json-server)
  - `GET /departments`, `POST /basicInfo` on `VITE_API_STEP1`.
  - `GET /locations`, `POST /details` on `VITE_API_STEP2`.
  - `GET /basicInfo`, `GET /details` for employees page merge.

## Getting Started

```bash
npm install
npm run mock   # starts json-server on ports 4001/4002
npm run dev    # Vite dev server (http://localhost:5173)
```

Set `VITE_API_STEP1`/`VITE_API_STEP2` (e.g. in `.env.local`) if you host the mocks elsewhere; otherwise defaults to `http://localhost:4001/4002`.

## Testing

```bash
npm run test   # Vitest + Testing Library (jsdom)
```

## Build & Deploy

```bash
npm run build  # Generates production bundle in dist
```

Deploy the contents of `dist` to Vercel/Netlify. On Vercel:

1. Create a project from this repo.
2. Set env vars:
   - `VITE_API_STEP1=https://<your-step1-api>`
   - `VITE_API_STEP2=https://<your-step2-api>`
3. Build command: `npm run build` (default Vite settings).
4. Optional preview/test: `npm run test`.

Mock APIs must be hosted separately (another Vercel project or any Node host running `json-server`). Update the env vars to point to those URLs so the frontend works in production.
