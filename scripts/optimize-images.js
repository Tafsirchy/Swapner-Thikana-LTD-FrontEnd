import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');

const imagesToOptimize = [
  { input: 'logo-new.png', output: 'logo-new.webp', quality: 90, lossy: false },
  { input: 'luxury_home_hero.png', output: 'luxury_home_hero.webp', quality: 85 }
];

async function optimizeImages() {
  console.log('🚀 Starting static asset optimization...');

  for (const img of imagesToOptimize) {
    const inputPath = path.join(PUBLIC_DIR, img.input);
    const outputPath = path.join(PUBLIC_DIR, img.output);

    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️ Skipping ${img.input}: File not found.`);
      continue;
    }

    try {
      console.log(`📦 Optimizing ${img.input} -> ${img.output}...`);
      
      const pipeline = sharp(inputPath);
      
      if (img.lossy === false) {
        // High quality output for logos
        await pipeline
          .webp({ quality: img.quality, lossless: true })
          .toFile(outputPath);
      } else {
        await pipeline
          .webp({ quality: img.quality })
          .toFile(outputPath);
      }

      const inputSize = fs.statSync(inputPath).size / 1024;
      const outputSize = fs.statSync(outputPath).size / 1024;
      const reduction = ((inputSize - outputSize) / inputSize * 100).toFixed(2);

      console.log(`✅ Success! Size reduced from ${inputSize.toFixed(2)}KB to ${outputSize.toFixed(2)}KB (-${reduction}%)`);
    } catch (error) {
      console.error(`❌ Error optimizing ${img.input}:`, error);
    }
  }

  console.log('\n✨ Asset optimization complete.');
}

optimizeImages();
