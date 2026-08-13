const assert = require("assert");
const { cleanEmail, validatePassword } = require("./auth-utils");
assert.equal(cleanEmail("  Person@Example.COM "), "person@example.com");
assert.equal(validatePassword("short"), "Use at least 8 characters");
assert.equal(validatePassword("onlyletters"), "Include at least one letter and one number");
assert.equal(validatePassword("healthy9life"), null);
console.log("auth validation tests passed");
