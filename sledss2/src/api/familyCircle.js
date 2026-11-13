const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isFamilyCircleLaunch(location = globalThis.location) {
  try { return new URLSearchParams(location?.search || "").get("family_circle") === "1"; }
  catch { return false; }
}

export function familyCircleIdentity(value) {
  if (!value || typeof value !== "object") return null;
  const email = String(value.email || "").trim().toLowerCase();
  const name = String(value.name || "").trim();
  if (!EMAIL.test(email) || !name || email.length > 254 || name.length > 100) return null;
  return { email, name };
}

export function subscribeToFamilyCircle(target, onIdentity) {
  const connect = event => {
    const identity = familyCircleIdentity(event?.detail);
    if (identity) onIdentity(identity);
  };
  target.addEventListener("familycircle:identity", connect);
  if (target.__familyCircleIdentity) connect({ detail: target.__familyCircleIdentity });
  return () => target.removeEventListener("familycircle:identity", connect);
}

export function familyCircleResult(id, title, result, randomUUID = globalThis.crypto?.randomUUID?.bind(globalThis.crypto)) {
  const eventId = randomUUID?.() || `event-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return { version: 1, eventId, assessment: { id, title: title || id }, result };
}

export function publishFamilyCircleResult(target, payload) {
  target.dispatchEvent(new CustomEvent("familycircle:sledss-result", { detail: payload }));
}
