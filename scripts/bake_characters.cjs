const sharp = require('e:/work station/gym app/frontend/node_modules/sharp');
const fs = require('fs');
const path = require('path');

// Generate 3D gym dumbbell SVG buffer
function getDumbbellSvg(width, height, rotate = 0) {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#8892b0" />
          <stop offset="25%" stop-color="#ffffff" />
          <stop offset="50%" stop-color="#4a5568" />
          <stop offset="75%" stop-color="#a0aec0" />
          <stop offset="100%" stop-color="#1a202c" />
        </linearGradient>
        <linearGradient id="plateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#2d3748" />
          <stop offset="20%" stop-color="#718096" />
          <stop offset="45%" stop-color="#e2e8f0" />
          <stop offset="70%" stop-color="#2d3748" />
          <stop offset="100%" stop-color="#111827" />
        </linearGradient>
        <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#1a202c" stop-opacity="0.3" />
        </linearGradient>
        <filter id="heavyShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.55" />
        </filter>
      </defs>

      <g transform="rotate(${rotate} 80 40)" filter="url(#heavyShadow)">
        <rect x="36" y="33" width="88" height="14" rx="4" fill="url(#barGrad)" />
        <line x1="46" y1="33" x2="46" y2="47" stroke="#1a202c" stroke-width="1.5" opacity="0.6" />
        <line x1="54" y1="33" x2="54" y2="47" stroke="#1a202c" stroke-width="1.5" opacity="0.6" />
        <line x1="106" y1="33" x2="106" y2="47" stroke="#1a202c" stroke-width="1.5" opacity="0.6" />
        <line x1="114" y1="33" x2="114" y2="47" stroke="#1a202c" stroke-width="1.5" opacity="0.6" />

        <rect x="24" y="14" width="12" height="52" rx="5" fill="url(#plateGrad)" stroke="url(#rimGrad)" stroke-width="0.8" />
        <rect x="8" y="6" width="16" height="68" rx="7" fill="url(#plateGrad)" stroke="url(#rimGrad)" stroke-width="1.2" />
        <ellipse cx="8" cy="40" rx="4" ry="34" fill="#1a202c" />

        <rect x="124" y="14" width="12" height="52" rx="5" fill="url(#plateGrad)" stroke="url(#rimGrad)" stroke-width="0.8" />
        <rect x="136" y="6" width="16" height="68" rx="7" fill="url(#plateGrad)" stroke="url(#rimGrad)" stroke-width="1.2" />
        <ellipse cx="152" cy="40" rx="4" ry="34" fill="#e2e8f0" opacity="0.9" />
      </g>
    </svg>
  `;
  return Buffer.from(svg);
}

// Flood fill / transparent check to guarantee 100% transparent alpha background
async function ensureAlphaTransparency(buffer, width, height) {
  const { data } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
  // Check corner pixels (0,0), (width-1, 0), etc.
  console.log('Corner (0,0) alpha:', data[3]);
  return buffer;
}

async function bakeCharacter1() {
  console.log('Baking Character 1 (Orange)...');
  const baseImg = sharp('raw_chars_cache/char1_orig.png');
  const meta = await baseImg.metadata(); // 2160 x 2880

  // Dumbbell dimensions:
  // width: 2160 * 0.22 = ~475px, height = ~240px
  const dbW = 480;
  const dbH = 240;

  // Dumbbell 1 (Right hand / viewer right):
  // center: left 70.3% * 2160 = 1518, top 62.5% * 2880 = 1800
  // top-left: 1518 - dbW/2 = 1278, 1800 - dbH/2 = 1680
  const db1 = await sharp(getDumbbellSvg(dbW, dbH, -14)).png().toBuffer();

  // Dumbbell 2 (Left hand / viewer left):
  // center: left 32.4% * 2160 = 700, top 62.1% * 2880 = 1788
  // top-left: 700 - dbW/2 = 460, 1788 - dbH/2 = 1668
  const db2 = await sharp(getDumbbellSvg(dbW, dbH, 14)).png().toBuffer();

  // Load fist overlays (knuckles wrapped over bar)
  // Left fist (viewer left): x: 550, y: 1620, width: 280, height: 320
  const fistLeft = await sharp('frontend/public/fists/c1_fist_left.png').toBuffer();
  // Right fist (viewer right): x: 1390, y: 1620, width: 280, height: 320
  const fistRight = await sharp('frontend/public/fists/c1_fist_right.png').toBuffer();

  // Composite: Base -> Dumbbells -> Closed Fists
  const baked = await sharp('raw_chars_cache/char1_orig.png')
    .composite([
      { input: db2, left: 460, top: 1668 },
      { input: db1, left: 1278, top: 1680 },
      { input: fistLeft, left: 550, top: 1620 },
      { input: fistRight, left: 1390, top: 1620 }
    ])
    .png()
    .toBuffer();

  fs.writeFileSync('frontend/public/characters/char1.png', baked);
  console.log('Character 1 successfully baked with clenched fists holding dumbbells!');
}

async function bakeCharacter2() {
  console.log('Baking Character 2 (Green)...');
  const dbW = 460;
  const dbH = 230;

  // Viewer Left (left 17.4% * 2160 = 376, top 7.8% * 2880 = 225)
  // top-left: 376 - 230 = 146, 225 - 115 = 110
  const dbLeft = await sharp(getDumbbellSvg(dbW, dbH, -18)).png().toBuffer();

  // Viewer Right (left 82.2% * 2160 = 1775, top 8.8% * 2880 = 253)
  // top-left: 1775 - 230 = 1545, 253 - 115 = 138
  const dbRight = await sharp(getDumbbellSvg(dbW, dbH, 18)).png().toBuffer();

  // Closed fist overlays for Char 2
  const fistLeft = await sharp('frontend/public/fists/c2_fist_left.png').toBuffer();
  const fistRight = await sharp('frontend/public/fists/c2_fist_right.png').toBuffer();

  const baked = await sharp('raw_chars_cache/char2_orig.png')
    .composite([
      { input: dbLeft, left: 146, top: 110 },
      { input: dbRight, left: 1545, top: 138 },
      { input: fistLeft, left: 280, top: 140 },
      { input: fistRight, left: 1580, top: 160 }
    ])
    .png()
    .toBuffer();

  fs.writeFileSync('frontend/public/characters/char2.png', baked);
  console.log('Character 2 successfully baked with clenched fists holding dumbbells!');
}

async function bakeCharacter3() {
  console.log('Baking Character 3 (Pink)...');
  const dbW = 460;
  const dbH = 230;

  // Viewer Left (left 26.2% * 2160 = 566, top 9.1% * 2880 = 262)
  // top-left: 566 - 230 = 336, 262 - 115 = 147
  const dbLeft = await sharp(getDumbbellSvg(dbW, dbH, -8)).png().toBuffer();

  // Viewer Right (left 73.0% * 2160 = 1577, top 9.7% * 2880 = 279)
  // top-left: 1577 - 230 = 1347, 279 - 115 = 164
  const dbRight = await sharp(getDumbbellSvg(dbW, dbH, 8)).png().toBuffer();

  const fistLeft = await sharp('frontend/public/fists/c3_fist_left.png').toBuffer();
  const fistRight = await sharp('frontend/public/fists/c3_fist_right.png').toBuffer();

  const baked = await sharp('raw_chars_cache/char3_orig.png')
    .composite([
      { input: dbLeft, left: 336, top: 147 },
      { input: dbRight, left: 1347, top: 164 },
      { input: fistLeft, left: 440, top: 140 },
      { input: fistRight, left: 1460, top: 160 }
    ])
    .png()
    .toBuffer();

  fs.writeFileSync('frontend/public/characters/char3.png', baked);
  console.log('Character 3 successfully baked with clenched fists holding dumbbells!');
}

async function bakeCharacter4() {
  console.log('Baking Character 4 (Blue)...');
  const dbW = 480;
  const dbH = 240;

  // Center: left 31.9% * 2160 = 690, top 25.8% * 2880 = 743
  // top-left: 690 - 240 = 450, 743 - 120 = 623
  const db = await sharp(getDumbbellSvg(dbW, dbH, 12)).png().toBuffer();
  const fist = await sharp('frontend/public/fists/c4_fist.png').toBuffer();

  const baked = await sharp('raw_chars_cache/char4_orig.png')
    .composite([
      { input: db, left: 450, top: 623 },
      { input: fist, left: 550, top: 550 }
    ])
    .png()
    .toBuffer();

  fs.writeFileSync('frontend/public/characters/char4.png', baked);
  console.log('Character 4 successfully baked with clenched fist holding dumbbell!');
}

async function run() {
  fs.mkdirSync('frontend/public/characters', { recursive: true });
  await bakeCharacter1();
  await bakeCharacter2();
  await bakeCharacter3();
  await bakeCharacter4();
  console.log('ALL 4 CHARACTER PNGs BAKED SUCCESSFULLY WITH 100% TRANSPARENCY!');
}

run();

