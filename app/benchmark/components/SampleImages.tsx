"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { fileFromRemoteUrl, toBenchmarkImage } from "../core/imageProcessor";
import type { BenchmarkImage, Category } from "../core/types";

interface SampleImage {
  label: string;
  category: Category;
  url: string;
}

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    label: "📱 iPhone",
    category: "phone",
    url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
  },
  {
    label: "📱 Samsung",
    category: "phone",
    url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
  },
  {
    label: "📱 Pixel",
    category: "phone",
    url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
  },
  {
    label: "💻 MacBook",
    category: "laptop",
    url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
  },
  {
    label: "💻 Dell XPS",
    category: "laptop",
    url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800",
  },
  {
    label: "💻 ThinkPad",
    category: "laptop",
    url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
  },
  {
    label: "🚗 SUV",
    category: "car",
    url: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
  },
  {
    label: "🚗 Sedan",
    category: "car",
    url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
  },
  {
    label: "🚗 Pickup",
    category: "car",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  },
];

const CATEGORY_LABEL: Record<Category, string> = {
  phone: "Phones",
  laptop: "Laptops",
  car: "Cars",
};

interface SampleImagesProps {
  onImage: (image: BenchmarkImage) => void;
}

export function SampleImages({ onImage }: SampleImagesProps) {
  const [loadingUrl, setLoadingUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pick = async (sample: SampleImage) => {
    setLoadingUrl(sample.url);
    setError(null);
    try {
      const filename = `${sample.category}-${sample.label.replace(/\W+/g, "-").toLowerCase()}.jpg`;
      const file = await fileFromRemoteUrl(sample.url, filename);
      const image = await toBenchmarkImage(file);
      onImage(image);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load sample");
    } finally {
      setLoadingUrl(null);
    }
  };

  const groups: Category[] = ["phone", "laptop", "car"];

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-500">
        Sample images
      </p>
      {groups.map((category) => (
        <div key={category}>
          <p className="mb-1.5 text-xs text-gray-400">{CATEGORY_LABEL[category]}</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_IMAGES.filter((s) => s.category === category).map((sample) => {
              const loading = loadingUrl === sample.url;
              return (
                <button
                  key={sample.url}
                  type="button"
                  onClick={() => void pick(sample)}
                  disabled={loadingUrl !== null}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 p-1.5 pr-3 text-left text-xs text-gray-200 transition-colors hover:border-violet-500 disabled:opacity-60"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sample.url}
                    alt={sample.label}
                    className="size-8 rounded-md object-cover"
                  />
                  <span>{loading ? "Loading…" : sample.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
