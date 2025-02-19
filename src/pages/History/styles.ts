import styled from "styled-components";

export const HistoryContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

export const HistoryTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const HistoryItem = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const DateLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

export const PredictionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const NoHistory = styled.div`
  text-align: center;
  color: #7f8c8d;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

export const ClearButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
  float: right;

  &:hover {
    background-color: #c0392b;
  }
`;
