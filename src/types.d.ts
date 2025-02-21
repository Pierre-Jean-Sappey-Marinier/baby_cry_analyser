declare module "ml5" {
  export function neuralNetwork(options: any): any;

  const ml5: {
    neuralNetwork: typeof neuralNetwork;
  };

  interface PredictionResult {
    label: string;
    confidence: number;
  }
  export default ml5;
}
