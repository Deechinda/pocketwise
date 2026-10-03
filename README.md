# PocketWise

PocketWise is a polished, multi-user budgeting workspace for Nigerian students. Every new account begins empty: no sample transactions, totals, budgets, goals, charts, or invented insights.

## Features

- Supabase email/password sign-up, sign-in, sign-out, reset, session persistence, and confirmation handling
- Private transaction CRUD, monthly budgets, savings goals/contributions, profile updates, and JSON export
- Real-data dashboard calculations, rule-based insights, and up to three Chart.js charts
- Premium landing/auth/dashboard experiences, intentional empty/loading/error states, toasts, dark mode, accessible dialogs, and mobile navigation
- Lightweight CSS entrance, reveal, progress, card, and button animations with reduced-motion support
- PostgreSQL Row Level Security on every user-owned table

## Stack

Semantic HTML, CSS custom properties/Grid/Flexbox, vanilla JavaScript, Chart.js, and Supabase Auth/PostgreSQL. There is no framework or build step.

## Supabase setup

1. Open your Supabase project's SQL Editor and run [`supabase/schema.sql`](supabase/schema.sql).
2. In **Authentication → URL Configuration**, set the Site URL to your deployed URL (or local server URL) and add the same URL to Redirect URLs. Password reset returns to `#reset-password`.
3. Copy the project URL and **anon/publishable** key from **Project Settings → API** into `js/supabase.js`.
4. Never use the service-role key in this frontend. The anon key is safe to publish only because RLS is enabled.
5. Choose whether email confirmation is required under Authentication provider settings. PocketWise supports either mode.

## Database

The schema creates `profiles`, `transactions`, `budgets`, and `savings_goals`, foreign keys to `auth.users`, validation checks, indexes, a profile trigger, and own-row SELECT/INSERT/UPDATE/DELETE policies. Financial data is never stored in localStorage; only the appearance preference is.

## Local development

Serve the folder over HTTP (for example VS Code Live Server or `python -m http.server 8000`) and open the server URL. Opening via `file://` may prevent correct auth redirects. Internet access is required for the Supabase/Chart.js/font CDNs.

## Deployment

This is a static application and can be deployed to Netlify, Vercel, GitHub Pages, or similar hosting. Add the final HTTPS URL to Supabase's allowed redirect URLs. No server secret is required.

## Project structure

- `index.html` — public and authenticated shells
- `js/supabase.js` — single public client configuration
- `js/auth.js` — authentication operations
- `js/data.js` — centralized database operations
- `js/app.js` — startup, routing, shared state, global events, and form workflows
- `js/pages/` — dashboard, transaction, budget, savings, analytics, and settings views
- `js/components/` — public/auth views, responsive navigation, and lightweight hero motion
- `js/ui.js` — reusable formatting, modal, toast, empty-state, and row helpers
- `css/` — tokens, components, and responsive design
- `supabase/schema.sql` — reproducible schema and RLS

## Security note

Frontend route protection improves UX; RLS is the actual data security boundary. Every query is restricted by `auth.uid()` and every inserted record carries the authenticated user's UUID.
