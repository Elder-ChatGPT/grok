import assert from "node:assert/strict";
import test from "node:test";
import { familyCircleIdentity, familyCircleResult, isFamilyCircleLaunch } from "./familyCircle.js";

test("recognizes only the explicit Family Circle launch marker", () => {
  assert.equal(isFamilyCircleLaunch({ search: "?family_circle=1" }), true);
  assert.equal(isFamilyCircleLaunch({ search: "?family_circle=0" }), false);
  assert.equal(isFamilyCircleLaunch({ search: "" }), false);
});

test("accepts a bounded Family Circle identity and normalizes its email", () => {
  assert.deepEqual(familyCircleIdentity({ email: " Ada@Example.Test ", name: "Ada" }), { email: "ada@example.test", name: "Ada" });
  assert.equal(familyCircleIdentity({ email: "not-an-email", name: "Ada" }), null);
  assert.equal(familyCircleIdentity({ email: "ada@example.test", name: "" }), null);
});

test("creates the versioned assessment result contract", () => {
  const payload = familyCircleResult("who5", "WHO-5", { score: 64, completedAt: "2026-11-12T00:00:00.000Z" }, () => "event-12345678");
  assert.deepEqual(payload, {
    version: 1,
    eventId: "event-12345678",
    assessment: { id: "who5", title: "WHO-5" },
    result: { score: 64, completedAt: "2026-11-12T00:00:00.000Z" },
  });
});
