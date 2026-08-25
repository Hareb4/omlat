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
    id: "llama-11b",
    name: "LLaMA 3.2 Vision 11B",
    modelString: "meta-llama/llama-3.2-11b-vision-instruct:free",
    badge: "Fast",
    badgeColor: "#00c853",
    free: true,
    expectedMs: "400–900ms",
    notes: "Fastest free model, good for category + brand",
  },
  {
    id: "llama-90b",
    name: "LLaMA 3.2 Vision 90B",
    modelString: "meta-llama/llama-3.2-90b-vision-instruct:free",
    badge: "Accurate",
    badgeColor: "#2979ff",
    free: true,
    expectedMs: "800–1800ms",
    notes: "Larger, better at specific model variants",
  },
  {
    id: "qwen-7b",
    name: "Qwen 2.5 VL 7B",
    modelString: "qwen/qwen2.5-vl-7b-instruct:free",
    badge: "Product Expert",
    badgeColor: "#ff6d00",
    free: true,
    expectedMs: "500–1000ms",
    notes: "Strong on consumer electronics and cars",
  },
  {
    id: "qwen-72b",
    name: "Qwen 2.5 VL 72B",
    modelString: "qwen/qwen2.5-vl-72b-instruct:free",
    badge: "Best Free",
    badgeColor: "#aa00ff",
    free: true,
    expectedMs: "1000–2500ms",
    notes: "Highest accuracy among free models",
  },
  {
    id: "pixtral",
    name: "Mistral Pixtral 12B",
    modelString: "mistralai/pixtral-12b:free",
    badge: "Detail",
    badgeColor: "#00bcd4",
    free: true,
    expectedMs: "700–1500ms",
    notes: "Good at reading text on products (model numbers)",
  },
  {
    id: "phi-4",
    name: "Microsoft Phi-4 Multimodal",
    modelString: "microsoft/phi-4-multimodal-instruct:free",
    badge: "Tiny+Fast",
    badgeColor: "#607d8b",
    free: true,
    expectedMs: "300–700ms",
    notes: "Smallest model, test if accuracy is acceptable",
  },
  {
    id: "gemma-12b",
    name: "Gemma 3 12B",
    modelString: "google/gemma-3-12b-it:free",
    badge: "Google",
    badgeColor: "#4285f4",
    free: true,
    expectedMs: "600–1200ms",
    notes: "Google architecture, different failure modes",
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
    name: "Gemini 1.5 Flash",
    modelString: "google/gemini-flash-1.5",
    badge: "Paid Ref",
    badgeColor: "#f59e0b",
    free: false,
    expectedMs: "700–1400ms",
    notes: "Paid accuracy reference.",
  },
];

export const DEFAULT_ENABLED = MODELS.filter((m) => m.free).map((m) => m.id);

export const DEFAULT_PHONE_MODEL_ID = "qwen-7b";

export function getModelById(id: string): VisionModel | undefined {
  return MODELS.find((m) => m.id === id);
}
