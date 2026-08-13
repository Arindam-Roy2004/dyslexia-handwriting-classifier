const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname.includes("vercel.app")
    ? "https://dyslexia-handwriting-classifier.onrender.com"
    : "http://localhost:5001");

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
  prediction: "Normal" | "Reversal" | "Corrected";
  confidence: number;
  probabilities: ClassProbabilities;
  features: StrokeFeatureMetrics;
  heatmapMatrix: number[][];
  gradCamSummary: string;
  recommendation: string;
  createdAt: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const payload = await response.json();

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || `API Error: ${response.statusText}`);
  }

  return payload.data as T;
}

export const ApiClient = {
  async predictCanvas(imageData: string, intendedLetter: string = "b") {
    return request<AssessmentResult>("/api/assessment/canvas", {
      method: "POST",
      body: JSON.stringify({ imageData, intendedLetter }),
    });
  },

  async predictUpload(file: File, intendedLetter: string = "b") {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("intendedLetter", intendedLetter);

    const response = await fetch(`${API_BASE_URL}/api/assessment/upload`, {
      method: "POST",
      body: formData,
    });
    const payload = await response.json();
    if (!response.ok || payload.success === false) {
      throw new Error(payload.message || "Failed to process image upload");
    }
    return payload.data as AssessmentResult;
  },
};

export default ApiClient;
