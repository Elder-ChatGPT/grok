const API_URL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5009").replace(/\/$/, "");

export async function generateCohereAdvice(results, token) {
  const response = await fetch(`${API_URL}/api/advice/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ results }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Personalised advice could not be generated.");
  return data;
}
