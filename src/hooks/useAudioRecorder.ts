import { useState, useEffect } from "react";

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [, setAnalyzer] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((streamData) => {
          setStream(streamData);
          const context = new AudioContext();
          const analyzerNode = context.createAnalyser();
          const source = context.createMediaStreamSource(streamData);

          source.connect(analyzerNode);
          setAudioContext(context);
          setAnalyzer(analyzerNode);

          // Configuration de l'analyseur
          analyzerNode.fftSize = 2048;
          const bufferLength = analyzerNode.frequencyBinCount;
          const dataArray = new Float32Array(bufferLength);

          // Mise à jour des données audio
          const updateData = () => {
            if (isRecording) {
              analyzerNode.getFloatTimeDomainData(dataArray);
              setAudioData(dataArray);
              requestAnimationFrame(updateData);
            }
          };
          updateData();
        })
        .catch((err) => console.error("Error accessing microphone:", err));
    }

    return () => {
      if (audioContext) {
        audioContext.close();
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isRecording]);

  const startRecording = () => setIsRecording(true);
  const stopRecording = () => setIsRecording(false);

  return {
    isRecording,
    startRecording,
    stopRecording,
    audioData,
    stream,
  };
};
