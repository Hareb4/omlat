"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, Copy, Loader2 } from "lucide-react";
import type { VisionModel } from "../../config/models";
import { AlternativeChips } from "../../components/AlternativeChips";
import { SpecChips } from "../../components/SpecChips";
import { buildTitle } from "../../core/parseResult";
import {
  confidenceBarClass,
  formatConfidence,
  formatMs,
  latencyClass,
} from "../../core/latency";
import type { RaceCardResult, TitleOverrides } from "../../core/types";
import { cn } from "@/lib/utils";

interface ModelCardProps {
  model: VisionModel;
  card: RaceCardResult | undefined;
  hasApiKey: boolean;
}

export function ModelCard({ model, card, hasApiKey }: ModelCardProps) {
  const status = !hasApiKey ? "disabled" : card?.status ?? "idle";
  const [liveMs, setLiveMs] = useState(0);
  const [overrides, setOverrides] = useState<TitleOverrides>({});
  const [copied, setCopied] = useState(false);
  const [rawOpen, setRawOpen] = useState(false);

  useEffect(() => {
    if (status !== "loading" || card?.startTime == null) return;
    const id = window.setInterval(() => {
      setLiveMs(Date.now() - (card.startTime ?? Date.now()));
    }, 100);
    return () => window.clearInterval(id);
  }, [status, card?.startTime]);

  useEffect(() => {
    setOverrides({});
  }, [card?.result]);

  const detection = card?.result;
  const title =
    detection?.detected ? buildTitle(detection, overrides) : "";

  const copyTitle = async () => {
    if (!title) return;
    await navigator.clipboard.writeText(title);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <article
      className={cn(
        "flex flex-col rounded-xl border bg-gray-900 p-4",
        status === "error" && "border-red-400",
        status === "disabled" && "border-amber-400",
        status === "success" && "border-gray-800",
        (status === "idle" || status === "loading") && "border-gray-800"
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-100">{model.name}</h3>
          <p className="mt-1 text-[11px] text-gray-500">{model.expectedMs}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-black"
            style={{ backgroundColor: model.badgeColor }}
          >
            {model.badge}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
              model.free
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-amber-500/20 text-amber-300"
            )}
          >
            {model.free ? "FREE" : "PAID"}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-3">
        {status === "disabled" ? (
          <p className="text-sm text-amber-300">
            Add OPENROUTER_API_KEY to .env.local
          </p>
        ) : null}

        {status === "idle" ? (
          <p className="text-sm text-gray-500">Waiting to run</p>
        ) : null}

        {status === "loading" ? (
          <div className="flex items-center gap-2 text-sm">
            <Loader2 className="size-4 animate-spin text-violet-400" />
            <span className={cn("font-mono tabular-nums", latencyClass(liveMs))}>
              {formatMs(liveMs)}
            </span>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="flex items-start gap-2 text-sm text-red-300">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>{card?.error}</span>
          </div>
        ) : null}

        {status === "success" && detection && !detection.detected ? (
          <p className="text-sm text-amber-200">Not detected: {detection.reason}</p>
        ) : null}

        {status === "success" && detection?.detected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className={cn("font-mono text-sm tabular-nums", latencyClass(card?.inferenceMs ?? 0))}>
                {formatMs(card?.inferenceMs ?? 0)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-100">
                ✅ {overrides.model ?? detection.model}
              </p>
              <p className="text-xs text-gray-400">
                {detection.brand} • {detection.category}
              </p>
            </div>
            <div>
              <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-gray-800">
                <div
                  className={cn("h-full rounded-full", confidenceBarClass(detection.confidence))}
                  style={{ width: `${Math.round(detection.confidence * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-400">
                {formatConfidence(detection.confidence)} confidence
              </p>
            </div>
            <AlternativeChips
              alternatives={[
                { model: detection.model, note: "Best guess" },
                ...detection.alternatives.filter((a) => a.model !== detection.model),
              ]}
              selectedModel={overrides.model ?? detection.model}
              onSelect={(next) => setOverrides((prev) => ({ ...prev, model: next }))}
            />
            <SpecRow detection={detection} overrides={overrides} onOverride={setOverrides} />
            <div className="rounded-lg border border-violet-400/60 bg-violet-950 p-2.5">
              <p className="text-xs leading-snug text-violet-100">{title}</p>
            </div>
            <button
              type="button"
              onClick={() => void copyTitle()}
              className="inline-flex items-center gap-1 text-xs text-gray-300"
            >
              {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        ) : null}
      </div>

      {(card?.rawText || card?.result) && (
        <div className="mt-3 border-t border-gray-800 pt-2">
          <button
            type="button"
            onClick={() => setRawOpen((open) => !open)}
            className="text-[11px] text-gray-500"
          >
            Developer {rawOpen ? "▾" : "▸"}
          </button>
          {rawOpen ? (
            <pre className="mt-2 max-h-40 overflow-auto font-mono text-[10px] text-gray-500">
              {card.rawText || JSON.stringify(card.result, null, 2)}
            </pre>
          ) : null}
        </div>
      )}
    </article>
  );
}

function SpecRow({
  detection,
  overrides,
  onOverride,
}: {
  detection: Extract<NonNullable<RaceCardResult["result"]>, { detected: true }>;
  overrides: TitleOverrides;
  onOverride: (next: TitleOverrides | ((prev: TitleOverrides) => TitleOverrides)) => void;
}) {
  const patch = (part: TitleOverrides) =>
    onOverride((prev) => ({ ...prev, ...part }));

  switch (detection.category) {
    case "phone":
      return (
        <SpecChips
          options={detection.storage_options}
          selected={overrides.storage ?? detection.storage}
          onSelect={(storage) => patch({ storage })}
        />
      );
    case "laptop":
      return (
        <div className="space-y-2">
          <SpecChips
            options={detection.ram_options}
            selected={overrides.ram ?? detection.ram}
            onSelect={(ram) => patch({ ram })}
            label="RAM"
          />
          <SpecChips
            options={detection.storage_options}
            selected={overrides.storage ?? detection.storage}
            onSelect={(storage) => patch({ storage })}
            label="SSD"
          />
        </div>
      );
    case "car":
      return (
        <SpecChips
          options={detection.year_options}
          selected={overrides.year ?? detection.year}
          onSelect={(year) => patch({ year })}
        />
      );
    default: {
      const _exhaustive: never = detection;
      return _exhaustive;
    }
  }
}
