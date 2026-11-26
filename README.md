# WABot dashboard

A Next.js App Router application built with React, TypeScript, and Lucide icons.

## Run locally

1. Set `DASHBOARD_API_KEY` in the backend `.env` file.
2. Copy `frontend/.env.example` to `frontend/.env.local` and set the same `DASHBOARD_API_KEY`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and a random `AUTH_SESSION_SECRET`; set `BACKEND_API_URL` to the FastAPI origin.
3. Start FastAPI and the frontend in separate terminals:

```bash
uv run uvicorn app.main:app --reload
cd frontend && npm install && npm run dev
```

Open http://localhost:3000. The Next.js route handler proxies dashboard requests and keeps the dashboard key on the server.

## Screens

- Overview cards, customer growth, intent distribution, recent customers, and activity.
- Customer directory with live search and intent filtering.
- Customer profile with WhatsApp history, requirements, portfolio, CRM status, and available extraction confidence.
- Reports for customer growth and buy/sell intent.

## Data status

The dashboard loads customer, summary, report, and open handover data from FastAPI endpoints under `/api/v1/dashboard`. `DASHBOARD_API_KEY` must be configured in both services with the same secret; the Next.js route handler sends it server-side and never exposes it to browser JavaScript. The key is accepted only on the dashboard routes. Static login credentials are checked by Next.js and protected by an HTTP-only signed session cookie. Sentiment and growth-purpose analytics are shown as unavailable when the backend has no corresponding stored data. Human replies are queued through the backend outbound worker; taking over and handing back a review updates the conversation handover state.
