export const audioService = {
  async createAudioBuffer(audioBlob: Blob): Promise<AudioBuffer> {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioContext = new AudioContext();
    return await audioContext.decodeAudioData(arrayBuffer);
  },

  async normalizeAudio(audioBuffer: AudioBuffer): Promise<AudioBuffer> {
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;

    const gainNode = offlineContext.createGain();
    source.connect(gainNode);
    gainNode.connect(offlineContext.destination);

    source.start(0);
    return await offlineContext.startRendering();
  },

  calculateAudioDuration(audioBuffer: AudioBuffer): number {
    return audioBuffer.duration;
  },
};
