"use client";

import { useState } from "react";
import { Copy, Flag, Loader2 } from "lucide-react";
import { getModelById } from "../../config/models";
import { ModelSelector } from "../../components/ModelSelector";
import { callModel, MissingApiKeyError } from "../../core/openrouter";
import type { BenchmarkImage, RaceCardResult } from "../../core/types";
import { cn } from "@/lib/utils";
import { ComparisonTable } from "./ComparisonTable";
import { ModelCard } from "./ModelCard";

interface RaceModeProps {
  image: BenchmarkImage | null;
  enabledModels: string[];
  onEnabledModels: (ids: string[]) => void;
  hasApiKey: boolean;
}

export function RaceMode({
  image,
  enabledModels,
  onEnabledModels,
  hasApiKey,
}: RaceModeProps) {
  const [results, setResults] = useState<Record<string, RaceCardResult>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const finished =
    !isRunning &&
    enabledModels.length > 0 &&
    enabledModels.every((id) => {
      const status = results[id]?.status;
      return status === "success" || status === "error";
    });

  const runRace = async () => {
    if (!image || enabledModels.length === 0) return;
    setIsRunning(true);

    const initial: Record<string, RaceCardResult> = {};
    const now = Date.now();
    enabledModels.forEach((id) => {
      initial[id] = { status: "loading", startTime: now };
    });
    setResults(initial);

    await Promise.allSettled(
      enabledModels.map(async (modelId) => {
        const model = getModelById(modelId);
        if (!model) return;
        const start = Date.now();
        try {
          const { result, rawText, inferenceMs } = await callModel(
            model.modelString,
            image.base64,
            image.mimeType
          );
          setResults((prev) => ({
            ...prev,
            [modelId]: { status: "success", result, rawText, inferenceMs },
          }));
        } catch (err) {
          const message =
            err instanceof MissingApiKeyError
              ? err.message
              : err instanceof Error
                ? err.message
                : "Request failed";
          setResults((prev) => ({
            ...prev,
            [modelId]: {
              status: "error",
              error: message,
              inferenceMs: Date.now() - start,
            },
          }));
        }
      })
    );

    setIsRunning(false);
  };

  const copyAll = async () => {
    const payload = {
      ranAt: new Date().toISOString(),
      image: image
        ? {
            width: image.width,
            height: image.height,
            originalSizeKB: image.originalSizeKB,
            compressedSizeKB: image.compressedSizeKB,
          }
        : null,
      results: enabledModels.map((id) => {
        const model = getModelById(id);
        const card = results[id];
        return {
          id,
          name: model?.name,
          modelString: model?.modelString,
          status: card?.status,
          inferenceMs: card?.inferenceMs,
          error: card?.error,
          result: card?.result,
          rawText: card?.rawText,
        };
      }),
    };
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const canRace = Boolean(image) && hasApiKey && !isRunning && enabledModels.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.preview}
            alt="Race preview"
            className="h-28 w-28 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-xl border border-dashed border-gray-700 text-xs text-gray-500">
            No image
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-3">
          <ModelSelector enabledIds={enabledModels} onChange={onEnabledModels} />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void runRace()}
              disabled={!canRace}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold",
                canRace
                  ? "bg-violet-600 text-white hover:bg-violet-500"
                  : "cursor-not-allowed bg-gray-800 text-gray-500"
              )}
            >
              {isRunning ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Flag className="size-4" />
              )}
              {isRunning ? "Racing…" : "Race All Models"}
            </button>
            {finished ? (
              <button
                type="button"
                onClick={() => void copyAll()}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-700 px-4 py-2.5 text-sm text-gray-200"
              >
                <Copy className="size-4" />
                {copied ? "Copied" : "Copy All Results as JSON"}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {enabledModels.map((id) => {
          const model = getModelById(id);
          if (!model) return null;
          return (
            <ModelCard
              key={id}
              model={model}
              card={results[id]}
              hasApiKey={hasApiKey}
            />
          );
        })}
      </div>

      {enabledModels.length === 0 ? (
        <p className="text-sm text-amber-300">Enable at least one model to race.</p>
      ) : null}

      {finished ? (
        <ComparisonTable enabledIds={enabledModels} results={results} />
      ) : null}
    </div>
  );
}
