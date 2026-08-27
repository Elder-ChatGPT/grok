# SLEDSS API

The backend provides authentication, sensor ingestion, calibrated signal interpretation and Cohere-powered personalised guidance.

## First-time setup

```powershell
cd back
Copy-Item .env.example .env
npm install
```

Set `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`, `SECRET_KEY` and `COHERE_API_KEY` in `.env`. Never commit that file.

Generate a secure authentication secret:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Start and verify

```powershell
cd back
npm start
```

The API listens on `http://localhost:5009` by default. Check it with:

```powershell
Invoke-RestMethod http://localhost:5009/api/health
```

Run the automated backend tests with `npm test`.

## Current source layout

- `server.js` — focused API entry point and health check
- `auth.js` / `auth-utils.js` — registration, login and session validation
- `advice-routes.js` — validated Cohere guidance
- `sensor-routes.js` / `wellness-engine.js` — sensor ingestion and interpretation
- `*.test.js` — automated checks
