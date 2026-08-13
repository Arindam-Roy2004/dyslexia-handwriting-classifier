export type DyslexiaClass = "Normal" | "Reversal" | "Corrected";

export interface ClassProbabilities {
  Normal: number;
  Reversal: number;
  Corrected: number;
}

export interface StrokeFeatureMetrics {
  loopOrientation: "left" | "right" | "balanced" | "undetermined";
  stemDirection: "vertical" | "tilted" | "ascender" | "descender";
  jitterScore: number;
  inkDensity: number;
  symmetryRatio: number;
}

export interface AssessmentResult {
  id: string;
  prediction: DyslexiaClass;
  confidence: number;
  probabilities: ClassProbabilities;
  features: StrokeFeatureMetrics;
  heatmapMatrix: number[][]; // 28x28 normalized activation grid
  gradCamSummary: string;
  recommendation: string;
  createdAt: string;
}

export interface IAssessmentService {
  predictFromBase64(base64Data: string, intendedLetter?: string): Promise<AssessmentResult>;
  predictFromBuffer(buffer: Buffer, mimeType: string, intendedLetter?: string): Promise<AssessmentResult>;
  getPresetSamples(): PresetSample[];
}

export interface PresetSample {
  id: string;
  title: string;
  category: DyslexiaClass;
  intendedLetter: string;
  description: string;
  sampleBase64: string;
}
