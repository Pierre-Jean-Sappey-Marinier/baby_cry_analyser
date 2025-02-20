import Meyda from "meyda";
import wav from "node-wav";
import fs from "fs";
import path from "path";

// Fonction pour extraire les caractéristiques audio d'un fichier
async function extractFeatures(filePath) {
  try {
    console.log(`Processing file: ${filePath}`);

    // Lire le fichier WAV
    const buffer = fs.readFileSync(filePath);
    const wavData = wav.decode(buffer);

    // Paramètres pour l'extraction des caractéristiques
    const sampleRate = wavData.sampleRate;
    const audioData = wavData.channelData[0]; // Utiliser le premier canal si stéréo

    // Configuration des caractéristiques à extraire
    const features = {
      mfcc: [], // Coefficients cepstraux
      rms: [], // Root Mean Square Energy
      zcr: [], // Zero Crossing Rate
      energy: [], // Energy
    };

    // Taille de la fenêtre pour l'analyse (en échantillons)
    const windowSize = 2048;
    const hopSize = 1024;

    // Extraire les caractéristiques par fenêtre
    for (let i = 0; i < audioData.length - windowSize; i += hopSize) {
      const audioWindow = audioData.slice(i, i + windowSize);

      const frameFeatures = Meyda.extract(
        ["mfcc", "rms", "zcr", "energy"],
        audioWindow,
        {
          sampleRate: sampleRate,
          bufferSize: windowSize,
        }
      );

      features.mfcc.push(frameFeatures.mfcc);
      features.rms.push(frameFeatures.rms);
      features.zcr.push(frameFeatures.zcr);
      features.energy.push(frameFeatures.energy);
    }

    // Calculer les moyennes pour chaque caractéristique
    const averageFeatures = {
      mfcc: calculateMeanArray(features.mfcc),
      rms: calculateMean(features.rms),
      zcr: calculateMean(features.zcr),
      energy: calculateMean(features.energy),
    };

    return averageFeatures;
  } catch (error) {
    throw new Error(`Error processing file ${filePath}: ${error.message}`);
  }
}

// Fonction utilitaire pour calculer la moyenne d'un tableau
function calculateMean(array) {
  return array.reduce((a, b) => a + b, 0) / array.length;
}

// Fonction utilitaire pour calculer la moyenne d'un tableau de tableaux
function calculateMeanArray(arrayOfArrays) {
  const length = arrayOfArrays[0].length;
  const sums = new Array(length).fill(0);

  arrayOfArrays.forEach((array) => {
    array.forEach((value, index) => {
      sums[index] += value;
    });
  });

  return sums.map((sum) => sum / arrayOfArrays.length);
}

// Fonction pour traiter un dossier entier
async function processDirectory(directoryPath) {
  try {
    // Lire tous les fichiers du dossier
    const files = fs.readdirSync(directoryPath);
    const wavFiles = files.filter((file) => file.endsWith(".wav"));

    console.log(`Found ${wavFiles.length} .wav files in "${directoryPath}"`);

    // Stocker tous les résultats
    const results = [];

    // Traiter chaque fichier
    for (const wavFile of wavFiles) {
      const fullPath = path.join(directoryPath, wavFile);
      try {
        const features = await extractFeatures(fullPath);
        results.push({
          filename: wavFile,
          features: features,
        });
        console.log(`Successfully processed: ${wavFile}`);
      } catch (error) {
        console.error(`Failed to process file: ${wavFile}`, error.message);
      }
    }

    // Sauvegarder les résultats dans un fichier JSON
    const outputPath = path.join(directoryPath, "features.json");
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`Results saved to: ${outputPath}`);

    return results;
  } catch (error) {
    console.error(`Failed to process directory: ${directoryPath}`, error);
    throw error;
  }
}

// Fonction pour traiter tous les dossiers de catégories
async function processAllCategories() {
  const categories = [
    "tired",
    "hungry",
    "belly",
    "burping",
    "discomfort",
    "bellypain",
  ];
  const baseDir = "./data";

  console.log("Starting audio feature extraction for all categories...");

  for (const category of categories) {
    const categoryPath = path.join(baseDir, category);

    // Vérifier si le dossier existe
    if (fs.existsSync(categoryPath)) {
      console.log(`\nProcessing category: ${category}`);
      try {
        await processDirectory(categoryPath);
        console.log(`Completed processing category: ${category}`);
      } catch (error) {
        console.error(`Error processing category ${category}:`, error);
      }
    } else {
      console.warn(`Warning: Directory not found for category: ${category}`);
    }
  }

  console.log("\nAll categories processing completed!");
}

// Exécuter le traitement pour toutes les catégories
try {
  await processAllCategories();
} catch (error) {
  console.error("Error in main execution:", error);
}
