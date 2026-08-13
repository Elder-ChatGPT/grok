const API_URL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5009").replace(/\/$/, "");
const SESSION_KEY = "sledss_session";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}/api/auth${path}`, { ...options, headers:{ "Content-Type":"application/json", ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const error=new Error(data.error || "Something went wrong"); error.status=response.status; error.code=data.code; error.field=data.field; throw error; }
  return data;
}
export function savedSession(){ try { return JSON.parse(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)); } catch { return null; } }
export function saveSession(session, remember=true){ clearSession(); (remember ? localStorage : sessionStorage).setItem(SESSION_KEY,JSON.stringify(session)); }
export function clearSession(){ localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY); }
export const login = credentials => request("/login",{method:"POST",body:JSON.stringify(credentials)});
export const register = details => request("/register",{method:"POST",body:JSON.stringify(details)});
export const getMe = token => request("/me",{headers:{Authorization:`Bearer ${token}`}});
