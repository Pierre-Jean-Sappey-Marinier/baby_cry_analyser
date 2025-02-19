import React, { useState } from "react";
import { AudioRecorder } from "../../components/AudioRecorder/AudioRecorder";
import { PredictionResult } from "../../components/PredictionResult/PredictionResult";
import { useML5Model } from "../../hooks/useML5Model";
import { Container, Title, LoadingMessage } from "./styles";

export const Analysis: React.FC = () => {
  const { model, isLoading, error, classify } = useML5Model();
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);

  const handleRecordingComplete = async (audioBlob: Blob) => {
    const audioBuffer = await audioBlob.arrayBuffer();
    const results = await classify(audioBuffer);
    setPredictions(results);
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
      <AudioRecorder onRecordingComplete={handleRecordingComplete} />
      <PredictionResult predictions={predictions} />
    </Container>
  );
};
