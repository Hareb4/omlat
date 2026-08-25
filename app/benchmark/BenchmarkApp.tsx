"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { DEFAULT_ENABLED } from "./config/models";
import { checkApiKey } from "./core/openrouter";
import { getClientApiKey, setClientApiKey } from "./core/apiKeyStore";
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
  const [hasEnvKey, setHasEnvKey] = useState(false);
  const [clientKey, setClientKey] = useState("");

  useEffect(() => {
    setClientKey(getClientApiKey());
    void checkApiKey().then(setHasEnvKey);
  }, []);

  const hasApiKey = hasEnvKey || clientKey.trim().length > 0;

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
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
          <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">
            OpenRouter API key
          </label>
          <input
            type="password"
            autoComplete="off"
            spellCheck={false}
            placeholder="sk-or-v1-…  (or set OPENROUTER_API_KEY in .env.local)"
            value={clientKey}
            onChange={(e) => {
              const next = e.target.value;
              setClientKey(next);
              setClientApiKey(next);
            }}
            className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2.5 font-mono text-sm text-gray-100 outline-none focus:border-violet-500"
          />
          {!hasApiKey ? (
            <p className="mt-2 flex items-start gap-2 text-sm text-amber-300">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              Missing Authentication header until a key is pasted or
              OPENROUTER_API_KEY is set. Simulate and Race stay disabled.
            </p>
          ) : (
            <p className="mt-2 text-xs text-gray-500">
              {hasEnvKey
                ? "Using OPENROUTER_API_KEY from the server environment."
                : "Key is kept in this browser tab only and sent as the Authorization header."}
            </p>
          )}
        </div>

        <section className="grid gap-6 rounded-2xl border border-gray-800 bg-gray-900/60 p-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <ImageUploader image={image} onImage={setImageSafe} />
          <SampleImages onImage={setImageSafe} />
        </section>

        {workspace}
      </div>
    </div>
  );
}
