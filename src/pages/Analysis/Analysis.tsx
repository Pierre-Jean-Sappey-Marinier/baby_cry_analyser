import React, { useState, useEffect } from "react";
import { AudioRecorder } from "../../components/AudioRecorder/AudioRecorder";
import { PredictionResult } from "../../components/PredictionResult/PredictionResult";
import { Container, Title, LoadingMessage } from "./styles";
import * as Meyda from "meyda";
import * as ml5 from "ml5";

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
  console.log("🚀 🍒 ⛔ ☢️ ~ predictions:", predictions);
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

      const trainingOptions = {
        epochs: 50,
        batchSize: 32,
      };

      await new Promise((resolve, reject) => {
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
    } catch (err) {
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
      console.error("Erreur de classification:", err);
      throw err;
    }
  };

  // const extractFeatures = async (audioBlob: Blob): Promise<AudioFeatures> => {
  //   try {
  //     const audioContext = new AudioContext();
  //     const arrayBuffer = await audioBlob.arrayBuffer();
  //     const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  //     const analyzer = Meyda.createMeydaAnalyzer({
  //       audioContext: audioContext,
  //       source: audioContext.createBufferSource(),
  //       bufferSize: 512,
  //       featureExtractors: ["mfcc", "rms", "zcr", "energy"],
  //     });

  //     const features = analyzer.get(["mfcc", "rms", "zcr", "energy"]);

  //     return {
  //       mfcc: features.mfcc || new Array(13).fill(0),
  //       rms: features.rms || 0,
  //       zcr: features.zcr || 0,
  //       energy: features.energy || 0,
  //     };
  //   } catch (error) {
  //     console.error("Erreur lors de l'extraction des caractéristiques:", error);
  //     return {
  //       mfcc: new Array(13).fill(0),
  //       rms: 0,
  //       zcr: 0,
  //       energy: 0,
  //     };
  //   }
  // };

  const extractFeatures = async (audioBlob: Blob): Promise<AudioFeatures> => {
    try {
      const audioContext = new AudioContext();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Créer une source et la connecter
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Créer un nœud d'analyse
      const analyserNode = audioContext.createAnalyser();
      source.connect(analyserNode);
      analyserNode.connect(audioContext.destination);

      // Créer l'analyzer Meyda
      const analyzer = Meyda.createMeydaAnalyzer({
        audioContext: audioContext,
        source: source,
        bufferSize: 512,
        featureExtractors: ["mfcc", "rms", "zcr", "energy"],
        callback: (features) => {
          // Callback si nécessaire
        },
      });

      // Démarrer la source
      source.start(0);
      analyzer.start();

      // Attendre un court instant pour l'analyse
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Obtenir les caractéristiques
      const features = analyzer.get(["mfcc", "rms", "zcr", "energy"]);

      // Arrêter l'analyse
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
      console.log(
        "🚀 🍒 ⛔ ☢️ ~ handleRecordingComplete ~ features:",
        features
      );
      const results = await classify(features);
      console.log("🚀 🍒 ⛔ ☢️ ~ handleRecordingComplete ~ results:", results);
      setPredictions(results);
    } catch (err) {
      setPredictions(err);
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
