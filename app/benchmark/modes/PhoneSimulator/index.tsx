"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Loader2, Play } from "lucide-react";
import { DEFAULT_PHONE_MODEL_ID, MODELS, getModelById } from "../../config/models";
import { callModel, MissingApiKeyError } from "../../core/openrouter";
import { buildTitle } from "../../core/parseResult";
import { formatConfidence, formatMs, latencyClass } from "../../core/latency";
import type { BenchmarkImage, DetectionResult, TitleOverrides } from "../../core/types";
import { cn } from "@/lib/utils";
import { ListingFormFill } from "./ListingFormFill";
import { PostAdMockup } from "./PostAdMockup";

interface PhoneSimulatorProps {
  image: BenchmarkImage | null;
  hasApiKey: boolean;
}

const FIELD_STEPS = 8;

export function PhoneSimulator({ image, hasApiKey }: PhoneSimulatorProps) {
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_PHONE_MODEL_ID);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [inferenceMs, setInferenceMs] = useState<number | null>(null);
  const [liveMs, setLiveMs] = useState(0);
  const [loadStartedAt, setLoadStartedAt] = useState<number | null>(null);
  const [detection, setDetection] = useState<DetectionResult | null>(null);
  const [rawText, setRawText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<TitleOverrides>({});
  const [revealed, setRevealed] = useState(0);
  const [rawOpen, setRawOpen] = useState(false);

  const model = getModelById(selectedModelId) ?? MODELS[0];

  useEffect(() => {
    if (status !== "loading" || loadStartedAt == null) return;
    const id = window.setInterval(() => {
      setLiveMs(Date.now() - loadStartedAt);
    }, 100);
    return () => window.clearInterval(id);
  }, [status, loadStartedAt]);

  useEffect(() => {
    if (status !== "done" || !detection?.detected) {
      setRevealed(0);
      return;
    }
    setRevealed(0);
    let step = 0;
    const id = window.setInterval(() => {
      step += 1;
      setRevealed(step);
      if (step >= FIELD_STEPS) window.clearInterval(id);
    }, 150);
    return () => window.clearInterval(id);
  }, [status, detection]);

  const title = useMemo(
    () => buildTitle(detection, overrides),
    [detection, overrides]
  );

  const simulate = async () => {
    if (!image || !model) return;
    setStatus("loading");
    setError(null);
    setDetection(null);
    setOverrides({});
    setInferenceMs(null);
    setRawText("");
    const started = Date.now();
    setLoadStartedAt(started);
    setLiveMs(0);

    try {
      const { result, rawText: raw, inferenceMs: ms } = await callModel(
        model.modelString,
        image.base64,
        image.mimeType
      );
      setDetection(result);
      setRawText(raw);
      setInferenceMs(ms);
      setStatus("done");
    } catch (err) {
      const message =
        err instanceof MissingApiKeyError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Simulation failed";
      setError(message);
      setInferenceMs(Date.now() - started);
      setStatus("error");
    }
  };

  const canRun = Boolean(image) && hasApiKey && status !== "loading";

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(280px,1fr)_auto]">
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">
            Model — one at a time, like production
          </label>
          <select
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-2.5 text-sm text-gray-100 outline-none focus:border-violet-500"
          >
            {MODELS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} · {item.badge} · {item.expectedMs}
                {item.free ? "" : " · PAID"}
              </option>
            ))}
          </select>
          {model ? (
            <p className="mt-2 text-xs text-gray-500">{model.notes}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => void simulate()}
          disabled={!canRun}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
            canRun
              ? "bg-violet-600 text-white hover:bg-violet-500"
              : "cursor-not-allowed bg-gray-800 text-gray-500"
          )}
        >
          {status === "loading" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Play className="size-4" />
          )}
          {status === "loading" ? "Simulating…" : "Simulate"}
        </button>

        <div className="space-y-2 rounded-xl border border-gray-800 bg-gray-900 p-4 text-sm">
          <Metric label="Selected model">
            <span className="flex items-center gap-2">
              {model?.name}
              {model ? (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-black"
                  style={{ backgroundColor: model.badgeColor }}
                >
                  {model.badge}
                </span>
              ) : null}
            </span>
          </Metric>
          <Metric label="⏱ Inference time">
            {status === "loading" ? (
              <span className={latencyClass(liveMs)}>{formatMs(liveMs)}</span>
            ) : inferenceMs != null ? (
              <span className={latencyClass(inferenceMs)}>{formatMs(inferenceMs)}</span>
            ) : (
              <span className="text-gray-500">—</span>
            )}
          </Metric>
          <Metric label="📶 Simulated network">
            4G (~50Mbps) — API latency only, same as phone
          </Metric>
          <Metric label="🖼 Image stats">
            {image ? (
              <span>
                Original {image.originalSizeKB}kb → Compressed {image.compressedSizeKB}kb
                (Expo compression), {image.width}×{image.height}px
              </span>
            ) : (
              <span className="text-gray-500">No image yet</span>
            )}
          </Metric>
          <Metric label="✅ Detected">
            {detection ? (detection.detected ? "yes" : "no") : "—"}
          </Metric>
          <Metric label="💪 Confidence">
            {detection?.detected ? formatConfidence(detection.confidence) : "—"}
          </Metric>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900">
          <button
            type="button"
            onClick={() => setRawOpen((open) => !open)}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-gray-300"
          >
            📝 Raw JSON
            <span className="text-xs text-gray-500">{rawOpen ? "Hide" : "Show"}</span>
          </button>
          {rawOpen ? (
            <pre className="max-h-72 overflow-auto border-t border-gray-800 p-4 font-mono text-[11px] text-gray-400">
              {rawText || (detection ? JSON.stringify(detection, null, 2) : "No result yet")}
            </pre>
          ) : null}
        </div>
      </div>

      <PostAdMockup>
        <ListingFormFill
          preview={image?.preview ?? null}
          status={status}
          detection={detection}
          revealed={revealed}
          overrides={overrides}
          title={title}
          error={error}
          onOverride={(patch) => setOverrides((prev) => ({ ...prev, ...patch }))}
        />
      </PostAdMockup>
    </div>
  );
}

function Metric({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="shrink-0 text-gray-500">{label}</span>
      <span className="text-right text-gray-200">{children}</span>
    </div>
  );
}
