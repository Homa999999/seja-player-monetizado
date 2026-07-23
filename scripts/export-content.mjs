import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import seedData from '../server/src/seed-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const contentFile = path.join(root, 'content.json');
const dataFile = path.join(root, 'data/site-content.json');
const outFile = path.join(root, 'content.json');

let content = seedData;

if (fs.existsSync(contentFile)) {
  content = JSON.parse(fs.readFileSync(contentFile, 'utf8'));
} else if (fs.existsSync(dataFile)) {
  content = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

fs.writeFileSync(outFile, `${JSON.stringify(content, null, 2)}\n`);
console.log(`Exported ${outFile}`);
