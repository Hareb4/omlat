export interface VisionModel {
  id: string;
  name: string;
  modelString: string;
  badge: string;
  badgeColor: string;
  free: boolean;
  expectedMs: string;
  notes: string;
}

export const MODELS: VisionModel[] = [
  {
    id: "gemma-4-26b",
    name: "Gemma 4 26B A4B",
    modelString: "google/gemma-4-26b-a4b-it:free",
    badge: "Fast",
    badgeColor: "#00c853",
    free: true,
    expectedMs: "400–1200ms",
    notes: "Free MoE vision model — 3.8B active, good speed/quality default",
  },
  {
    id: "gemma-4-31b",
    name: "Gemma 4 31B",
    modelString: "google/gemma-4-31b-it:free",
    badge: "Google",
    badgeColor: "#4285f4",
    free: true,
    expectedMs: "800–1800ms",
    notes: "Dense Gemma 4 multimodal, stronger than the 26B MoE on hard variants",
  },
  {
    id: "nemotron-omni",
    name: "Nemotron 3 Nano Omni",
    modelString: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    badge: "Product Expert",
    badgeColor: "#ff6d00",
    free: true,
    expectedMs: "600–1600ms",
    notes: "NVIDIA free multimodal — strong on images, charts, and product details",
  },
  {
    id: "minimax-m3",
    name: "MiniMax M3",
    modelString: "minimax/minimax-m3:free",
    badge: "Detail",
    badgeColor: "#00bcd4",
    free: true,
    expectedMs: "700–1800ms",
    notes: "Free multimodal foundation model, useful for long product descriptions",
  },
  {
    id: "inkling-small",
    name: "Inkling Small",
    modelString: "thinkingmachines/inkling-small:free",
    badge: "Tiny+Fast",
    badgeColor: "#607d8b",
    free: true,
    expectedMs: "400–1000ms",
    notes: "Smaller free multimodal MoE — test if accuracy is acceptable",
  },
  {
    id: "inkling",
    name: "Inkling",
    modelString: "thinkingmachines/inkling:free",
    badge: "Best Free",
    badgeColor: "#aa00ff",
    free: true,
    expectedMs: "1000–2500ms",
    notes: "Largest free general multimodal in this set",
  },
  {
    id: "dots-note",
    name: "Dots3 Note",
    modelString: "dots-studio/dots-3-note-preview:free",
    badge: "OCR",
    badgeColor: "#2979ff",
    free: true,
    expectedMs: "600–1500ms",
    notes: "Free vision model tuned for notes/text — good at model numbers on devices",
  },
  {
    id: "qwen3-vl-8b",
    name: "Qwen3 VL 8B",
    modelString: "qwen/qwen3-vl-8b-instruct",
    badge: "Paid Ref",
    badgeColor: "#f59e0b",
    free: false,
    expectedMs: "500–1200ms",
    notes: "Cheap Qwen3 vision replacement for the retired 7B :free slug",
  },
  {
    id: "gpt4o-mini",
    name: "GPT-4o Mini",
    modelString: "openai/gpt-4o-mini",
    badge: "Paid Ref",
    badgeColor: "#f59e0b",
    free: false,
    expectedMs: "800–1500ms",
    notes: "Paid accuracy reference. ~$0.002/image",
  },
  {
    id: "gemini-flash",
    name: "Gemini 2.5 Flash Lite",
    modelString: "google/gemini-2.5-flash-lite",
    badge: "Paid Ref",
    badgeColor: "#f59e0b",
    free: false,
    expectedMs: "500–1200ms",
    notes: "Paid accuracy reference (replaces retired gemini-flash-1.5)",
  },
];

export const DEFAULT_ENABLED = MODELS.filter((m) => m.free).map((m) => m.id);

export const DEFAULT_PHONE_MODEL_ID = "gemma-4-26b";

export function getModelById(id: string): VisionModel | undefined {
  return MODELS.find((m) => m.id === id);
}
