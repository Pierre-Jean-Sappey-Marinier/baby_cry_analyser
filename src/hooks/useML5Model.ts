import { useState, useEffect } from "react";
import ml5 from "ml5";
import { PredictionResult } from "../types";

export const useML5Model = () => {
  const [model, setModel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        // Initialiser le modèle de classification sonore
        const soundClassifier = await ml5.soundClassifier("path/to/your/model");
        setModel(soundClassifier);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load model");
        setIsLoading(false);
      }
    };

    loadModel();
  }, []);

  const classify = async (
    audioData: AudioBuffer
  ): Promise<PredictionResult[]> => {
    if (!model) return [];

    try {
      const results = await model.classify(audioData);
      return results.map((result: any) => ({
        label: result.label,
        confidence: result.confidence,
      }));
    } catch (err) {
      setError("Classification failed");
      return [];
    }
  };

  return { model, isLoading, error, classify };
};
