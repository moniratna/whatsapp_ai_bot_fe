# WABot dashboard

A Next.js App Router application built with React, TypeScript, and Lucide icons.

## Run locally

1. Set `DASHBOARD_API_KEY` in the backend `.env` file.
2. Copy `frontend/.env.example` to `frontend/.env.local` and set the same `DASHBOARD_API_KEY`; set `BACKEND_API_URL` to the FastAPI origin.
3. Start FastAPI and the frontend in separate terminals:

```bash
uv run uvicorn app.main:app --reload
cd frontend && npm install && npm run dev
```

Open http://localhost:3000. The Next.js route handler proxies dashboard requests and keeps the dashboard key on the server.

## Screens

- Overview cards, customer growth, intent distribution, recent customers, and activity.
- Customer directory with live search and intent filtering.
- Customer profile with WhatsApp history, per-turn sentiment and extraction confidence, requirements, CRM status, and customer sentiment insights.
- Reports for customer growth, lead intent, buy and growth sentiment, and extraction confidence.

## Data status

The dashboard loads customer, conversation, summary, and report data from authenticated read-only FastAPI endpoints under `/api/v1/dashboard`. `DASHBOARD_API_KEY` must be configured in both services with the same secret; the Next.js route handler sends it server-side and never exposes it to browser JavaScript. Confidence is shown as a model estimate. The app does not send messages or change CRM records.
