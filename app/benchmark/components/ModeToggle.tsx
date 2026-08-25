"use client";

import { cn } from "@/lib/utils";
import type { AppMode } from "../core/types";
import { Flag, Smartphone } from "lucide-react";

interface ModeToggleProps {
  mode: AppMode;
  onChange: (mode: AppMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="inline-flex rounded-xl border border-gray-800 bg-gray-900 p-1">
      <button
        type="button"
        onClick={() => onChange("phone")}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          mode === "phone"
            ? "bg-violet-600 text-white"
            : "text-gray-400 hover:text-gray-100"
        )}
      >
        <Smartphone className="size-4" />
        Phone Simulation
      </button>
      <button
        type="button"
        onClick={() => onChange("race")}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          mode === "race"
            ? "bg-violet-600 text-white"
            : "text-gray-400 hover:text-gray-100"
        )}
      >
        <Flag className="size-4" />
        Race Mode
      </button>
    </div>
  );
}
