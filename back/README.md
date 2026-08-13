# SLEDSS API

The backend provides authentication, wellness assessments, sensor ingestion, health-signal interpretation and personalised advice.

## Requirements

- Node.js 20 or newer
- A running Neo4j database
- A Cohere API key if AI chat/advice endpoints are used

## First-time setup (PowerShell)

From the repository root:

```powershell
cd back
Copy-Item .env.example .env
npm install
```

Open `.env` and set real values for:

```dotenv
PORT=5009
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=replace_me
SECRET_KEY=replace_with_a_long_random_secret
COHERE_API_KEY=replace_me
```

Generate a strong authentication secret in PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Copy that output into `SECRET_KEY`. Never commit `.env`.

## Start

```powershell
cd back
npm start
```

The API listens on `http://localhost:5009` unless `PORT` specifies another port. Keep this terminal running while using the frontend.

Start the frontend in a second terminal:

```powershell
cd sledss2
npm run dev
```

## Verify

Run automated tests:

```powershell
cd back
npm test
```

Check that the sensor API is reachable:

```powershell
Invoke-RestMethod http://localhost:5009/api/sensors/catalog
```

## Production files

- `server.js` — application entry point and existing assessment endpoints
- `auth.js` / `auth-utils.js` — registration, login and session validation
- `sensor-routes.js` — sensor ingestion and insight endpoints
- `wellness-engine.js` — reading validation and combined advice logic
- `*.test.js` — local automated checks
- `.env.example` — safe configuration template
- `package.json` / `package-lock.json` — scripts and pinned dependencies
