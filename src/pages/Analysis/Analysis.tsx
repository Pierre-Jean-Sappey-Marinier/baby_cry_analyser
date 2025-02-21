import React, { useState, useEffect } from "react";
import { AudioRecorder } from "../../components/AudioRecorder/AudioRecorder";
import { PredictionResult } from "../../components/PredictionResult/PredictionResult";
import { Container, Title, LoadingMessage } from "./styles";
import * as Meyda from "meyda"; // Correction via déclaration
import * as ml5 from "ml5"; // Correction via déclaration

// Déclaration pour éviter les erreurs TypeScript
// Ajoutez ce declare module "ml5"; à un fichier global .d.ts si besoin

interface AudioFeatures {
  mfcc: number[];
  rms: number;
  zcr: number;
  energy: number;
}

const CLASSES = ["tired", "burping", "discomfort", "bellypain"];

export const Analysis: React.FC = () => {
  const [model, setModel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [key, setKey] = useState(0);

  useEffect(() => {
    initializeModel();
  }, []);

  const initializeModel = async () => {
    try {
      const options = {
        task: "classification",
        debug: false,
        inputs: 16,
        outputs: CLASSES,
        layers: [
          { type: "dense", units: 128, activation: "relu" },
          { type: "dense", units: 64, activation: "relu" },
          { type: "dense", activation: "softmax" },
        ],
      };

      const neuralNetwork = ml5.neuralNetwork(options);

      for (const className of CLASSES) {
        const response = await fetch(`/data/${className}/features.json`);
        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status} for ${className}`
          );
        }

        const features = await response.json();

        features.forEach((item: any) => {
          const inputs = [
            ...item.features.mfcc,
            item.features.rms,
            item.features.zcr,
            item.features.energy,
          ];
          neuralNetwork.addData(inputs, [className]);
        });

        console.log(`Loaded ${features.length} samples for class ${className}`);
      }

      neuralNetwork.normalizeData();

      // Correction : suppression de "reject" non utilisé
      const trainingOptions = {
        epochs: 50,
        batchSize: 32,
      };

      await new Promise((resolve) => {
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

      setModel(neuralNetwork);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Erreur d'initialisation:", err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const classify = async (features: AudioFeatures): Promise<any[]> => {
    if (!model) {
      throw new Error("Model not loaded");
    }

    try {
      const inputs = [
        ...features.mfcc,
        features.rms,
        features.zcr,
        features.energy,
      ];
      console.log("🚀 🍒 ⛔ ☢️ ~ classify ~ inputs:", inputs);

      return new Promise((resolve, reject) => {
        model.classify(inputs, (error: any[], results: any[]) => {
          console.log("🚀 🍒 ⛔ ☢️ ~ model.classify ~ results:", results);
          console.log("🚀 🍒 ⛔ ☢️ ~ model.classify ~ error:", error);
          if (error) {
            resolve(error);
          } else {
            reject(error);
          }
        });
      });
    } catch (err) {
      console.error("Erreur de classification:", err);
      throw err;
    }
  };

  const extractFeatures = async (audioBlob: Blob): Promise<AudioFeatures> => {
    try {
      const audioContext = new AudioContext();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      const analyserNode = audioContext.createAnalyser();
      source.connect(analyserNode);
      analyserNode.connect(audioContext.destination);

      // Correction : ajout d'un typage explicite pour éviter l'erreur
      const analyzer = (Meyda as any).createMeydaAnalyzer({
        audioContext: audioContext,
        source: source,
        bufferSize: 512,
        featureExtractors: ["mfcc", "rms", "zcr", "energy"],
        callback: () => {
          // Callback si nécessaire
        },
      });

      source.start(0);
      analyzer.start();

      await new Promise((resolve) => setTimeout(resolve, 100));

      const features = analyzer.get(["mfcc", "rms", "zcr", "energy"]);

      analyzer.stop();
      source.stop();
      audioContext.close();

      return {
        mfcc: features.mfcc || new Array(13).fill(0),
        rms: features.rms || 0,
        zcr: features.zcr || 0,
        energy: features.energy || 0,
      };
    } catch (error) {
      console.error("Erreur lors de l'extraction des caractéristiques:", error);
      throw error;
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    try {
      const features = await extractFeatures(audioBlob);
      const results = await classify(features);
      setPredictions(results);
    } catch (err) {
      console.error("Erreur lors de la prédiction:", err);
    }
  };

  const handleReset = () => {
    setPredictions([]);
    setKey((prevKey) => prevKey + 1);
  };

  if (isLoading) {
    return <LoadingMessage>Loading model...</LoadingMessage>;
  }

  if (error) {
    return <LoadingMessage>Error: {error}</LoadingMessage>;
  }

  return (
    <Container>
      <Title>Baby Cry Analyzer</Title>
      <AudioRecorder key={key} onRecordingComplete={handleRecordingComplete} />
      {predictions.length > 0 && (
        <>
          <PredictionResult predictions={predictions} />
          <button
            onClick={handleReset}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Nouvelle Analyse
          </button>
        </>
      )}
    </Container>
  );
};
