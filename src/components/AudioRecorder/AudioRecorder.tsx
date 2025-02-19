import React, { useState } from "react";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";
import { AudioVisualizer } from "../AudioVisualizer/AudioVisualizer";
import { Container, RecordButton } from "./styles";

export const AudioRecorder = ({
  onAudioData,
}: {
  onAudioData: (data: any) => void;
}) => {
  const {
    isRecording,
    startRecording,
    stopRecording,
    audioData, // Ajout des données audio en temps réel
    stream, // Ajout du flux audio
  } = useAudioRecorder();

  return (
    <Container>
      <AudioVisualizer
        isRecording={isRecording}
        audioData={audioData}
        stream={stream}
      />

      <RecordButton onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </RecordButton>
    </Container>
  );
};
