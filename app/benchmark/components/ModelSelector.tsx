"use client";

import { cn } from "@/lib/utils";
import { MODELS, type VisionModel } from "../config/models";

interface ModelSelectorProps {
  enabledIds: string[];
  onChange: (ids: string[]) => void;
}

export function ModelSelector({ enabledIds, onChange }: ModelSelectorProps) {
  const toggle = (id: string) => {
    if (enabledIds.includes(id)) {
      onChange(enabledIds.filter((item) => item !== id));
      return;
    }
    onChange([...enabledIds, id]);
  };

  const free = MODELS.filter((m) => m.free);
  const paid = MODELS.filter((m) => !m.free);

  return (
    <div className="space-y-3">
      <Group
        title="Free models"
        models={free}
        enabledIds={enabledIds}
        onToggle={toggle}
      />
      <Group
        title="Paid references"
        models={paid}
        enabledIds={enabledIds}
        onToggle={toggle}
      />
    </div>
  );
}

function Group({
  title,
  models,
  enabledIds,
  onToggle,
}: {
  title: string;
  models: VisionModel[];
  enabledIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {models.map((model) => {
          const on = enabledIds.includes(model.id);
          return (
            <button
              key={model.id}
              type="button"
              title={model.notes}
              onClick={() => onToggle(model.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                on
                  ? "border-violet-500 bg-violet-600/20 text-violet-100"
                  : "border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600"
              )}
            >
              <span
                className="mr-1.5 inline-block size-1.5 rounded-full"
                style={{ backgroundColor: model.badgeColor }}
              />
              {model.name}
              {!model.free ? (
                <span className="ml-1.5 text-[10px] text-amber-400">PAID</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
