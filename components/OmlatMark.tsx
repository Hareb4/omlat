import { cn } from "@/lib/utils";

interface OmlatMarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const dimensions = {
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
} as const;

const iconSizes = { sm: 16, md: 20, lg: 28 } as const;

/**
 * The Omlat coin — an eight-point star (Rub el Hizb ۞) struck on an
 * emerald coin face, a nod to the app's Arabic name (عملات, "currencies").
 */
export function OmlatMark({ className, size = "md" }: OmlatMarkProps) {
  const iconSize = iconSizes[size];

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full bg-primary",
        "shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.18),inset_0_0_0_2px_hsl(var(--accent)/0.45)]",
        dimensions[size],
        className
      )}
      aria-hidden
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        className="text-primary-foreground"
      >
        <rect
          x="6.2"
          y="6.2"
          width="11.6"
          height="11.6"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="6.2"
          y="6.2"
          width="11.6"
          height="11.6"
          stroke="currentColor"
          strokeWidth="1.5"
          transform="rotate(45 12 12)"
        />
        <circle cx="12" cy="12" r="1.9" fill="hsl(var(--accent))" />
      </svg>
    </div>
  );
}
