export interface AudioData {
  url: string;
  timestamp: Date;
  duration: number;
}

export interface PredictionResult {
  label: string;
  confidence: number;
}

export interface ModelState {
  isLoading: boolean;
  error: string | null;
  predictions: PredictionResult[];
}
