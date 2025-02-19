import React, { useState, useEffect } from "react";
import {
  HistoryContainer,
  HistoryTitle,
  HistoryList,
  HistoryItem,
  DateLabel,
  PredictionDetails,
  NoHistory,
  ClearButton,
} from "./styles";
import { PredictionResult } from "../../types";

interface HistoryEntry {
  predictions: PredictionResult[];
  timestamp: string;
}

export const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("cryAnalysisHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("cryAnalysisHistory");
    setHistory([]);
  };

  if (history.length === 0) {
    return (
      <HistoryContainer>
        <HistoryTitle>Analysis History</HistoryTitle>
        <NoHistory>No analysis history available</NoHistory>
      </HistoryContainer>
    );
  }

  return (
    <HistoryContainer>
      <HistoryTitle>Analysis History</HistoryTitle>
      <ClearButton onClick={clearHistory}>Clear History</ClearButton>

      <HistoryList>
        {history.map((entry, index) => (
          <HistoryItem key={index}>
            <DateLabel>{new Date(entry.timestamp).toLocaleString()}</DateLabel>
            <PredictionDetails>
              {entry.predictions.map((pred, predIndex) => (
                <div key={predIndex}>
                  {pred.label}: {(pred.confidence * 100).toFixed(1)}%
                </div>
              ))}
            </PredictionDetails>
          </HistoryItem>
        ))}
      </HistoryList>
    </HistoryContainer>
  );
};
