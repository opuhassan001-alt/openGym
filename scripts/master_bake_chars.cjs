const sharp = require('e:/work station/gym app/frontend/node_modules/sharp');
const fs = require('fs');

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

// BAKE CHARACTER 1 (Orange Hoodie)
// Hands slightly separated from pants, closed tight fists holding heavy dumbbells
async function bakeChar1() {
  console.log('Generating Char 1 with tight closed fists holding dumbbells...');
  const dbW = 480, dbH = 240;
  const dbLeft = await sharp(getDumbbellSvg(dbW, dbH, 14)).png().toBuffer();
  const dbRight = await sharp(getDumbbellSvg(dbW, dbH, -14)).png().toBuffer();

  const fistLeft = await sharp('frontend/public/fists/c1_fist_left.png').toBuffer();
  const fistRight = await sharp('frontend/public/fists/c1_fist_right.png').toBuffer();

  // Composite dumbbell behind fists
  const baked = await sharp('raw_chars_cache/char1_orig.png')
    .composite([
      { input: dbLeft, left: 460, top: 1668 },
      { input: dbRight, left: 1278, top: 1680 },
      { input: fistLeft, left: 550, top: 1620 },
      { input: fistRight, left: 1390, top: 1620 }
    ])
    .png()
    .toBuffer();

  fs.writeFileSync('frontend/public/characters/char1.png', baked);
  console.log('Saved frontend/public/characters/char1.png');
}

// BAKE CHARACTER 2 (Green Beanie Girl)
// V-fingers closed into clenched tight fists wrapped around dumbbells
async function bakeChar2() {
  console.log('Generating Char 2 with closed fists (no V-sign) holding dumbbells...');
  const dbW = 460, dbH = 230;
  const dbLeft = await sharp(getDumbbellSvg(dbW, dbH, -18)).png().toBuffer();
  const dbRight = await sharp(getDumbbellSvg(dbW, dbH, 18)).png().toBuffer();

  // Resize tight closed fists to match Char 2's hand size (around 240x160)
  const tightLeft = await sharp('frontend/public/fists/tight_fist_left.png')
    .resize(230, 160)
    .toBuffer();
  const tightRight = await sharp('frontend/public/fists/tight_fist_right.png')
    .resize(230, 160)
    .toBuffer();

  // Use char2_nofingers base where V-fingers were erased, place dumbbells, then place closed fists directly over wrists!
  const baked = await sharp('raw_chars_cache/char2_nofingers.png')
    .composite([
      // Dumbbells first (behind closed fists)
      { input: dbLeft, left: 146, top: 110 },
      { input: dbRight, left: 1545, top: 138 },
      // Clenched closed fists covering wrist joint and wrapping over the dumbbell handle!
      { input: tightLeft, left: 260, top: 145 },
      { input: tightRight, left: 1660, top: 170 }
    ])
    .png()
    .toBuffer();

  fs.writeFileSync('frontend/public/characters/char2.png', baked);
  console.log('Saved frontend/public/characters/char2.png');
}

// BAKE CHARACTER 3 (Pink Fuzzy Hoodie Boy)
// Dumbbells passed directly through closed fists
async function bakeChar3() {
  console.log('Generating Char 3 with closed fists holding dumbbells...');
  const dbW = 460, dbH = 230;
  const dbLeft = await sharp(getDumbbellSvg(dbW, dbH, -8)).png().toBuffer();
  const dbRight = await sharp(getDumbbellSvg(dbW, dbH, 8)).png().toBuffer();

  const fistLeft = await sharp('frontend/public/fists/tight_fist_left.png')
    .resize(230, 160)
    .toBuffer();
  const fistRight = await sharp('frontend/public/fists/tight_fist_right.png')
    .resize(230, 160)
    .toBuffer();

  const baked = await sharp('raw_chars_cache/char3_orig.png')
    .composite([
      // Dumbbells behind the fists
      { input: dbLeft, left: 336, top: 147 },
      { input: dbRight, left: 1347, top: 164 },
      // Closed fists wrapping firmly over the handle bar
      { input: fistLeft, left: 450, top: 40 },
      { input: fistRight, left: 1475, top: 50 }
    ])
    .png()
    .toBuffer();

  fs.writeFileSync('frontend/public/characters/char3.png', baked);
  console.log('Saved frontend/public/characters/char3.png');
}

// BAKE CHARACTER 4 (Blue FOCUS Boy)
// Hand in pocket left untouched. Extended pointing hand closed into tight fist holding 1 dumbbell!
async function bakeChar4() {
  console.log('Generating Char 4 with pointing hand closed into tight fist holding 1 dumbbell...');
  const dbW = 480, dbH = 240;
  const db = await sharp(getDumbbellSvg(dbW, dbH, 12)).png().toBuffer();

  // Erase thumb and index finger completely from raw_chars_cache/char4_orig.png
  const { data, info } = await sharp('raw_chars_cache/char4_orig.png').raw().toBuffer({ resolveWithObject: true });
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * 4;
      // erase index finger and thumb: x: 450..770, y: 410..790
      if (x >= 450 && x <= 770 && y >= 410 && y <= 790) {
        data[idx+3] = 0;
      }
    }
  }
  const cleanBase = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();

  // Tight closed fist for right hand
  const closedFist = await sharp('frontend/public/fists/tight_fist_left.png')
    .resize(250, 175)
    .toBuffer();

  const baked = await sharp(cleanBase)
    .composite([
      // 1. Dumbbell
      { input: db, left: 450, top: 623 },
      // 2. Closed clenched fist wrapping over the handle bar
      { input: closedFist, left: 565, top: 650 }
    ])
    .png()
    .toBuffer();

  fs.writeFileSync('frontend/public/characters/char4.png', baked);
  console.log('Saved frontend/public/characters/char4.png');
}

async function run() {
  await bakeChar1();
  await bakeChar2();
  await bakeChar3();
  await bakeChar4();
  console.log('ALL 4 CHARACTERS MASTERFULLY BAKED WITH CLOSED FISTS & 100% TRANSPARENCY!');
}
run();
