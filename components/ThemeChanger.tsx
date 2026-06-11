"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const iconTransition =
  "transition-[transform,opacity,filter] duration-300 [transition-timing-function:var(--ease-brand)]";

export function ThemeChanger() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative flex size-10 items-center justify-center rounded-full bg-card text-foreground shadow-surface",
        "transition-[transform,background-color] duration-150 [transition-timing-function:var(--ease-brand)]",
        "hover:bg-secondary active:scale-[0.96]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        !mounted && "pointer-events-none opacity-0"
      )}
    >
      <span className="relative flex size-[1.125rem] items-center justify-center">
        {mounted && (
          <>
            <Sun
              className={cn(
                "absolute size-[1.125rem]",
                iconTransition,
                isDark
                  ? "scale-[0.25] opacity-0 blur-[4px]"
                  : "scale-100 opacity-100 blur-0"
              )}
            />
            <Moon
              className={cn(
                "absolute size-[1.125rem]",
                iconTransition,
                isDark
                  ? "scale-100 opacity-100 blur-0"
                  : "scale-[0.25] opacity-0 blur-[4px]"
              )}
            />
          </>
        )}
      </span>
    </button>
  );
}
