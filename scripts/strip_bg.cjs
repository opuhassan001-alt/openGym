const sharp = require('e:/work station/gym app/frontend/node_modules/sharp');
const fs = require('fs');
const path = require('path');

async function processImage(inputPath, outputPath) {
  console.log(`Processing ${inputPath} -> ${outputPath}...`);
  const image = sharp(inputPath);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Visited array
  const visited = new Uint8Array(width * height);
  const queue = [];

  // Helper to check if pixel is near-white background
  function isWhite(x, y) {
    const idx = (y * width + x) * channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    // Background is clean studio white: R > 235, G > 235, B > 235
    return r > 232 && g > 232 && b > 232;
  }

  // Enqueue borders
  for (let x = 0; x < width; x++) {
    if (isWhite(x, 0)) { queue.push((0 * width + x)); visited[0 * width + x] = 1; }
    if (isWhite(x, height - 1)) { queue.push(((height - 1) * width + x)); visited[(height - 1) * width + x] = 1; }
  }
  for (let y = 0; y < height; y++) {
    if (isWhite(0, y)) { queue.push((y * width + 0)); visited[y * width + 0] = 1; }
    if (isWhite(width - 1, y)) { queue.push((y * width + (width - 1))); visited[y * width + (width - 1)] = 1; }
  }

  // BFS
  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    // Set alpha to 0 for background
    const idx = (cy * width + cx) * channels;
    data[idx + 3] = 0;

    // Check 4 neighbors
    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (let i = 0; i < 4; i++) {
      const [nx, ny] = neighbors[i];
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const npos = ny * width + nx;
        if (!visited[npos] && isWhite(nx, ny)) {
          visited[npos] = 1;
          queue.push(npos);
        }
      }
    }
  }

  // Edge de-fringing (smooth transition on edges bordering transparent background)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pos = y * width + x;
      if (visited[pos]) continue; // already transparent

      const idx = pos * channels;
      // Check if neighboring transparent pixel
      const nTransparent = (
        visited[pos - 1] + visited[pos + 1] + 
        visited[pos - width] + visited[pos + width]
      );

      if (nTransparent > 0) {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const brightness = (r + g + b) / 3;
        if (brightness > 210) {
          // Soften edge to remove white fringe
          const factor = (255 - brightness) / 45;
          data[idx + 3] = Math.min(255, Math.max(0, Math.round(255 * factor)));
        }
      }
    }
  }

  // Output high quality PNG with full transparency
  const outBuf = await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(outputPath, outBuf);
  console.log(`Saved ${outputPath} (${outBuf.length} bytes)`);

  // Verify corner alphas
  const check = await sharp(outputPath).raw().toBuffer({ resolveWithObject: true });
  const cData = check.data;
  const cW = check.info.width;
  const cH = check.info.height;
  const corners = [
    cData[3],                                        // top-left
    cData[(cW - 1) * 4 + 3],                         // top-right
    cData[((cH - 1) * cW) * 4 + 3],                  // bottom-left
    cData[((cH - 1) * cW + (cW - 1)) * 4 + 3]        // bottom-right
  ];
  console.log(`Corner Alphas: [${corners.join(', ')}]`);
}

async function run() {
  const genFiles = [
    'C:/Users/User/.gemini/antigravity/brain/95e369ba-795c-4c09-b779-36ef954f223f/gen_char1_1792408501204.jpg',
    'C:/Users/User/.gemini/antigravity/brain/95e369ba-795c-4c09-b779-36ef954f223f/gen_char2_1792408580946.jpg',
    'C:/Users/User/.gemini/antigravity/brain/95e369ba-795c-4c09-b779-36ef954f223f/gen_char3_1792408639691.jpg',
    'C:/Users/User/.gemini/antigravity/brain/95e369ba-795c-4c09-b779-36ef954f223f/gen_char4_1792408711344.jpg'
  ];

  for (let i = 0; i < 4; i++) {
    const target = `frontend/public/characters/char${i + 1}.png`;
    await processImage(genFiles[i], target);
  }
  console.log('ALL 4 CHARACTERS PROCESSED SUCCESSFULLY!');
}

run();

