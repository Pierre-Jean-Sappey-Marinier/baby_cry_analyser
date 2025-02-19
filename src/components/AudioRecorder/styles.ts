import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

export const RecordButton = styled.button<{ isRecording: boolean }>`
  padding: 15px 30px;
  border-radius: 25px;
  border: none;
  background-color: ${({ isRecording }) =>
    isRecording ? "#ff4444" : "#44ff44"};
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const VisualizerCanvas = styled.canvas`
  width: 300px;
  height: 100px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 10px 0;
`;
