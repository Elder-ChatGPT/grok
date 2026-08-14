const assert = require("assert");
const { normalizeReading, buildAdvice } = require("./wellness-engine");

const valid = normalizeReading({ type: "sleep_duration", value: 390, capturedAt: new Date().toISOString(), deviceId: "band-01", quality: .9 });
assert.equal(valid.accepted, true);
assert.equal(valid.unit, "minutes");
assert.equal(normalizeReading({ type: "spo2", value: 140, capturedAt: new Date().toISOString() }).accepted, false);
const advice = buildAdvice({ signals: [valid], assessments: {}, baseline: {} });
assert.equal(advice.actions[0].domain, "sleep");
assert.ok(advice.confidence > 0 && advice.confidence <= 1);
console.log("wellness-engine tests passed");
