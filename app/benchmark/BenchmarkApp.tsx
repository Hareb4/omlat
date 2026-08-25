"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { DEFAULT_ENABLED } from "./config/models";
import { checkApiKey } from "./core/openrouter";
import type { AppMode, BenchmarkImage } from "./core/types";
import { ImageUploader } from "./components/ImageUploader";
import { ModeToggle } from "./components/ModeToggle";
import { SampleImages } from "./components/SampleImages";
import { PhoneSimulator } from "./modes/PhoneSimulator";
import { RaceMode } from "./modes/RaceMode";

export function BenchmarkApp() {
  const [mode, setMode] = useState<AppMode>("phone");
  const [image, setImage] = useState<BenchmarkImage | null>(null);
  const [enabledModels, setEnabledModels] = useState<string[]>(DEFAULT_ENABLED);
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    void checkApiKey().then(setHasApiKey);
  }, []);

  useEffect(() => {
    return () => {
      if (image?.preview) URL.revokeObjectURL(image.preview);
    };
  }, [image]);

  const setImageSafe = (next: BenchmarkImage) => {
    setImage((prev) => {
      if (prev?.preview) URL.revokeObjectURL(prev.preview);
      return next;
    });
  };

  let workspace: ReactNode;
  switch (mode) {
    case "phone":
      workspace = <PhoneSimulator image={image} hasApiKey={hasApiKey} />;
      break;
    case "race":
      workspace = (
        <RaceMode
          image={image}
          enabledModels={enabledModels}
          onEnabledModels={setEnabledModels}
          hasApiKey={hasApiKey}
        />
      );
      break;
    default: {
      const _exhaustive: never = mode;
      workspace = _exhaustive;
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-100"
            >
              <ArrowLeft className="size-4" />
              Omlat
            </Link>
            <span className="text-gray-700">/</span>
            <div>
              <p className="text-sm font-semibold text-gray-100">
                AI Vision Benchmark
              </p>
              <p className="text-xs text-gray-500">
                Second-hand marketplace — cars, phones, laptops
              </p>
            </div>
          </div>
          <ModeToggle mode={mode} onChange={setMode} />
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {!hasApiKey ? (
          <div className="flex items-start gap-3 rounded-xl border border-amber-400/60 bg-amber-950/40 px-4 py-3 text-sm text-amber-200">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p>
              Add <code className="font-mono text-amber-100">OPENROUTER_API_KEY</code>{" "}
              to <code className="font-mono text-amber-100">.env.local</code>. The
              UI still works — simulate and race stay disabled until a key is
              present.
            </p>
          </div>
        ) : null}

        <section className="grid gap-6 rounded-2xl border border-gray-800 bg-gray-900/60 p-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <ImageUploader image={image} onImage={setImageSafe} />
          <SampleImages onImage={setImageSafe} />
        </section>

        {workspace}
      </div>
    </div>
  );
}
