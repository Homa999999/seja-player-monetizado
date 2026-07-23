/**
 * Embute content.json em gas/Code.gs (variável INITIAL_CONTENT_JSON).
 * Rode: npm run sync:gas
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const content = JSON.parse(fs.readFileSync(path.join(root, 'content.json'), 'utf8'));
const codePath = path.join(root, 'gas/Code.gs');

const markerStart = '// @INITIAL_CONTENT_JSON_START';
const markerEnd = '// @INITIAL_CONTENT_JSON_END';

const jsonLine = `var INITIAL_CONTENT_JSON = ${JSON.stringify(JSON.stringify(content))};`;

let code = fs.readFileSync(codePath, 'utf8');
const startIdx = code.indexOf(markerStart);
const endIdx = code.indexOf(markerEnd);

if (startIdx === -1 || endIdx === -1) {
  throw new Error('Marcadores INITIAL_CONTENT_JSON não encontrados em gas/Code.gs');
}

const before = code.slice(0, startIdx + markerStart.length);
const after = code.slice(endIdx);
const next = `${before}\n${jsonLine}\n${after}`;

fs.writeFileSync(codePath, next);
console.log('gas/Code.gs atualizado com content.json completo.');
