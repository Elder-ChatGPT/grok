# SLEDSS web application

The current frontend is a Vite and React application for healthy-ageing screening, sensor readiness and personalised guidance.

## Requirements

- Node.js 20 or newer
- The SLEDSS API running on port 5009

## Start

```powershell
cd sledss2
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

To use another API address, create `.env.local`:

```dotenv
VITE_BACKEND_URL=http://localhost:5009
```

## Production build

```powershell
npm run build
```

Vite writes the production files to `build`.

## Family Circle connection

When SLEDSS runs inside the Family Circle desktop app, the isolated view receives a validated
`familycircle:identity` event containing the signed-in member's name and email. SLEDSS uses that
identity for the current view and does not show its own registration or login screen.

After a health check, SLEDSS emits a versioned `familycircle:sledss-result` event. Family Circle
validates it, stores the full result under the current local account, and exposes only a summary
to its renderer. The normal browser experience and SLEDSS login remain available outside Family Circle.

## Current source layout

- `src/App.jsx` — dashboard and application shell
- `src/components/` — authentication, assessments and combined guidance
- `src/components/GamesCorner.jsx` — accessible recreational games and local play progress
- `src/data/` — calibrated assessments and wellness model
- `src/api/` — authentication and Cohere advice clients
- `src/assets/` — current inclusive hero image
