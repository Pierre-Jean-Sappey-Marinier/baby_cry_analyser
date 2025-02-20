// PredictionResult.tsx
import { Container, Title, PredictionItem, PredictionText } from "./styles";

interface PredictionResult {
  label: string;
  confidence: number;
}

interface Props {
  predictions: PredictionResult[];
}

export const PredictionResult: React.FC<Props> = ({ predictions }) => {
  if (!predictions.length) return null;

  return (
    <Container>
      <Title>Results:</Title>
      {predictions.map((prediction, index) => (
        <PredictionItem key={index}>
          <PredictionText>
            {prediction.label}: {(prediction.confidence * 100).toFixed(2)}%
          </PredictionText>
        </PredictionItem>
      ))}
    </Container>
  );
};
