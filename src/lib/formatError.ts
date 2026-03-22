export function formatError(e: unknown): string {
  if (e instanceof Error) return e.message;
  const s = String(e);
  if (s === "undefined" || s === "null" || s === "[object Object]") {
    return "An unexpected error occurred. Please try again.";
  }
  return s;
}
