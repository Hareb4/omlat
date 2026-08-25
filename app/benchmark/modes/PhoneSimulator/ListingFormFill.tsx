"use client";

import { Check, Copy } from "lucide-react";
import { useState, type ReactNode } from "react";
import { AlternativeChips } from "../../components/AlternativeChips";
import { SpecChips } from "../../components/SpecChips";
import { CONDITION_OPTIONS } from "../../core/parseResult";
import type { DetectionResult, TitleOverrides } from "../../core/types";
import { cn } from "@/lib/utils";

interface ListingFormFillProps {
  preview: string | null;
  status: "idle" | "loading" | "done" | "error";
  detection: DetectionResult | null;
  revealed: number;
  overrides: TitleOverrides;
  title: string;
  error: string | null;
  onOverride: (patch: TitleOverrides) => void;
}

export function ListingFormFill({
  preview,
  status,
  detection,
  revealed,
  overrides,
  title,
  error,
  onOverride,
}: ListingFormFillProps) {
  const [copied, setCopied] = useState(false);

  const copyTitle = async () => {
    if (!title) return;
    await navigator.clipboard.writeText(title);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl bg-gray-900">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Listing photo" className="h-44 w-full object-cover" />
        ) : (
          <div className="flex h-44 items-center justify-center text-sm text-gray-500">
            Add a photo to start
          </div>
        )}
      </div>

      {status === "idle" ? (
        <SkeletonForm />
      ) : null}

      {status === "loading" ? (
        <div className="space-y-3">
          <p className="text-center text-xs text-violet-300">Reading the photo…</p>
          <SkeletonForm pulsing />
        </div>
      ) : null}

      {status === "error" ? (
        <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-300">
          {error || "Simulation failed"}
        </div>
      ) : null}

      {status === "done" && detection && !detection.detected ? (
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-3 text-sm text-amber-200">
          Not detected: {detection.reason}
        </div>
      ) : null}

      {status === "done" && detection?.detected ? (
        <DetectedForm
          detection={detection}
          revealed={revealed}
          overrides={overrides}
          title={title}
          copied={copied}
          onCopy={() => void copyTitle()}
          onOverride={onOverride}
        />
      ) : null}
    </div>
  );
}

function DetectedForm({
  detection,
  revealed,
  overrides,
  title,
  copied,
  onCopy,
  onOverride,
}: {
  detection: Extract<DetectionResult, { detected: true }>;
  revealed: number;
  overrides: TitleOverrides;
  title: string;
  copied: boolean;
  onCopy: () => void;
  onOverride: (patch: TitleOverrides) => void;
}) {
  const selectedModel = overrides.model ?? detection.model;
  const selectedColor = overrides.color ?? detection.color;
  const selectedCondition = overrides.condition_guess ?? detection.condition_guess;

  const specBlock = specFields(detection, overrides, onOverride);

  return (
    <div className="space-y-3">
      <Field label="Category" show={revealed >= 1}>
        <span className="inline-flex rounded-full bg-violet-600/20 px-2.5 py-1 text-xs font-medium capitalize text-violet-200">
          {detection.category}
        </span>
      </Field>

      <Field label="Brand" show={revealed >= 2}>
        <p className="text-sm text-gray-100">{detection.brand}</p>
      </Field>

      <Field label="Model" show={revealed >= 3}>
        <p className="text-sm font-medium text-gray-100">{selectedModel}</p>
      </Field>

      <Field label="" show={revealed >= 4}>
        <AlternativeChips
          alternatives={[
            { model: detection.model, note: "Best guess" },
            ...detection.alternatives.filter((a) => a.model !== detection.model),
          ]}
          selectedModel={selectedModel}
          onSelect={(model) => onOverride({ model })}
        />
      </Field>

      {specBlock ? (
        <Field label={specBlock.label} show={revealed >= 5}>
          {specBlock.node}
        </Field>
      ) : null}

      <Field label="Color" show={revealed >= 6}>
        <p className="text-sm text-gray-100">{selectedColor || "—"}</p>
      </Field>

      <Field label="Condition" show={revealed >= 7}>
        <SpecChips
          options={[...CONDITION_OPTIONS]}
          selected={selectedCondition || null}
          onSelect={(value) => onOverride({ condition_guess: value })}
        />
      </Field>

      <Field label="Title (auto)" show={revealed >= 8}>
        <div className="rounded-xl border border-violet-400 bg-violet-950 p-3">
          <p className="text-sm leading-snug text-violet-100">{title}</p>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-gray-800 px-3 py-1.5 text-xs text-gray-200"
        >
          {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy Title"}
        </button>
      </Field>
    </div>
  );
}

function specFields(
  detection: Extract<DetectionResult, { detected: true }>,
  overrides: TitleOverrides,
  onOverride: (patch: TitleOverrides) => void
): { label: string; node: ReactNode } | null {
  switch (detection.category) {
    case "phone":
      return {
        label: "Storage",
        node: (
          <SpecChips
            options={detection.storage_options}
            selected={overrides.storage ?? detection.storage}
            onSelect={(storage) => onOverride({ storage })}
          />
        ),
      };
    case "laptop":
      return {
        label: "RAM / Storage",
        node: (
          <div className="space-y-2">
            <SpecChips
              options={detection.ram_options}
              selected={overrides.ram ?? detection.ram}
              onSelect={(ram) => onOverride({ ram })}
              label="RAM"
            />
            <SpecChips
              options={detection.storage_options}
              selected={overrides.storage ?? detection.storage}
              onSelect={(storage) => onOverride({ storage })}
              label="SSD"
            />
          </div>
        ),
      };
    case "car":
      return {
        label: "Year",
        node: (
          <SpecChips
            options={detection.year_options}
            selected={overrides.year ?? detection.year}
            onSelect={(year) => onOverride({ year })}
          />
        ),
      };
    default: {
      const _exhaustive: never = detection;
      return _exhaustive;
    }
  }
}

function Field({
  label,
  show,
  children,
}: {
  label: string;
  show: boolean;
  children: ReactNode;
}) {
  if (!show) return <div className="h-10 rounded-lg bg-gray-900/80" />;

  return (
    <div className="animate-in fade-in slide-in-from-left-2 duration-300 fill-mode-both">
      {label ? (
        <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">
          {label}
        </p>
      ) : null}
      {children}
    </div>
  );
}

function SkeletonForm({ pulsing = false }: { pulsing?: boolean }) {
  return (
    <div className={cn("space-y-3", pulsing && "animate-pulse")}>
      <div className="h-10 rounded-lg bg-gray-900" />
      <div className="h-10 rounded-lg bg-gray-900" />
      <div className="h-10 rounded-lg bg-gray-900" />
      <div className="h-16 rounded-lg bg-gray-900" />
      <div className="h-10 rounded-lg bg-gray-900" />
    </div>
  );
}
