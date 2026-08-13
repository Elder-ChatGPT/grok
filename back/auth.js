const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const attempts = new Map();
const { EMAIL, cleanEmail, validatePassword } = require("./auth-utils");
function publicUser(record) {
  return { id: record.get("userID"), email: record.get("email"), firstName: record.get("firstName"), yearOfBirth: record.get("yearOfBirth"), gender: record.get("gender") };
}
function limited(key) {
  const now = Date.now(); const entry = attempts.get(key) || { count: 0, reset: now + 15 * 60_000 };
  if (now > entry.reset) { attempts.delete(key); return false; }
  return entry.count >= 8;
}
function failed(key) { const now=Date.now(); const entry=attempts.get(key)||{count:0,reset:now+15*60_000}; entry.count += 1; attempts.set(key,entry); }

function createAuthRouter({ driver, secret }) {
  const router = express.Router();
  router.post("/register", async (req, res) => {
    const email = cleanEmail(req.body.email); const password = String(req.body.password || "");
    const firstName = String(req.body.firstName || "").trim().slice(0, 60);
    const yearOfBirth = Number(req.body.yearOfBirth); const gender = String(req.body.gender || "prefer-not-to-say").slice(0, 40);
    if (!firstName) return res.status(400).json({ error: "Please enter your first name", field: "firstName" });
    if (!EMAIL.test(email)) return res.status(400).json({ error: "Enter a valid email address", field: "email" });
    const passwordError = validatePassword(password); if (passwordError) return res.status(400).json({ error: passwordError, field: "password" });
    const year = new Date().getFullYear();
    if (!Number.isInteger(yearOfBirth) || yearOfBirth < year - 120 || yearOfBirth > year - 18) return res.status(400).json({ error: "Enter a valid year of birth for an adult", field: "yearOfBirth" });
    const session = driver.session();
    try {
      const existing = await session.run("MATCH (u:Person {email: $email}) RETURN u LIMIT 1", { email });
      if (existing.records.length) return res.status(409).json({ error: "An account with this email already exists", code: "ACCOUNT_EXISTS" });
      const passwordHash = await bcrypt.hash(password, 12);
      const result = await session.run(`CREATE (u:Person {userID: randomUUID(), email: $email, password: $passwordHash, firstName: $firstName, yearOfBirth: $yearOfBirth, age: $age, gender: $gender, createdAt: datetime()}) RETURN u.userID AS userID, u.email AS email, u.firstName AS firstName, u.yearOfBirth AS yearOfBirth, u.gender AS gender`, { email, passwordHash, firstName, yearOfBirth, age: year-yearOfBirth, gender });
      return res.status(201).json({ message: "Account created", user: publicUser(result.records[0]) });
    } catch (error) { console.error("Registration error:", error); return res.status(500).json({ error: "We could not create your account. Please try again." }); }
    finally { await session.close(); }
  });

  router.post("/login", async (req, res) => {
    const email = cleanEmail(req.body.email); const password = String(req.body.password || ""); const key = `${req.ip}:${email}`;
    if (limited(key)) return res.status(429).json({ error: "Too many attempts. Please wait 15 minutes and try again." });
    if (!EMAIL.test(email) || !password) return res.status(400).json({ error: "Enter your email and password" });
    if (!secret) return res.status(503).json({ error: "Login is not configured on this server" });
    const session = driver.session();
    try {
      const result = await session.run(`MATCH (u:Person {email: $email}) RETURN u.userID AS userID, u.email AS email, u.password AS passwordHash, coalesce(u.firstName, split(u.email, '@')[0]) AS firstName, u.yearOfBirth AS yearOfBirth, u.gender AS gender`, { email });
      const record = result.records[0]; const valid = record && await bcrypt.compare(password, record.get("passwordHash") || "");
      if (!valid) { failed(key); return res.status(401).json({ error: "Email or password is incorrect", code: "INVALID_CREDENTIALS" }); }
      attempts.delete(key); const user = publicUser(record);
      const token = jwt.sign({ sub:user.id, email:user.email, type:"access" }, secret, { expiresIn:"8h", issuer:"sledss", audience:"sledss-web" });
      return res.json({ message:"Welcome back", token, expiresIn:28800, user });
    } catch (error) { console.error("Login error:", error); return res.status(500).json({ error:"We could not sign you in. Please try again." }); }
    finally { await session.close(); }
  });

  router.get("/me", async (req, res) => {
    const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!token || !secret) return res.status(401).json({ error:"Please sign in" });
    let payload; try { payload = jwt.verify(token, secret, { issuer:"sledss", audience:"sledss-web" }); } catch { return res.status(401).json({ error:"Your session has expired", code:"SESSION_EXPIRED" }); }
    const session = driver.session();
    try { const result=await session.run(`MATCH (u:Person {userID:$id}) RETURN u.userID AS userID, u.email AS email, coalesce(u.firstName, split(u.email,'@')[0]) AS firstName, u.yearOfBirth AS yearOfBirth, u.gender AS gender`,{id:payload.sub}); if(!result.records.length)return res.status(401).json({error:"Account not found"}); return res.json({user:publicUser(result.records[0])}); }
    finally { await session.close(); }
  });
  return router;
}

module.exports = { createAuthRouter };
