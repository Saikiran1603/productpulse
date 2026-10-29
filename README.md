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
JSON Server must be hosted too (e.g. Render web service running `npm run api`). Deploy the frontend to Netlify/Vercel with env var `VITE_API_URL=https://your-api-host`. SPA rewrites are included (`public/_redirects`, `vercel.json`).

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
