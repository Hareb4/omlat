import { OmlatMark } from "@/components/OmlatMark";
import { ThemeChanger } from "@/components/ThemeChanger";
import Link from "next/link";

interface AppHeaderProps {
  ratesDate?: string;
}

export function AppHeader({ ratesDate }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <OmlatMark size="sm" />
          <div className="flex items-baseline gap-2">
            <p className="font-display text-xl font-semibold tracking-tight text-foreground">
              Omlat
            </p>
            <p
              lang="ar"
              className="hidden translate-y-px text-sm text-muted-foreground sm:block"
            >
              عملات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {ratesDate && (
            <div className="hidden items-center gap-2 rounded-full bg-secondary px-3 py-1.5 sm:flex">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-success" />
              </span>
              <span className="font-mono text-xs tabular-nums text-secondary-foreground">
                Live · {ratesDate}
              </span>
            </div>
          )}
          <Link
            href="/benchmark"
            className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Vision Bench
          </Link>
          <ThemeChanger />
        </div>
      </div>
      {/* Gold hairline — the brand's signature rule */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
    </header>
  );
}
