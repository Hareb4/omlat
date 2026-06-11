export const continents: Record<string, string[]> = {
  "North America": [
    "USD",
    "CAD",
    "MXN",
    "BBD",
    "BMD",
    "BSD",
    "BZD",
    "CRC",
    "CUC",
    "CUP",
    "DOP",
    "GTQ",
    "HNL",
    "HTG",
    "JMD",
    "KYD",
    "NIO",
    "PAB",
    "TTD",
    "XCD",
  ],
  "South America": [
    "ARS",
    "BOB",
    "BRL",
    "CLP",
    "COP",
    "FKP",
    "GYD",
    "PEN",
    "PYG",
    "SRD",
    "UYU",
    "VEF",
  ],
  Europe: [
    "EUR",
    "GBP",
    "CHF",
    "SEK",
    "NOK",
    "DKK",
    "PLN",
    "CZK",
    "HUF",
    "BGN",
    "HRK",
    "ISK",
    "MDL",
    "RON",
    "RSD",
    "RUB",
    "UAH",
    "ALL",
    "BAM",
    "BYN",
    "GEL",
    "GGP",
    "IMP",
    "JEP",
    "LTL",
    "LVL",
    "MKD",
  ],
  Asia: [
    "JPY",
    "CNY",
    "HKD",
    "SGD",
    "KRW",
    "INR",
    "TWD",
    "THB",
    "MYR",
    "PHP",
    "IDR",
    "PKR",
    "BDT",
    "VND",
    "KHR",
    "LAK",
    "MMK",
    "MNT",
    "NPR",
    "LKR",
    "BND",
    "KGS",
    "KZT",
    "TJS",
    "TMT",
    "UZS",
    "AMD",
    "AZN",
  ],
  Oceania: ["AUD", "NZD", "FJD", "PGK", "SBD", "TOP", "VUV", "WST", "XPF"],
  Africa: [
    "ZAR",
    "EGP",
    "NGN",
    "KES",
    "MAD",
    "GHS",
    "AOA",
    "BIF",
    "BWP",
    "CDF",
    "CVE",
    "DJF",
    "DZD",
    "ERN",
    "ETB",
    "GMD",
    "GNF",
    "LRD",
    "LSL",
    "LYD",
    "MGA",
    "MUR",
    "MWK",
    "MZN",
    "NAD",
    "RWF",
    "SCR",
    "SDG",
    "SLL",
    "SOS",
    "STD",
    "SZL",
    "TND",
    "TZS",
    "UGX",
    "XAF",
    "XOF",
    "ZMK",
    "ZMW",
    "ZWL",
  ],
  "Middle East": [
    "AED",
    "SAR",
    "ILS",
    "QAR",
    "KWD",
    "BHD",
    "IQD",
    "IRR",
    "JOD",
    "LBP",
    "OMR",
    "SYP",
    "YER",
  ],
  "Precious Metals": ["XAG", "XAU", "XPD", "XPT"],
  Other: ["CLF", "MOP", "MRO", "MVR", "SHP", "SVC", "XDR"],
};

/** A representative currency used to render each continent's emblem flag. */
export const continentEmblem: Record<string, string> = {
  "North America": "USD",
  "South America": "BRL",
  Europe: "EUR",
  Asia: "JPY",
  Oceania: "AUD",
  Africa: "ZAR",
  "Middle East": "AED",
  "Precious Metals": "XAU",
  Other: "XDR",
};

export interface CurrencyGroup {
  continent: string;
  currencies: string[];
}

/** Group the available currencies by continent, dropping empty regions. */
export function groupByContinent(available: string[]): CurrencyGroup[] {
  const availableSet = new Set(available);
  return Object.entries(continents)
    .map(([continent, codes]) => ({
      continent,
      currencies: codes.filter((code) => availableSet.has(code)),
    }))
    .filter((group) => group.currencies.length > 0);
}

/** Find which continent a given currency code belongs to. */
export function continentOf(currency: string): string | null {
  for (const [continent, codes] of Object.entries(continents)) {
    if (codes.includes(currency)) return continent;
  }
  return null;
}

/** Flat, case-insensitive search across all available currency codes. */
export function searchCurrencies(
  available: string[],
  query: string
): string[] {
  const q = query.trim().toUpperCase();
  if (!q) return [];
  return available.filter((code) => code.toUpperCase().includes(q));
}
