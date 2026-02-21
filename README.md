# AgriSync

AgriSync is a hackathon-ready full-stack app for predictive harvesting decisions and pre-harvest buyer coordination.

## Stack
- Next.js (App Router) + TypeScript + TailwindCSS
- Supabase auth + PostgreSQL schema (with local fallback demo mode)
- FastAPI mock ML service
- Recharts for prediction charts
- i18next multilingual support (English, Hindi, Telugu)
- Basic PWA caching with service worker

## Project Structure
- `app/` Next.js routes (landing, auth, profile setup, dashboards, API proxies)
- `components/` reusable UI components (language cards, chart, PWA register)
- `lib/` auth, i18n, local cache/session helpers
- `locales/` translation JSON files
- `ml-service/` FastAPI mock ML endpoints
- `supabase-schema.sql` PostgreSQL schema template

## Local Setup
### 1) Frontend
```bash
npm install
cp .env.example .env.local
npm run dev
```
App runs at `http://localhost:3000`.

### 2) ML Service
```bash
cd ml-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
ML service runs at `http://127.0.0.1:8000`.

## Demo Flow
1. Open landing page and pick language card.
2. Sign up/login as Farmer or Buyer.
3. Complete profile setup.
4. Farmer dashboard shows prediction chart, recommendation, weather, risk, storage, transport, and profit.
5. Buyer dashboard filters future supply and creates pre-harvest commitments.

## Supabase Notes
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` to enable Supabase auth.
- If env vars are missing, app uses local demo session/profile storage so the app still runs out of the box.
- Use `supabase-schema.sql` in Supabase SQL editor for table creation.
