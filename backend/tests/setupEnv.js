// backend/tests/setupEnv.js
// Test-only values; the real .env is never read during tests.

process.env.JWT_SECRET = "test-jwt-secret";
process.env.JWT_EXPIRES_IN = "1h";
