// @ts-check

// @ts-ignore
const sharp = require('sharp');
const fs = require('fs');

const svg = fs.readFileSync('./likan.svg');

sharp(svg)
  .resize(256)
  .toFile('likan.png', () => {});
