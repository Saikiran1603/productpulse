# ProductPulse
React + TypeScript + Vite + Tailwind + React Router + Axios + JSON Server + Recharts.

## Run
```
npm install
npm run dev      # JSON Server on :3001 + Vite on :5173
```
Demo logins (password `demo`): owner@demo.com, admin@demo.com, pm@demo.com, customer@demo.com
Public roadmap: `/public/1` (no login).

## Roles
owner: everything · admin: all but Subscription/Settings · pm: dashboard, feedback, roadmap, categories, release notes · customer: feedback, vote, comment, public roadmap.

## Deploy
Deploy on Netlify without additional environment variables. Netlify serves the frontend and its JSON Server data through the `/api` function. For Vercel, host JSON Server separately and set `VITE_API_URL` to that API URL.

## Structure
```
src/
  api/client.ts          Axios instance (VITE_API_URL)
  types/                 shared types
  constants/             roles, stages, priorities, nav config
  context/AppContext.tsx auth, workspace, role, toasts
  hooks/                 useRes (fetch), usePlan/useLimit (plan limits)
  utils/                 activity log, vote toggle, formatting
  components/
    ui/                  Spin, State (loading/error/empty), Warn
    forms/               Field, Form (validation), Crud (generic CRUD)
    layout/Shell.tsx     sidebar + header
    routing/guards.tsx   Auth, role Guard
  pages/                 auth, workspaces, dashboard, feedback, categories,
                         roadmap, releases, team, subscription, settings, public
  App.tsx                routes only
```
