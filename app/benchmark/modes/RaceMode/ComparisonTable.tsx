import type { ReactNode } from "react";
import { MODELS, type VisionModel } from "../../config/models";
import {
  formatConfidence,
  formatMs,
  latencyClass,
} from "../../core/latency";
import type { DetectionResult, RaceCardResult } from "../../core/types";
import { cn } from "@/lib/utils";

interface ComparisonTableProps {
  enabledIds: string[];
  results: Record<string, RaceCardResult>;
}

export function ComparisonTable({ enabledIds, results }: ComparisonTableProps) {
  const models = enabledIds
    .map((id) => MODELS.find((m) => m.id === id))
    .filter((m): m is VisionModel => Boolean(m));

  const success = models
    .map((model) => ({ model, card: results[model.id] }))
    .filter((row) => row.card?.status === "success" && row.card.result);

  const detectedRows = success.filter((row) => row.card.result?.detected);

  const brands = unique(
    detectedRows.map((row) =>
      row.card.result?.detected ? row.card.result.brand : ""
    )
  );
  const categories = unique(
    detectedRows.map((row) =>
      row.card.result?.detected ? row.card.result.category : ""
    )
  );
  const guesses = unique(
    detectedRows.map((row) =>
      row.card.result?.detected ? row.card.result.model : ""
    )
  );

  const brandConflict = brands.length > 1;
  const categoryConflict = categories.length > 1;
  const fullAgreement = guesses.length === 1 && detectedRows.length > 1;

  const fastest = minBy(
    success.filter((row) => row.card.inferenceMs != null),
    (row) => row.card.inferenceMs ?? Infinity
  );
  const mostConfident = maxBy(
    detectedRows,
    (row) => (row.card.result?.detected ? row.card.result.confidence : 0)
  );
  const majorityGuess = mode(
    detectedRows.map((row) =>
      row.card.result?.detected ? row.card.result.model : ""
    )
  );
  const bestAgreement = detectedRows.find(
    (row) => row.card.result?.detected && row.card.result.model === majorityGuess
  );

  const recommendation = pickRecommendation({
    detectedRows,
    fastest,
    majorityGuess,
  });

  const altOverlap = alternativeOverlap(detectedRows, models.length);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-900 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-3 py-2">Metric</th>
              {models.map((model) => (
                <th key={model.id} className="px-3 py-2 font-medium text-gray-300">
                  {model.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            <Row label="⏱ Inference time">
              {models.map((model) => {
                const ms = results[model.id]?.inferenceMs;
                const isFastest = fastest?.model.id === model.id && ms != null;
                return (
                  <td
                    key={model.id}
                    className={cn(
                      "px-3 py-2 font-mono",
                      ms != null ? latencyClass(ms) : "text-gray-500",
                      isFastest && "bg-emerald-500/10"
                    )}
                  >
                    {ms != null ? formatMs(ms) : "—"}
                  </td>
                );
              })}
            </Row>
            <Row label="✅ Detected">
              {models.map((model) => {
                const result = results[model.id]?.result;
                return (
                  <td key={model.id} className="px-3 py-2 text-gray-200">
                    {result ? (result.detected ? "yes" : "no") : "—"}
                  </td>
                );
              })}
            </Row>
            <Row
              label="📦 Category"
              className={categoryConflict ? "bg-red-500/10" : undefined}
              hint={categoryConflict ? "🚨 Category conflict" : undefined}
            >
              {models.map((model) => (
                <td key={model.id} className="px-3 py-2 capitalize text-gray-200">
                  {categoryOf(results[model.id]?.result)}
                </td>
              ))}
            </Row>
            <Row
              label="🏷 Brand"
              className={brandConflict ? "bg-amber-500/10" : undefined}
              hint={brandConflict ? "⚠️ Models disagree" : undefined}
            >
              {models.map((model) => (
                <td key={model.id} className="px-3 py-2 text-gray-200">
                  {brandOf(results[model.id]?.result)}
                </td>
              ))}
            </Row>
            <Row
              label="📱 Best guess model"
              className={fullAgreement ? "bg-emerald-500/10" : undefined}
              hint={fullAgreement ? "✅ Full agreement" : undefined}
            >
              {models.map((model) => (
                <td key={model.id} className="px-3 py-2 text-gray-200">
                  {guessOf(results[model.id]?.result)}
                </td>
              ))}
            </Row>
            <Row label="🔄 Alternatives">
              {models.map((model) => (
                <td key={model.id} className="px-3 py-2 text-xs text-gray-400">
                  {altsOf(results[model.id]?.result)}
                </td>
              ))}
            </Row>
            <Row label="🔑 Key spec">
              {models.map((model) => (
                <td key={model.id} className="px-3 py-2 text-gray-200">
                  {specOf(results[model.id]?.result)}
                </td>
              ))}
            </Row>
            <Row label="🎨 Color">
              {models.map((model) => (
                <td key={model.id} className="px-3 py-2 text-gray-200">
                  {colorOf(results[model.id]?.result)}
                </td>
              ))}
            </Row>
            <Row label="💪 Confidence %">
              {models.map((model) => {
                const result = results[model.id]?.result;
                const conf = result?.detected ? result.confidence : null;
                const isBest =
                  mostConfident?.model.id === model.id && conf != null;
                return (
                  <td
                    key={model.id}
                    className={cn(
                      "px-3 py-2 font-mono text-gray-200",
                      isBest && "bg-amber-400/15 text-amber-300"
                    )}
                  >
                    {conf != null ? (
                      <>
                        {formatConfidence(conf)}
                        {isBest ? " ⭐" : ""}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                );
              })}
            </Row>
            <Row label="📝 Generated title">
              {models.map((model) => (
                <td key={model.id} className="px-3 py-2 text-xs text-gray-300">
                  {titleOf(results[model.id]?.result)}
                </td>
              ))}
            </Row>
          </tbody>
        </table>
      </div>

      {altOverlap.length > 0 ? (
        <div className="space-y-1 text-sm text-gray-400">
          {altOverlap.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : null}

      <div className="grid gap-2 rounded-xl border border-gray-800 bg-gray-900 p-4 text-sm text-gray-200 sm:grid-cols-2">
        <p>
          🏆 Fastest:{" "}
          {fastest
            ? `${fastest.model.name} at ${formatMs(fastest.card.inferenceMs ?? 0)}`
            : "—"}
        </p>
        <p>
          🎯 Most confident:{" "}
          {mostConfident?.card.result?.detected
            ? `${mostConfident.model.name} at ${formatConfidence(mostConfident.card.result.confidence)}`
            : "—"}
        </p>
        <p>
          🤝 Best agreement with majority: {bestAgreement?.model.name ?? "—"}
        </p>
        <p>
          💡 Recommendation: {recommendation}
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
  className,
  hint,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  hint?: string;
}) {
  return (
    <tr className={className}>
      <th className="whitespace-nowrap px-3 py-2 text-left text-xs font-medium text-gray-400">
        {label}
        {hint ? <div className="mt-1 text-[11px] font-normal">{hint}</div> : null}
      </th>
      {children}
    </tr>
  );
}

function categoryOf(result: DetectionResult | undefined): string {
  return result?.detected ? result.category : "—";
}

function brandOf(result: DetectionResult | undefined): string {
  return result?.detected ? result.brand : "—";
}

function guessOf(result: DetectionResult | undefined): string {
  return result?.detected ? result.model : "—";
}

function altsOf(result: DetectionResult | undefined): string {
  if (!result?.detected) return "—";
  return result.alternatives.map((a) => a.model).join(", ") || "—";
}

function specOf(result: DetectionResult | undefined): string {
  if (!result?.detected) return "—";
  switch (result.category) {
    case "phone":
      return result.storage || "—";
    case "laptop":
      return [result.chip, result.ram].filter(Boolean).join(" ") || "—";
    case "car":
      return result.year || "—";
    default: {
      const _exhaustive: never = result;
      return _exhaustive;
    }
  }
}

function colorOf(result: DetectionResult | undefined): string {
  return result?.detected ? result.color || "—" : "—";
}

function titleOf(result: DetectionResult | undefined): string {
  return result?.detected ? result.title || "—" : "—";
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function minBy<T>(items: T[], score: (item: T) => number): T | undefined {
  return items.reduce<T | undefined>((best, item) => {
    if (!best) return item;
    return score(item) < score(best) ? item : best;
  }, undefined);
}

function maxBy<T>(items: T[], score: (item: T) => number): T | undefined {
  return items.reduce<T | undefined>((best, item) => {
    if (!best) return item;
    return score(item) > score(best) ? item : best;
  }, undefined);
}

function mode(values: string[]): string | undefined {
  const counts = new Map<string, number>();
  for (const value of values) {
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  let best: string | undefined;
  let bestCount = 0;
  for (const [value, count] of counts) {
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  }
  return best;
}

function alternativeOverlap(
  detectedRows: { model: VisionModel; card: RaceCardResult }[],
  total: number
): string[] {
  const counts = new Map<string, number>();
  for (const row of detectedRows) {
    const result = row.card.result;
    if (!result?.detected) continue;
    const seen = new Set<string>();
    for (const alt of result.alternatives) {
      if (seen.has(alt.model)) continue;
      seen.add(alt.model);
      counts.set(alt.model, (counts.get(alt.model) ?? 0) + 1);
    }
  }

  const lines: string[] = [];
  for (const [name, count] of counts) {
    if (count >= 3) {
      lines.push(
        `${count} out of ${total} models listed '${name}' as an alternative — model is uncertain between variants`
      );
    }
  }
  return lines;
}

function pickRecommendation({
  detectedRows,
  fastest,
  majorityGuess,
}: {
  detectedRows: { model: VisionModel; card: RaceCardResult }[];
  fastest: { model: VisionModel; card: RaceCardResult } | undefined;
  majorityGuess: string | undefined;
}): string {
  if (detectedRows.length === 0) {
    return "No successful detections — try another photo or enable paid references.";
  }

  const majorityMatches = detectedRows.filter(
    (row) => row.card.result?.detected && row.card.result.model === majorityGuess
  );
  const balanced = minBy(majorityMatches, (row) => row.card.inferenceMs ?? Infinity);

  if (balanced) {
    return `Use ${balanced.model.name} — best speed/accuracy balance for your use case`;
  }
  if (fastest) {
    return `Use ${fastest.model.name} — fastest successful run`;
  }
  return "Compare the cards above and pick the model that matches your product most closely.";
}
