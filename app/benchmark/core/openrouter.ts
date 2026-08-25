import type { ModelCallResponse } from "./types";

export class MissingApiKeyError extends Error {
  constructor() {
    super("Add OPENROUTER_API_KEY to .env.local");
    this.name = "MissingApiKeyError";
  }
}

export async function callModel(
  modelString: string,
  base64: string,
  mimeType = "image/jpeg"
): Promise<ModelCallResponse> {
  const start = Date.now();

  const response = await fetch("/api/benchmark/vision", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ modelString, base64, mimeType }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    code?: string;
    error?: string;
    result?: ModelCallResponse["result"];
    rawText?: string;
    inferenceMs?: number;
    modelString?: string;
  };

  if (!response.ok) {
    if (data?.code === "missing_api_key") {
      throw new MissingApiKeyError();
    }
    throw new Error(data?.error || `HTTP ${response.status}`);
  }

  return {
    result: data.result as ModelCallResponse["result"],
    rawText: data.rawText || "",
    inferenceMs: Date.now() - start,
    modelString: data.modelString || modelString,
  };
}

export async function checkApiKey(): Promise<boolean> {
  try {
    const response = await fetch("/api/benchmark/status");
    if (!response.ok) return false;
    const data = (await response.json()) as { hasKey?: boolean };
    return Boolean(data.hasKey);
  } catch {
    return false;
  }
}
