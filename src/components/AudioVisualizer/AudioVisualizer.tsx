import React, { useEffect, useRef } from "react";
import { VisualizerContainer, VisualizerCanvas } from "./styles";

interface AudioVisualizerProps {
  audioStream: MediaStream | null;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioStream,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!audioStream || !canvasRef.current) return;

    // Nettoyer l'ancien contexte audio si il existe
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Créer un nouveau contexte audio
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();

    const source = audioContextRef.current.createMediaStreamSource(audioStream);
    source.connect(analyserRef.current);

    analyserRef.current.fftSize = 256;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!analyserRef.current || !ctx) return;

      animationFrameId.current = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;

        const gradient = ctx.createLinearGradient(
          0,
          height,
          0,
          height - barHeight
        );
        gradient.addColorStop(0, "#3498db");
        gradient.addColorStop(1, "#2980b9");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioStream]);

  return (
    <VisualizerContainer>
      <VisualizerCanvas ref={canvasRef} width={300} height={100} />
    </VisualizerContainer>
  );
};
