# Quick Start Guide - Faith & Grace Catering

This project uses a React/Vite frontend and a Node/Express backend.

## Run Locally

### Backend
```bash
cd Backend
npm install
```

Create `Backend/.env` using `Backend/.env.example`, then start the API:

```bash
npm run dev
```

The backend runs on `http://localhost:8000`.

### Frontend
```bash
cd frontend
npm install
```

Set the frontend API URL in the repo root `.env.local`:

```bash
VITE_API_URL=http://localhost:8000
```

Then start Vite:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Main Routes

- Customer site: `http://localhost:5173`
- Menu: `http://localhost:5173/menu`
- Track order: `http://localhost:5173/track`
- Owner dashboard: `http://localhost:5173/owner`

## Production Notes

- Frontend production env uses `.env.production`
- Stripe checkout requires the backend env vars to be configured
- Order emails are sent through Resend
- Owner auth uses the hash stored in MongoDB or `OWNER_PASSWORD_HASH`

See the root `README.md` for architecture, API routes, and deployment notes.
