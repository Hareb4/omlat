export type Category = "phone" | "laptop" | "car";

export type ConditionGuess = "new" | "like new" | "good" | "fair" | "poor";

export type AppMode = "phone" | "race";

export interface Alternative {
  model: string;
  note: string;
}

export interface PhoneDetection {
  detected: true;
  category: "phone";
  brand: string;
  model: string;
  alternatives: Alternative[];
  storage: string | null;
  storage_options: string[];
  color: string | null;
  condition_guess: ConditionGuess | string;
  confidence: number;
  title: string;
}

export interface LaptopDetection {
  detected: true;
  category: "laptop";
  brand: string;
  model: string;
  alternatives: Alternative[];
  chip: string | null;
  ram: string | null;
  ram_options: string[];
  storage: string | null;
  storage_options: string[];
  color: string | null;
  condition_guess: ConditionGuess | string;
  confidence: number;
  title: string;
}

export interface CarDetection {
  detected: true;
  category: "car";
  brand: string;
  model: string;
  alternatives: Alternative[];
  year: string | null;
  year_options: string[];
  color: string | null;
  body_type: string | null;
  condition_guess: ConditionGuess | string;
  confidence: number;
  title: string;
}

export interface Undetected {
  detected: false;
  reason: string;
  _raw?: string;
}

export type DetectionResult =
  | PhoneDetection
  | LaptopDetection
  | CarDetection
  | Undetected;

export type DetectedResult = Exclude<DetectionResult, Undetected>;

export interface TitleOverrides {
  model?: string | null;
  storage?: string | null;
  ram?: string | null;
  year?: string | null;
  chip?: string | null;
  color?: string | null;
  condition_guess?: string | null;
  body_type?: string | null;
}

export interface BenchmarkImage {
  file: File;
  base64: string;
  mimeType: string;
  preview: string;
  originalSizeKB: number;
  compressedSizeKB: number;
  width: number;
  height: number;
}

export interface CompressedImage {
  base64: string;
  mimeType: string;
  width: number;
  height: number;
  sizeKB: number;
  originalSizeKB: number;
}

export type RaceCardStatus = "idle" | "loading" | "success" | "error";

export interface RaceCardResult {
  status: RaceCardStatus;
  startTime?: number;
  result?: DetectionResult;
  rawText?: string;
  inferenceMs?: number;
  error?: string;
}

export interface ModelCallResponse {
  result: DetectionResult;
  rawText: string;
  inferenceMs: number;
  modelString: string;
}
