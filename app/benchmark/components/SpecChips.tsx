"use client";

import { cn } from "@/lib/utils";

interface SpecChipsProps {
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
  label?: string;
}

export function SpecChips({
  options,
  selected,
  onSelect,
  label,
}: SpecChipsProps) {
  if (options.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {label ? (
        <span className="mr-1 text-[10px] font-medium uppercase tracking-wider text-gray-500">
          {label}
        </span>
      ) : null}
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
              isSelected
                ? "border-violet-500 bg-violet-600 text-white"
                : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
            )}
          >
            {isSelected ? `${option} ✓` : option}
          </button>
        );
      })}
    </div>
  );
}
