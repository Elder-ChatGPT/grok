const express = require("express");
const neo4j = require("neo4j-driver");
const cors = require("cors");
require("dotenv").config();

const { CohereClientV2 } = require("cohere-ai");
const { createAuthRouter } = require("./auth");
const { createAdviceRouter } = require("./advice-routes");
const createSensorRouter = require("./sensor-routes");

const PORT = Number(process.env.PORT) || 5009;
const app = express();

app.disable("x-powered-by");
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER || "neo4j", process.env.NEO4J_PASSWORD || "")
);
const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY || "" });

app.get("/api/health", async (_req, res) => {
  try {
    await driver.verifyConnectivity();
    return res.json({
      status: "ready",
      database: "connected",
      advice: process.env.COHERE_API_KEY ? "configured" : "not-configured",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(503).json({
      status: "degraded",
      database: "unavailable",
      advice: process.env.COHERE_API_KEY ? "configured" : "not-configured",
      timestamp: new Date().toISOString(),
    });
  }
});

app.use("/api/auth", createAuthRouter({ driver, secret: process.env.SECRET_KEY }));
app.use("/api/advice", createAdviceRouter({ cohere }));
app.use("/api/sensors", createSensorRouter());

app.use((_req, res) => res.status(404).json({ error: "API route not found" }));
app.use((error, _req, res, _next) => {
  console.error("Unhandled API error:", error);
  res.status(500).json({ error: "Unexpected server error" });
});

const server = app.listen(PORT, () => {
  console.log(`SLEDSS API running on http://localhost:${PORT}`);
});

async function shutdown(signal) {
  console.log(`${signal} received; closing SLEDSS API`);
  server.close(async () => {
    await driver.close();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
