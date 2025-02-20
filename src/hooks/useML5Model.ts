// hooks/useML5Model.ts
import { useState, useEffect } from "react";
import * as ml5 from "ml5";

interface AudioFeatures {
  mfcc: number[];
  rms: number;
  zcr: number;
  energy: number;
}

interface TrainingData {
  filename: string;
  features: AudioFeatures;
  label: string;
}

interface TrainingDataResponse {
  data: TrainingData[];
}

export const useML5Model = () => {
  const [model, setModel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeModel();
  }, []);

  const initializeModel = async () => {
    try {
      const options = {
        task: "classification",
        debug: true,
        inputs: 16, // 13 MFCC + RMS + ZCR + Energy
        outputs: 5, // Nombre de catégories
        layers: [
          {
            type: "dense",
            units: 128,
            activation: "relu",
          },
          {
            type: "dense",
            units: 64,
            activation: "relu",
          },
          {
            type: "dense",
            activation: "softmax",
          },
        ],
      };

      const neuralNetwork = ml5.neuralNetwork(options);

      // Charger les données d'entraînement
      await loadTrainingData(neuralNetwork);

      setModel(neuralNetwork);
      setIsLoading(false);
    } catch (err) {
      console.error("Erreur d'initialisation:", err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const loadTrainingData = async (neuralNetwork: any) => {
    try {
      const response = await fetch("/data/tired/tired.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData: TrainingDataResponse = await response.json();

      // Ajouter chaque exemple au modèle
      jsonData.data.forEach((item) => {
        const inputs = [
          ...item.features.mfcc,
          item.features.rms,
          item.features.zcr,
          item.features.energy,
        ];

        neuralNetwork.addData(inputs, [item.label]);
      });

      // Normaliser et entraîner
      neuralNetwork.normalizeData();

      const trainingOptions = {
        epochs: 50,
        batchSize: 32,
      };

      return new Promise((resolve, reject) => {
        neuralNetwork.train(
          trainingOptions,
          () => {
            console.log("Entraînement terminé");
            resolve(null);
          },
          (epoch: number, loss: number) => {
            console.log(`Epoch: ${epoch}, Loss: ${loss}`);
          }
        );
      });
    } catch (err) {
      console.error("Erreur de chargement des données:", err);
      throw new Error("Erreur lors du chargement des données : " + err.message);
    }
  };

  const classify = async (audioFeatures: AudioFeatures): Promise<any[]> => {
    if (!model) {
      throw new Error("Model not loaded");
    }

    try {
      const inputs = [
        ...audioFeatures.mfcc,
        audioFeatures.rms,
        audioFeatures.zcr,
        audioFeatures.energy,
      ];

      return new Promise((resolve, reject) => {
        model.classify(inputs, (error: Error, results: any[]) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { model, isLoading, error, classify };
};
