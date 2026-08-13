const express = require("express");
const { SIGNALS, normalizeReading, buildAdvice } = require("./wellness-engine");

function createSensorRouter() {
  const router = express.Router();
  const readings = new Map(); // Replace with encrypted persistence in production.

  router.get("/catalog", (_req, res) => res.json({ signals: SIGNALS }));

  router.post("/readings", (req, res) => {
    const batch = Array.isArray(req.body.readings) ? req.body.readings : [req.body];
    if (batch.length > 500) return res.status(413).json({ error: "Batch exceeds 500 readings" });
    const userId = String(req.body.userId || req.headers["x-user-id"] || "");
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const normalized = batch.map(normalizeReading);
    const current = readings.get(userId) || [];
    readings.set(userId, [...current, ...normalized.filter(item => item.accepted)].slice(-10000));
    res.status(202).json({ accepted: normalized.filter(item => item.accepted).length, rejected: normalized.filter(item => !item.accepted) });
  });

  router.post("/insights", (req, res) => {
    const userId = String(req.body.userId || "");
    if (!userId) return res.status(400).json({ error: "userId is required" });
    res.json(buildAdvice({ signals: readings.get(userId) || [], assessments: req.body.assessments, baseline: req.body.baseline }));
  });

  return router;
}

module.exports = createSensorRouter;
