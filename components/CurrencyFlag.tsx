"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CurrencyFlagProps {
  currency: string;
  isSelected: boolean;
  onClick: () => void;
  isCrypto?: boolean;
}

export function CurrencyFlag({
  currency,
  isSelected,
  onClick,
  isCrypto = false,
}: CurrencyFlagProps) {
  const [imageError, setImageError] = useState(false);

  const imageSrc = isCrypto
    ? `https://cryptoicons.org/api/icon/${currency.toLowerCase()}/200`
    : `/flags/${currency.toLowerCase().slice(0, 2)}.svg`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={cn(
        "flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 py-2",
        "transition-[transform,background-color,box-shadow,color] duration-150 [transition-timing-function:var(--ease-brand)]",
        "active:scale-[0.96]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSelected
          ? "bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_0_0_1px_hsl(var(--accent)/0.4)]"
          : "bg-background text-foreground shadow-surface hover:bg-secondary"
      )}
    >
      {!imageError ? (
        <>
          <Image
            src={imageSrc}
            alt={`${currency} ${isCrypto ? "icon" : "flag"}`}
            onError={() => setImageError(true)}
            quality={100}
            width={isCrypto ? 24 : 22}
            height={isCrypto ? 24 : 22}
            className="outline-image shrink-0 rounded-[3px]"
          />
          <span className="truncate font-mono text-xs font-semibold uppercase tracking-wide">
            {currency}
          </span>
        </>
      ) : (
        <span className="w-full text-center font-mono text-xs font-semibold uppercase">
          {currency}
        </span>
      )}
    </button>
  );
}
