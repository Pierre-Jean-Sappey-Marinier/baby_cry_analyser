// // utils/audioFeatureExtractor.ts
// import * as Meyda from "meyda";

// export const extractFeatures = async (audioBlob: Blob) => {
//   const audioContext = new AudioContext();
//   const arrayBuffer = await audioBlob.arrayBuffer();
//   const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

//   const analyzer = Meyda.createMeydaAnalyzer({
//     audioContext: audioContext,
//     source: audioContext.createBufferSource(),
//     bufferSize: 512,
//     featureExtractors: ["mfcc", "rms", "zcr", "energy"],
//   });

//   return analyzer.get(["mfcc", "rms", "zcr", "energy"]);
// };
