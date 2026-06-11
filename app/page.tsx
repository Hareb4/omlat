"use client";

import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { CurrencyPicker } from "@/components/CurrencyPicker";
import { useCurrencyData } from "@/hooks/useCurrencyData";
import { formatCurrency, cn } from "@/lib/utils";
import { AppHeader } from "@/components/AppHeader";
import { OmlatMark } from "@/components/OmlatMark";

const rateFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

export default function CurrencyConverter() {
  const { currencyData, currencies, isLoading, error } = useCurrencyData();
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");

  // Keep only digits and a single decimal point so the field stays numeric.
  const handleAmountChange = (raw: string) => {
    const sanitized = raw.replace(/[^0-9.]/g, "");
    const parts = sanitized.split(".");
    const normalized =
      parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : sanitized;
    setAmount(normalized);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background">
        <OmlatMark size="lg" className="animate-pulse" />
        <div className="space-y-1 text-center">
          <p className="font-display text-lg font-semibold text-foreground">
            Omlat
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Opening the exchange…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <OmlatMark size="lg" />
        <div className="space-y-1">
          <p className="font-display text-lg font-semibold text-foreground">
            The desk is closed
          </p>
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  const exchangeRate = currencyData
    ? currencyData.rates[toCurrency] /
      (fromCurrency === "USD" ? 1 : currencyData.rates[fromCurrency])
    : 0;
  const convertedAmount = (parseFloat(amount) || 0) * exchangeRate;

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_65%)]"
        aria-hidden
      />

      <AppHeader ratesDate={currencyData?.date} />

      <main className="relative mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 pb-56 pt-10 sm:px-6 sm:pt-14">
        <section className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <p className="microlabel text-accent">
            The exchange desk in your pocket
          </p>
          <h1 className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Every currency.
            <br />
            One honest rate.
          </h1>
          <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Pick a region, choose your currency, then set where it’s going.
            Live rates across 150+ currencies, gold, and silver.
          </p>
        </section>

        <CurrencyPicker
          currencies={currencies}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          onSelectFrom={setFromCurrency}
          onSelectTo={setToCurrency}
        />
      </main>

      {/* The exchange ticket — Omlat's signature conversion dock */}
      <div className="fixed inset-x-3 bottom-3 z-40 sm:inset-x-6 sm:bottom-5">
        <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-card/95 shadow-ticket backdrop-blur-md supports-[backdrop-filter]:bg-card/85">
          <div className="h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

          <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-3.5">
            <p className="microlabel">Exchange ticket</p>
            <p className="font-mono text-xs tabular-nums text-muted-foreground">
              1 {fromCurrency} = {rateFormatter.format(exchangeRate)}{" "}
              {toCurrency}
            </p>
          </div>

          <div className="mx-5 border-t border-dashed border-border" aria-hidden />

          <div className="flex flex-col items-stretch gap-3 p-5 pt-4 sm:flex-row sm:items-center">
            <div className="flex-1 space-y-1">
              <label htmlFor="amount-input" className="microlabel block">
                You send · {fromCurrency}
              </label>
              <input
                id="amount-input"
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                autoComplete="off"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className={cn(
                  "h-12 w-full rounded-xl bg-background px-3 font-mono text-xl font-medium tabular-nums text-foreground shadow-surface",
                  "transition-shadow duration-150 [transition-timing-function:var(--ease-brand)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              />
            </div>

            <button
              type="button"
              onClick={swapCurrencies}
              aria-label="Swap currencies"
              className={cn(
                "relative mx-auto flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground",
                "shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.18)]",
                "transition-transform duration-150 [transition-timing-function:var(--ease-brand)]",
                "before:absolute before:-inset-2 before:content-['']",
                "hover:bg-primary/90 active:scale-[0.96] sm:mt-4",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              )}
            >
              <ArrowRightLeft className="size-4" />
            </button>

            <div className="flex-1 space-y-1">
              <p className="microlabel">They receive · {toCurrency}</p>
              <output
                htmlFor="amount-input"
                className={cn(
                  "flex h-12 w-full items-center rounded-xl bg-primary/10 px-3",
                  "font-mono text-xl font-medium tabular-nums text-foreground"
                )}
              >
                {formatCurrency(convertedAmount, toCurrency)}
              </output>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
