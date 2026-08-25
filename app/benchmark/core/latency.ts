export function latencyClass(ms: number): string {
  if (ms < 500) return "text-emerald-400";
  if (ms <= 1500) return "text-amber-400";
  return "text-red-400";
}

export function confidenceBarClass(confidence: number): string {
  if (confidence >= 0.8) return "bg-emerald-500";
  if (confidence >= 0.5) return "bg-amber-500";
  return "bg-red-500";
}

export function formatMs(ms: number): string {
  return `${Math.round(ms)}ms`;
}

export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}
