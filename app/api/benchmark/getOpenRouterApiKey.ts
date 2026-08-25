export function normalizeApiKey(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value
    .trim()
    .replace(/^Bearer\s+/i, "")
    .replace(/^["']|["']$/g, "")
    .trim();
  return trimmed || undefined;
}

export function getEnvOpenRouterApiKey(): string | undefined {
  return normalizeApiKey(
    process.env.OPENROUTER_API_KEY ||
      process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
      process.env.VITE_OPENROUTER_API_KEY
  );
}

export function getOpenRouterApiKey(request?: Request): string | undefined {
  if (request) {
    const fromHeader = normalizeApiKey(request.headers.get("x-openrouter-key"));
    if (fromHeader) return fromHeader;
  }
  return getEnvOpenRouterApiKey();
}
