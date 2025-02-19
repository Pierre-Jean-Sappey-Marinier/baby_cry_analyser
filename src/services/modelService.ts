import ml5 from "ml5";
import { PredictionResult } from "../types";

const MODEL_URL = "path/to/your/model.json";

export const modelService = {
  async loadModel() {
    try {
      const model = await ml5.soundClassifier(MODEL_URL);
      return model;
    } catch (error) {
      throw new Error("Failed to load model: " + (error as Error).message);
    }
  },

  async classify(
    model: any,
    audioBuffer: AudioBuffer
  ): Promise<PredictionResult[]> {
    try {
      const results = await model.classify(audioBuffer);
      return results.map((result: any) => ({
        label: result.label,
        confidence: result.confidence,
      }));
    } catch (error) {
      throw new Error("Classification failed: " + (error as Error).message);
    }
  },
};
