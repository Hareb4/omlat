"use client";

import { useCallback, useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toBenchmarkImage } from "../core/imageProcessor";
import type { BenchmarkImage } from "../core/types";

interface ImageUploaderProps {
  image: BenchmarkImage | null;
  onImage: (image: BenchmarkImage) => void;
}

export function ImageUploader({ image, onImage }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setError("Please drop an image file");
        return;
      }
      setBusy(true);
      setError(null);
      try {
        const next = await toBenchmarkImage(file);
        onImage(next);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not compress image");
      } finally {
        setBusy(false);
      }
    },
    [onImage]
  );

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          void handleFile(file);
          e.target.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition-colors",
          dragging
            ? "border-violet-500 bg-violet-950/40"
            : "border-gray-700 bg-gray-900 hover:border-gray-600"
        )}
      >
        {busy ? (
          <Loader2 className="size-6 animate-spin text-violet-400" />
        ) : (
          <ImagePlus className="size-6 text-gray-400" />
        )}
        <div>
          <p className="text-sm font-medium text-gray-100">
            Drop a product photo, or click to browse
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Compressed like Expo ImagePicker (max 1920px, JPEG 0.8)
          </p>
        </div>
      </button>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {image ? (
        <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.preview}
            alt="Upload preview"
            className="size-16 rounded-lg object-cover"
          />
          <div className="min-w-0 text-left">
            <p className="truncate text-sm text-gray-100">{image.file.name}</p>
            <p className="font-mono text-xs text-gray-400">
              {formatKb(image.originalSizeKB)} → {formatKb(image.compressedSizeKB)}{" "}
              — matches Expo compression
            </p>
            <p className="font-mono text-xs text-gray-500">
              {image.width}×{image.height}px JPEG
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function formatKb(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)}MB`;
  return `${kb}KB`;
}
