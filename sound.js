import * as tf from "@tensorflow/tfjs-node"; // Backend pour Node.js
import * as speechCommands from "@tensorflow-models/speech-commands";
import fs from "fs";
import path from "path";
// Pour gérer les chemins cross-platform (Windows/Linux/Mac)

// Fonction pour extraire les features d'un seul fichier audio
async function extractFeatures(filePath) {
  console.log(`Processing file: ${filePath}`);

  // Lecture du fichier audio .wav sous forme de buffer
  const audioBuffer = fs.readFileSync(filePath);

  // Initialiser SpeechCommands pour extraire des features comme les MFCC
  const recognizer = speechCommands.create("BROWSER_FFT");
  await recognizer.ensureModelLoaded();

  // SpeechCommands accepte généralement des données du micro,
  // mais ici nous allons obtenir directement le spectre avec `recognize`.
  const data = await recognizer.recognize(audioBuffer); // Problématique à confirmer
  console.log("MFCC Features extracted:", data.feature);
  return data.feature;
}

// Fonction pour traiter tous les fichiers du dossier
async function processDirectory(directoryPath) {
  try {
    // Lire tous les fichiers du dossier
    const files = fs.readdirSync(directoryPath);

    // Conserver uniquement les fichiers avec l'extension .wav
    const wavFiles = files.filter((file) => file.endsWith(".wav"));

    console.log(`Found ${wavFiles.length} .wav files in "${directoryPath}"`);

    // Boucle sur chaque fichier .wav et extraire les features
    for (const wavFile of wavFiles) {
      const fullPath = path.join(directoryPath, wavFile); // Chemin complet du fichier

      try {
        const mfccFeatures = await extractFeatures(fullPath);
        console.log(`Extracted features for file: ${wavFile}`, mfccFeatures);
      } catch (error) {
        console.error(`Failed to process file: ${wavFile}`, error);
      }
    }
  } catch (error) {
    console.error(`Failed to read directory: ${directoryPath}`, error);
  }
}

// Appeler la fonction pour traiter tous les fichiers dans le dossier 'tired/'
processDirectory("./data/tired");
