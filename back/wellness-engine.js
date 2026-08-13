const crypto = require("crypto");

const SIGNALS = {
  heart_rate: { unit: "bpm", min: 30, max: 230, domain: "cardiovascular" },
  hrv: { unit: "ms", min: 1, max: 300, domain: "stress" },
  spo2: { unit: "%", min: 50, max: 100, domain: "cardiovascular" },
  steps: { unit: "steps", min: 0, max: 100000, domain: "activity" },
  sleep_duration: { unit: "minutes", min: 0, max: 1440, domain: "sleep" },
  sleep_efficiency: { unit: "%", min: 0, max: 100, domain: "sleep" },
  weight: { unit: "kg", min: 20, max: 400, domain: "nutrition" },
  blood_pressure_systolic: { unit: "mmHg", min: 50, max: 300, domain: "cardiovascular" },
  blood_pressure_diastolic: { unit: "mmHg", min: 30, max: 200, domain: "cardiovascular" },
  temperature: { unit: "celsius", min: 30, max: 45, domain: "general" },
};

function validateReading(reading) {
  const definition = SIGNALS[reading.type];
  if (!definition) return { valid: false, reason: "unsupported_signal" };
  const value = Number(reading.value);
  if (!Number.isFinite(value) || value < definition.min || value > definition.max) {
    return { valid: false, reason: "outside_physiological_range" };
  }
  const capturedAt = new Date(reading.capturedAt);
  if (Number.isNaN(capturedAt.getTime()) || capturedAt > new Date(Date.now() + 300000)) {
    return { valid: false, reason: "invalid_timestamp" };
  }
  return { valid: true, value, definition, capturedAt };
}

function normalizeReading(reading) {
  const check = validateReading(reading);
  if (!check.valid) return { accepted: false, reason: check.reason };
  return {
    accepted: true,
    id: crypto.randomUUID(),
    type: reading.type,
    value: check.value,
    unit: check.definition.unit,
    domain: check.definition.domain,
    capturedAt: check.capturedAt.toISOString(),
    source: {
      deviceId: String(reading.deviceId || "unknown"),
      model: String(reading.deviceModel || "unspecified"),
      firmware: String(reading.firmware || "unspecified"),
    },
    quality: Math.max(0, Math.min(1, Number(reading.quality ?? 0.75))),
  };
}

function buildAdvice({ signals = [], assessments = {}, baseline = {} }) {
  const reliable = signals.filter(item => item.accepted && item.quality >= 0.6);
  const byType = type => reliable.filter(item => item.type === type);
  const average = type => {
    const values = byType(type).map(item => item.value);
    return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
  };
  const evidence = [];
  const actions = [];
  const sleep = average("sleep_duration");
  const steps = average("steps");
  const hrv = average("hrv");
  const stress = Number(assessments.stress?.score);

  if (sleep !== null && sleep < 420) {
    evidence.push({ domain: "sleep", meaning: "Sleep duration has been below the general seven-hour target.", strength: "moderate" });
    actions.push({ priority: 1, action: "Protect a consistent 30-minute wind-down tonight.", domain: "sleep" });
  }
  if (steps !== null && steps < Number(baseline.steps || 5000)) {
    evidence.push({ domain: "activity", meaning: "Movement is below your recent personal baseline.", strength: "moderate" });
    actions.push({ priority: 2, action: "Add one comfortable 10-minute walk, if safe for you.", domain: "activity" });
  }
  if (Number.isFinite(stress) && stress >= 14 && hrv !== null) {
    evidence.push({ domain: "stress", meaning: "Your stress check and recovery signal point in the same direction.", strength: "strong" });
    actions.push({ priority: 1, action: "Try five minutes of slow breathing and reduce late-evening stimulation.", domain: "stress" });
  }

  return {
    generatedAt: new Date().toISOString(),
    evidence,
    actions: actions.sort((a, b) => a.priority - b.priority),
    confidence: Math.min(0.95, 0.45 + reliable.length * 0.04 + Object.keys(assessments).length * 0.06),
    disclaimer: "Wellness guidance only. It does not diagnose disease or replace professional care.",
    escalation: "Seek urgent local medical help for severe symptoms, sudden deterioration, chest pain, difficulty breathing, fainting, or confusion.",
  };
}

module.exports = { SIGNALS, validateReading, normalizeReading, buildAdvice };
