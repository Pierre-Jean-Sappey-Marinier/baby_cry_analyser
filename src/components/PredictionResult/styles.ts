import styled from "styled-components";

export const PredictionContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
`;

export const ResultCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

export const ResultTitle = styled.h2`
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;

export const TimeStamp = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1.5rem;
`;

export const PredictionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PredictionItem = styled.div`
  padding: 0.5rem;
  border-radius: 8px;
  background-color: #f8f9fa;
`;

export const Label = styled.div`
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
`;

export const ConfidenceBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const ProgressBar = styled.div<{
  confidence: number;
  isTopResult: boolean;
}>`
  height: 12px;
  flex-grow: 1;
  background-color: #eee;
  border-radius: 6px;
  overflow: hidden;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${(props) => props.confidence}%;
    background-color: ${(props) =>
      props.isTopResult
        ? props.confidence > 75
          ? "#27ae60"
          : props.confidence > 50
          ? "#f1c40f"
          : "#e74c3c"
        : "#3498db"};
    transition: width 0.3s ease;
  }
`;

export const ConfidenceValue = styled.div`
  min-width: 60px;
  font-weight: 500;
  color: #2c3e50;
`;

export const NoResults = styled.div`
  text-align: center;
  color: #7f8c8d;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  font-size: 1.1rem;
`;

export const SaveButton = styled.button`
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.8rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }

  &:active {
    transform: translateY(1px);
  }
`;
