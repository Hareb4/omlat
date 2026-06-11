"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, Coins, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CurrencyFlag } from "@/components/CurrencyFlag";
import {
  continentEmblem,
  groupByContinent,
  searchCurrencies,
} from "@/lib/currencies";

type Side = "from" | "to";

interface CurrencyPickerProps {
  currencies: string[];
  fromCurrency: string;
  toCurrency: string;
  onSelectFrom: (currency: string) => void;
  onSelectTo: (currency: string) => void;
}

function EmblemFlag({ currency }: { currency: string }) {
  const [errored, setErrored] = useState(false);
  const src = `/flags/${currency.toLowerCase().slice(0, 2)}.svg`;

  if (errored) {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Coins className="size-3.5" />
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={24}
      height={24}
      onError={() => setErrored(true)}
      className="outline-image size-6 shrink-0 rounded-full object-cover"
    />
  );
}

export function CurrencyPicker({
  currencies,
  fromCurrency,
  toCurrency,
  onSelectFrom,
  onSelectTo,
}: CurrencyPickerProps) {
  const [editing, setEditing] = useState<Side>("from");
  const [activeContinent, setActiveContinent] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const groups = useMemo(() => groupByContinent(currencies), [currencies]);
  const results = useMemo(
    () => searchCurrencies(currencies, query),
    [currencies, query]
  );

  const activeValue = editing === "from" ? fromCurrency : toCurrency;
  const activeGroup = groups.find((g) => g.continent === activeContinent);

  const openSide = (side: Side) => {
    setEditing(side);
    setActiveContinent(null);
    setQuery("");
  };

  const handleSelect = (currency: string) => {
    if (editing === "from") {
      onSelectFrom(currency);
      // Guide the user straight into choosing the destination currency.
      setEditing("to");
    } else {
      onSelectTo(currency);
    }
    setActiveContinent(null);
    setQuery("");
  };

  const tabs: { side: Side; label: string; value: string }[] = [
    { side: "from", label: "Convert from", value: fromCurrency },
    { side: "to", label: "Convert to", value: toCurrency },
  ];

  return (
    <section className="overflow-hidden rounded-2xl bg-card shadow-surface">
      {/* From / To selector tabs */}
      <div className="grid grid-cols-2 gap-2 p-2 sm:gap-3 sm:p-3">
        {tabs.map((tab) => {
          const isActive = editing === tab.side;
          return (
            <button
              key={tab.side}
              type="button"
              onClick={() => openSide(tab.side)}
              aria-pressed={isActive}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left",
                "transition-[background-color,box-shadow,transform] duration-150 [transition-timing-function:var(--ease-brand)]",
                "active:scale-[0.99]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-primary/10 shadow-[inset_0_0_0_1.5px_hsl(var(--primary))]"
                  : "bg-background shadow-surface hover:bg-secondary"
              )}
            >
              <EmblemFlag currency={tab.value} />
              <span className="min-w-0">
                <span className="microlabel block leading-none">
                  {tab.label}
                </span>
                <span className="mt-1 block truncate font-mono text-base font-semibold tabular-nums text-foreground">
                  {tab.value}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mx-3 border-t border-dashed border-border" aria-hidden />

      {/* Search */}
      <div className="p-3 pb-2">
        <div
          className={cn(
            "flex h-11 items-center gap-2 rounded-xl bg-background px-3 shadow-surface",
            "focus-within:ring-2 focus-within:ring-ring"
          )}
        >
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search a currency to set "${
              editing === "from" ? "from" : "to"
            }"`}
            aria-label="Search currencies"
            className="h-full w-full bg-transparent font-mono text-sm tabular-nums text-foreground placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Body: search results › continents › currencies */}
      <div className="scroll-panel max-h-[min(46vh,24rem)] min-h-[16rem] overflow-y-auto px-3 pb-4">
        {query ? (
          results.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {results.map((currency) => (
                <CurrencyFlag
                  key={currency}
                  currency={currency}
                  isSelected={currency === activeValue}
                  onClick={() => handleSelect(currency)}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center gap-1 text-center">
              <p className="font-display text-base font-semibold text-foreground">
                No match
              </p>
              <p className="text-sm text-muted-foreground">
                Nothing found for “{query}”.
              </p>
            </div>
          )
        ) : activeGroup ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setActiveContinent(null)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg py-1 pr-2 text-sm font-medium text-muted-foreground",
                "transition-colors hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              <ChevronLeft className="size-4" />
              All regions
            </button>
            <div className="flex items-center gap-3">
              <h3 className="microlabel shrink-0 text-foreground">
                {activeGroup.continent}
              </h3>
              <div className="h-px flex-1 bg-border/70" aria-hidden />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {activeGroup.currencies.map((currency) => (
                <CurrencyFlag
                  key={currency}
                  currency={currency}
                  isSelected={currency === activeValue}
                  onClick={() => handleSelect(currency)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {groups.map((group) => {
              const hasActive = group.currencies.includes(activeValue);
              return (
                <button
                  key={group.continent}
                  type="button"
                  onClick={() => setActiveContinent(group.continent)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-left",
                    "transition-[background-color,transform] duration-150 [transition-timing-function:var(--ease-brand)]",
                    "active:scale-[0.98]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    hasActive
                      ? "bg-primary/10 shadow-[inset_0_0_0_1.5px_hsl(var(--primary)/0.5)]"
                      : "bg-background shadow-surface hover:bg-secondary"
                  )}
                >
                  <EmblemFlag currency={continentEmblem[group.continent]} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {group.continent}
                    </span>
                    <span className="microlabel block leading-tight">
                      {group.currencies.length} currencies
                    </span>
                  </span>
                  {hasActive && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-primary">
                      {activeValue}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
