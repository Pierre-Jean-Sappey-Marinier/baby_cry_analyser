// styles.ts
import styled from "styled-components";

export const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

export const Title = styled.h3`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
`;

export const PredictionItem = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 10px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(5px);
  }
`;

export const PredictionText = styled.p`
  color: #2c3e50;
  font-size: 1.1rem;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
