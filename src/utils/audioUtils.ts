export const audioUtils = {
  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  },

  async createWaveformData(
    audioBuffer: AudioBuffer,
    points: number = 100
  ): Promise<number[]> {
    const channelData = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(channelData.length / points);
    const waveform = [];

    for (let i = 0; i < points; i++) {
      const start = blockSize * i;
      let sum = 0;

      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(channelData[start + j]);
      }

      waveform.push(sum / blockSize);
    }

    return waveform;
  },

  async convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },
};
