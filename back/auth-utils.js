const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function cleanEmail(value) { return String(value || "").trim().toLowerCase(); }
function validatePassword(value) {
  const password = String(value || "");
  if (password.length < 8) return "Use at least 8 characters";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Include at least one letter and one number";
  return null;
}
module.exports = { EMAIL, cleanEmail, validatePassword };
