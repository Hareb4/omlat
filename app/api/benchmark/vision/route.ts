import { NextResponse } from "next/server";
import { DETECTION_PROMPT } from "@/app/benchmark/core/prompt";
import { parseResult } from "@/app/benchmark/core/parseResult";
import { getOpenRouterApiKey } from "../getOpenRouterApiKey";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) {
    return NextResponse.json(
      {
        code: "missing_api_key",
        error: "Add OPENROUTER_API_KEY to .env.local",
      },
      { status: 503 }
    );
  }

  let body: { modelString?: string; base64?: string; mimeType?: string };
  try {
    body = (await request.json()) as {
      modelString?: string;
      base64?: string;
      mimeType?: string;
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const modelString = body.modelString?.trim();
  const base64 = body.base64?.trim();
  const mimeType = body.mimeType || "image/jpeg";

  if (!modelString || !base64) {
    return NextResponse.json(
      { error: "modelString and base64 are required" },
      { status: 400 }
    );
  }

  const start = Date.now();

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://omlat.local/benchmark",
        "X-Title": "Marketplace Vision Benchmark",
      },
      body: JSON.stringify({
        model: modelString,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${base64}` },
              },
              {
                type: "text",
                text: DETECTION_PROMPT,
              },
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const err = (await response.json().catch(() => ({}))) as {
        error?: { message?: string };
      };
      return NextResponse.json(
        {
          error: err?.error?.message || `HTTP ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const rawText = data?.choices?.[0]?.message?.content || "";
    const inferenceMs = Date.now() - start;
    const result = parseResult(rawText);

    return NextResponse.json({
      result,
      rawText,
      inferenceMs,
      modelString,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "OpenRouter request failed",
      },
      { status: 502 }
    );
  }
}
