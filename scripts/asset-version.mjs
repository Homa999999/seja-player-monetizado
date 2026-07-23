import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION_FILE = '.asset-version';

const TRACKED_ASSETS = [
  'css/critical.min.css',
  'css/site.min.css',
  'css/legal-pages.min.css',
  'js/config.min.js',
  'js/site.min.js',
  'js/cms.min.js'
];

const HTML_FILES = [
  'index.html',
  'contato.html',
  'politica-privacidade.html',
  'termos-de-uso.html'
];

export function computeAssetVersion() {
  const hash = crypto.createHash('sha256');
  for (const file of TRACKED_ASSETS) {
    hash.update(fs.readFileSync(path.join(root, file)));
  }
  return hash.digest('hex').slice(0, 10);
}

export function readAssetVersion() {
  const file = path.join(root, VERSION_FILE);
  if (!fs.existsSync(file)) return '';
  return fs.readFileSync(file, 'utf8').trim();
}

export function writeAssetVersion(version) {
  fs.writeFileSync(path.join(root, VERSION_FILE), `${version}\n`);
}

function patchAssetUrls(html, version) {
  let next = html.replace(/(\?v=)[a-f0-9]+/g, `$1${version}`);
  next = next.replace(/(href="(?:css\/[^"?]+\.min\.css))(?!\?v=)/g, `$1?v=${version}`);
  next = next.replace(/(src="(?:js\/[^"?]+\.min\.js))(?!\?v=)/g, `$1?v=${version}`);
  return next;
}

function upsertAssetVersionMeta(html, version) {
  const meta = `<meta name="pm-asset-version" content="${version}">`;
  if (html.includes('name="pm-asset-version"')) {
    return html.replace(/<meta name="pm-asset-version" content="[^"]*">/, meta);
  }
  return html.replace('</head>', `  ${meta}\n</head>`);
}

export function stampHtmlFiles(version) {
  for (const file of HTML_FILES) {
    const target = path.join(root, file);
    if (!fs.existsSync(target)) continue;
    const html = fs.readFileSync(target, 'utf8');
    const next = upsertAssetVersionMeta(patchAssetUrls(html, version), version);
    fs.writeFileSync(target, next);
  }
}

export function stampHtmlString(html, version) {
  return upsertAssetVersionMeta(patchAssetUrls(html, version), version);
}

export function applyAssetVersion() {
  const version = computeAssetVersion();
  writeAssetVersion(version);
  stampHtmlFiles(version);
  console.log(`  asset version — v=${version}`);
  return version;
}
