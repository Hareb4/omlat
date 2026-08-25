import { useState, useEffect } from "react";

interface CurrencyData {
  success: boolean;
  timestamp: number;
  date: string;
  base: string;
  rates: Record<string, number>;
}

export function useCurrencyData() {
  const [currencyData, setCurrencyData] = useState<CurrencyData | null>(null);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencyData = async () => {
      try {
        const response = await fetch("/api/rates");
        const data = (await response.json()) as CurrencyData & {
          error?: string;
        };
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch currency data");
        }
        setCurrencyData(data);
        setCurrencies(Object.keys(data.rates || {}).sort());
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencyData();
  }, []);

  return { currencyData, currencies, isLoading, error };
}
