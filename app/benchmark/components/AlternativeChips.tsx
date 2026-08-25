"use client";

import { cn } from "@/lib/utils";
import type { Alternative } from "../core/types";

interface AlternativeChipsProps {
  alternatives: Alternative[];
  selectedModel: string;
  onSelect: (model: string) => void;
}

export function AlternativeChips({
  alternatives,
  selectedModel,
  onSelect,
}: AlternativeChipsProps) {
  if (alternatives.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {alternatives.map((alt) => {
        const selected = alt.model === selectedModel;
        return (
          <button
            key={alt.model}
            type="button"
            title={alt.note || alt.model}
            onClick={() => onSelect(alt.model)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
              selected
                ? "border-violet-500 bg-violet-600 text-white"
                : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
            )}
          >
            {selected ? `${shortName(alt.model)} ✓` : shortName(alt.model)}
          </button>
        );
      })}
    </div>
  );
}

function shortName(model: string): string {
  return model
    .replace(/^iPhone\s+/i, "")
    .replace(/^Galaxy\s+/i, "")
    .replace(/^Pixel\s+/i, "")
    .replace(/^MacBook\s+/i, "MB ");
}
