import { PredictionResult } from "../types";

export const modelUtils = {
  formatPrediction(prediction: PredictionResult): string {
    return `${prediction.label} (${(prediction.confidence * 100).toFixed(1)}%)`;
  },

  sortPredictions(predictions: PredictionResult[]): PredictionResult[] {
    return [...predictions].sort((a, b) => b.confidence - a.confidence);
  },

  getTopPrediction(predictions: PredictionResult[]): PredictionResult | null {
    if (!predictions.length) return null;
    return predictions.reduce((prev, current) =>
      current.confidence > prev.confidence ? current : prev
    );
  },

  calculateConfidenceColor(confidence: number): string {
    if (confidence > 0.75) return "#27ae60";
    if (confidence > 0.5) return "#f1c40f";
    return "#e74c3c";
  },
};
