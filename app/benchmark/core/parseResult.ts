import type {
  Alternative,
  Category,
  DetectionResult,
  TitleOverrides,
} from "./types";

function asString(value: unknown): string {
  if (value == null) return "";
  return String(value).trim();
}

function asNullableString(value: unknown): string | null {
  if (value == null) return null;
  const text = String(value).trim();
  if (!text || text.toLowerCase() === "null") return null;
  return text;
}

function asNumber(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n > 1 ? n / 100 : n));
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asString(item)).filter(Boolean);
}

function normalizeAlternatives(value: unknown): Alternative[] {
  if (!Array.isArray(value)) return [];
  const out: Alternative[] = [];
  for (const item of value) {
    if (typeof item === "string" && item.trim()) {
      out.push({ model: item.trim(), note: "" });
      continue;
    }
    if (item && typeof item === "object" && "model" in item) {
      const model = asString((item as { model: unknown }).model);
      if (!model) continue;
      const note = asString((item as { note?: unknown }).note);
      out.push({ model, note });
    }
  }
  return out;
}

function extractJson(rawText: string): unknown {
  const cleaned = rawText.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("no json");
    return JSON.parse(match[0]);
  }
}

export function parseResult(rawText: string): DetectionResult {
  try {
    const parsed = extractJson(rawText);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("not an object");
    }
    const data = parsed as Record<string, unknown>;

    if (data.detected === false) {
      return {
        detected: false,
        reason: asString(data.reason) || "Could not identify the product",
        _raw: rawText,
      };
    }

    const category = asString(data.category).toLowerCase();
    if (
      category !== "phone" &&
      category !== "laptop" &&
      category !== "car"
    ) {
      return {
        detected: false,
        reason: "Model did not return a phone, laptop, or car",
        _raw: rawText,
      };
    }

    const typedCategory = category as Category;
    const base = {
      detected: true as const,
      brand: asString(data.brand) || "Unknown",
      model: asString(data.model) || "Unknown",
      alternatives: normalizeAlternatives(data.alternatives),
      color: asNullableString(data.color),
      condition_guess: asString(data.condition_guess) || "good",
      confidence: asNumber(data.confidence),
      title: asString(data.title),
    };

    switch (typedCategory) {
      case "phone":
        return {
          ...base,
          category: "phone",
          storage: asNullableString(data.storage),
          storage_options: asStringArray(data.storage_options),
        };
      case "laptop":
        return {
          ...base,
          category: "laptop",
          chip: asNullableString(data.chip),
          ram: asNullableString(data.ram),
          ram_options: asStringArray(data.ram_options),
          storage: asNullableString(data.storage),
          storage_options: asStringArray(data.storage_options),
        };
      case "car":
        return {
          ...base,
          category: "car",
          year: asNullableString(data.year),
          year_options: asStringArray(data.year_options),
          body_type: asNullableString(data.body_type),
        };
      default: {
        const _exhaustive: never = typedCategory;
        return _exhaustive;
      }
    }
  } catch {
    return {
      detected: false,
      reason: "Model returned unparseable response",
      _raw: rawText,
    };
  }
}

export function buildTitle(
  detection: DetectionResult | null,
  overrides: TitleOverrides = {}
): string {
  if (!detection || !detection.detected) return "";

  const model = overrides.model ?? detection.model;
  const color = overrides.color ?? detection.color;
  const condition = overrides.condition_guess ?? detection.condition_guess;
  void condition;

  switch (detection.category) {
    case "phone": {
      const storage = overrides.storage ?? detection.storage;
      return [detection.brand, model, storage, color].filter(Boolean).join(" ");
    }
    case "laptop": {
      const chip = overrides.chip ?? detection.chip;
      const ram = overrides.ram ?? detection.ram;
      const storage = overrides.storage ?? detection.storage;
      return [detection.brand, model, chip, ram, storage, color]
        .filter(Boolean)
        .join(" ");
    }
    case "car": {
      const year = overrides.year ?? detection.year;
      const bodyType = overrides.body_type ?? detection.body_type;
      return [detection.brand, model, year, color, bodyType]
        .filter(Boolean)
        .join(" ");
    }
    default: {
      const _exhaustive: never = detection;
      return _exhaustive;
    }
  }
}

export const CONDITION_OPTIONS = [
  "new",
  "like new",
  "good",
  "fair",
  "poor",
] as const;
