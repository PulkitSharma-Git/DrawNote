// JWT_SECRET must be explicitly set as an environment variable.
// We intentionally do NOT provide a fallback — if it's missing, we fail fast
// at startup rather than silently using an insecure default that anyone can guess.
if (!process.env.JWT_SECRET) {
  throw new Error(
    "FATAL: JWT_SECRET environment variable is not set. " +
    "Set it in your .env file locally or in the Render dashboard for production."
  );
}

export const JWT_SECRET = process.env.JWT_SECRET;