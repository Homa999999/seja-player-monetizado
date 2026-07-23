import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import CleanCSS from 'clean-css';
import { minify as terserMinify } from 'terser';
import { applyAssetVersion } from './asset-version.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const FONT_FILES = [
  ['@fontsource/inter/files/inter-latin-400-normal.woff2', 'inter-latin-400-normal.woff2'],
  ['@fontsource/inter/files/inter-latin-500-normal.woff2', 'inter-latin-500-normal.woff2'],
  ['@fontsource/inter/files/inter-latin-600-normal.woff2', 'inter-latin-600-normal.woff2'],
  ['@fontsource/inter/files/inter-latin-700-normal.woff2', 'inter-latin-700-normal.woff2'],
  ['@fontsource/sora/files/sora-latin-600-normal.woff2', 'sora-latin-600-normal.woff2'],
  ['@fontsource/sora/files/sora-latin-700-normal.woff2', 'sora-latin-700-normal.woff2'],
  ['@fontsource/sora/files/sora-latin-800-normal.woff2', 'sora-latin-800-normal.woff2']
];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function write(file, content) {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  return content.length;
}

function minifyCss(inputs, output) {
  const source = inputs.map(read).join('\n');
  const result = new CleanCSS({ level: 2 }).minify(source);
  if (result.errors.length) {
    throw new Error(result.errors.join('\n'));
  }
  const bytes = write(output, result.styles);
  const saved = Math.max(0, Math.round((1 - bytes / source.length) * 100));
  console.log(`  ${output} — ${(bytes / 1024).toFixed(1)} KB (${saved}% menor)`);
}

async function minifyJsSource(source, output) {
  const result = await terserMinify(source, {
    compress: { passes: 2 },
    mangle: false,
    format: { comments: false }
  });
  if (result.error) throw result.error;
  const bytes = write(output, result.code);
  console.log(`  ${output} — ${(bytes / 1024).toFixed(1)} KB`);
}

function copyFonts() {
  const fontsDir = path.join(root, 'assets/fonts');
  fs.mkdirSync(fontsDir, { recursive: true });

  FONT_FILES.forEach(([from, to]) => {
    const src = path.join(root, 'node_modules', from);
    const dest = path.join(fontsDir, to);
    if (!fs.existsSync(src)) {
      throw new Error(`Fonte não encontrada: ${from}. Rode npm install.`);
    }
    fs.copyFileSync(src, dest);
  });

  console.log(`  assets/fonts — ${FONT_FILES.length} arquivos woff2`);
}

console.log('Minificando assets...');

copyFonts();

minifyCss(['css/critical.css'], 'css/critical.min.css');
minifyCss(['css/fonts.css', 'css/main.css', 'css/animations.css'], 'css/site.min.css');
minifyCss(['css/fonts.css', 'css/main.css', 'css/legal.css'], 'css/legal-pages.min.css');

await minifyJsSource(read('js/config.js'), 'js/config.min.js');

const siteBundle = ['analytics', 'main']
  .map((file) => read(`js/${file}.js`))
  .join('\n;\n');

await minifyJsSource(siteBundle, 'js/site.min.js');
await minifyJsSource(read('js/cms.js'), 'js/cms.min.js');

applyAssetVersion();

console.log('Assets minificados.');
