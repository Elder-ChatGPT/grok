const express = require("express");

const ALLOWED = new Set(["who5", "sleep", "nutrition", "mobility", "cognition"]);
const requests = new Map();

function sanitizeResults(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return [];
  return Object.entries(input).filter(([id]) => ALLOWED.has(id)).slice(0, 5).map(([id, value]) => ({
    id,
    label: String(value?.label || "Not interpreted").slice(0, 100),
    level: ["good", "watch", "attention"].includes(value?.level) ? value.level : "watch",
    score: Number.isFinite(Number(value?.score)) ? Number(value.score) : null,
    maximum: Number.isFinite(Number(value?.max)) ? Number(value.max) : null,
    calibratedMeaning: String(value?.summary || "").slice(0, 300),
    calibratedNextStep: String(value?.action || "").slice(0, 300),
  }));
}

function rateLimited(key) {
  const now = Date.now(), windowMs = 15 * 60_000, current = requests.get(key);
  if (!current || now > current.reset) { requests.set(key, { count: 1, reset: now + windowMs }); return false; }
  current.count += 1; return current.count > 8;
}

function validatePlan(value) {
  if (!value || typeof value !== "object") throw new Error("Invalid AI response");
  const actions = Array.isArray(value.actions) ? value.actions.slice(0, 4).map(item => ({
    title: String(item?.title || "Next step").slice(0, 80),
    detail: String(item?.detail || "").slice(0, 260),
    timeframe: String(item?.timeframe || "This week").slice(0, 40),
    basedOn: String(item?.basedOn || "Completed screening").slice(0, 100),
  })).filter(item => item.detail) : [];
  if (!actions.length) throw new Error("AI returned no usable actions");
  return {
    headline: String(value.headline || "Your personalised next steps").slice(0, 120),
    overview: String(value.overview || "").slice(0, 500), actions,
    clinicianNote: String(value.clinicianNote || "").slice(0, 300),
    encouragement: String(value.encouragement || "").slice(0, 180),
  };
}

function createAdviceRouter({ cohere }) {
  const router = express.Router();
  router.post("/generate", async (req, res) => {
    if (rateLimited(req.ip || "unknown")) return res.status(429).json({ error: "You have generated several plans. Please wait 15 minutes before trying again." });
    const results = sanitizeResults(req.body.results);
    if (!results.length) return res.status(400).json({ error: "Complete at least one health check before generating advice." });
    if (!process.env.COHERE_API_KEY) return res.status(503).json({ error: "Personalised AI advice is not configured." });

    const prompt = `Generate a JSON wellness plan for an older adult from the screening results below.\n\nCALIBRATED RESULTS:\n${JSON.stringify(results, null, 2)}\n\nRules:\n- Treat every result as screening, never diagnosis.\n- Do not reinterpret or contradict the calibrated score.\n- Give 2 to 4 specific, low-cost, culturally neutral, achievable actions.\n- Explicitly connect every action to one or more supplied results.\n- Prioritize any result marked attention.\n- Do not suggest starting/stopping medication, supplements, restrictive diets, or unsupervised exercise after a mobility flag.\n- Recommend professional review for attention results, new decline, or persistent symptoms.\n- Include urgent escalation only for severe symptoms such as chest pain, trouble breathing, fainting, sudden confusion, or thoughts of self-harm.\n- Be warm, concise, respectful, and avoid assumptions about race, income, family structure, or location.\n- Return JSON only with headline, overview, actions (title, detail, timeframe, basedOn), clinicianNote, encouragement.`;
    try {
      const response = await cohere.chat({
        model: process.env.COHERE_MODEL || "command-a-03-2025",
        messages: [
          { role: "system", content: "You are SLEDSS, a cautious healthy-ageing wellness coach. Follow calibrated screening interpretations exactly and never claim to diagnose, treat, or replace professional care." },
          { role: "user", content: prompt }
        ],
        responseFormat: { type: "json_object" },
        temperature: 0.25,
        maxTokens: 900,
      });
      const text = response?.message?.content?.map(part => part.text || "").join("").trim();
      const plan = validatePlan(JSON.parse(text));
      return res.json({ plan, model: process.env.COHERE_MODEL || "command-a-03-2025", generatedAt: new Date().toISOString(), evidence: results.map(item => ({ id: item.id, label: item.label, level: item.level })), disclaimer: "AI-personalised wellness guidance based on screening results; not a diagnosis or substitute for professional care." });
    } catch (error) {
      console.error("Cohere advice error:", error.message);
      return res.status(502).json({ error: "Cohere could not generate a safe plan right now. Your calibrated results remain available—please try again shortly." });
    }
  });
  return router;
}

module.exports = { createAdviceRouter, sanitizeResults, validatePlan };

