# AI Business Advisor for African Entrepreneurs

- **Stack**: Next.js 14 (app router) + TypeScript + Tailwind + Supabase + Groq
- **Features**: AI mentor chat, invoices (PDF + DB), inventory insights, fraud detector

## Setup

1. Install deps
```
npm install
```

2. Create `.env.local` from example
```
cp .env.example .env.local
```
Fill values:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GROQ_API_KEY`

3. Supabase schema
- Create a new Supabase project, enable email OTP auth.
- Run SQL from `supabase/schema.sql` in SQL editor.
- Optional: run `supabase/seed.sql`.

4. Dev
```
npm run dev
```

## Pages
- `/` Landing
- `/chat` AI Mentor
- `/invoices` Invoice builder + history
- `/inventory` Inventory insights
- `/fraud` Fraud detector
- `/dashboard` Dashboard
- `/settings` Settings
- `/login` Magic link login

## Deployment
- Vercel: set env vars (`NEXT_PUBLIC_*`, `GROQ_API_KEY`).
- Supabase: keep anon key and URL in Vercel env.

## Notes
- All AI calls use Groq models (e.g., `llama-3.1-70b-versatile`).
- Invoice PDFs generated via `pdf-lib` server route.
- RLS policies restrict data to the authenticated user.
