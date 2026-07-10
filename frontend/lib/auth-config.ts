const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const isClerkConfigured = Boolean(
  publishableKey &&
    publishableKey.startsWith("pk_") &&
    !publishableKey.includes("replace_me"),
);

export const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://localhost:4000";
