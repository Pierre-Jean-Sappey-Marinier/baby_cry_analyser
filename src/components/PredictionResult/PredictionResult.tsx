import React from "react";
import {
  PredictionContainer,
  ResultCard,
  ResultTitle,
  PredictionList,
  PredictionItem,
  Label,
  ConfidenceBar,
  ConfidenceValue,
  ProgressBar,
  NoResults,
  TimeStamp,
  SaveButton,
} from "./styles";

interface PredictionResultProps {
  predictions: {
    label: string;
    confidence: number;
  }[];
}

export const PredictionResult: React.FC<PredictionResultProps> = ({
  predictions,
}) => {
  const getCurrentTime = () => {
    return new Date().toLocaleString();
  };

  const handleSaveResults = () => {
    const resultsToSave = {
      predictions,
      timestamp: new Date(),
    };
    const history = JSON.parse(
      localStorage.getItem("cryAnalysisHistory") || "[]"
    );
    history.push(resultsToSave);
    localStorage.setItem("cryAnalysisHistory", JSON.stringify(history));
  };

  if (!predictions || predictions.length === 0) {
    return (
      <PredictionContainer>
        <NoResults>
          No predictions available yet. Record a baby cry to start the analysis.
        </NoResults>
      </PredictionContainer>
    );
  }

  return (
    <PredictionContainer>
      <ResultCard>
        <ResultTitle>Analysis Results</ResultTitle>
        <TimeStamp>{getCurrentTime()}</TimeStamp>

        <PredictionList>
          {predictions.map((prediction, index) => (
            <PredictionItem key={index}>
              <Label>{prediction.label}</Label>
              <ConfidenceBar>
                <ProgressBar
                  confidence={prediction.confidence * 100}
                  isTopResult={index === 0}
                />
                <ConfidenceValue>
                  {(prediction.confidence * 100).toFixed(1)}%
                </ConfidenceValue>
              </ConfidenceBar>
            </PredictionItem>
          ))}
        </PredictionList>

        <SaveButton onClick={handleSaveResults}>Save Results</SaveButton>
      </ResultCard>
    </PredictionContainer>
  );
};
