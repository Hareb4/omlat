export function getOpenRouterApiKey(): string | undefined {
  return (
    process.env.OPENROUTER_API_KEY ||
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
    process.env.VITE_OPENROUTER_API_KEY
  );
}
