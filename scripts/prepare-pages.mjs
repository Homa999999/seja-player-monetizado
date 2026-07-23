import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { readAssetVersion, stampHtmlString } from './asset-version.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'pages-dist');

const rootFiles = [
  'index.html',
  'contato.html',
  'politica-privacidade.html',
  'termos-de-uso.html',
  'content.json',
  'robots.txt',
  'sitemap.xml'
];

const rootDirs = ['css', 'js', 'assets'];

const skipCopyPatterns = [
  /^css\/(main|animations|legal|fonts|critical)\.css$/,
  /^js\/(config|analytics|main|cms)\.js$/,
  /^js\/(config|analytics|main)\.min\.js$/
];

function rmrf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function shouldSkipCopy(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');
  return skipCopyPatterns.some((pattern) => pattern.test(normalized));
}

function copyRecursive(src, dest, relativePath = '') {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      const nextRelative = relativePath ? `${relativePath}/${entry}` : entry;
      copyRecursive(path.join(src, entry), path.join(dest, entry), nextRelative);
    }
    return;
  }
  if (shouldSkipCopy(relativePath)) return;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

rmrf(outDir);
fs.mkdirSync(outDir, { recursive: true });

for (const file of rootFiles) {
  const src = path.join(root, file);
  if (!fs.existsSync(src)) continue;
  if (file.endsWith('.html')) {
    const version = readAssetVersion();
    let html = fs.readFileSync(src, 'utf8');
    if (version) html = stampHtmlString(html, version);
    fs.mkdirSync(path.dirname(path.join(outDir, file)), { recursive: true });
    fs.writeFileSync(path.join(outDir, file), html);
    continue;
  }
  copyRecursive(src, path.join(outDir, file));
}

for (const dir of rootDirs) {
  const src = path.join(root, dir);
  if (fs.existsSync(src)) copyRecursive(src, path.join(outDir, dir));
}

console.log('Building admin panel for GitHub Pages...');
execSync('npm ci --prefix admin', { cwd: root, stdio: 'inherit' });
execSync('npm run build --prefix admin', {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, ADMIN_BASE: './' }
});

copyRecursive(path.join(root, 'admin/dist'), path.join(outDir, 'admin'));
fs.writeFileSync(path.join(outDir, '.nojekyll'), '');

const adminRoutes = [
  'login',
  'hero',
  'curso',
  'modulos',
  'professor',
  'depoimentos',
  'oferta',
  'botoes',
  'configuracoes',
  'historico'
];

for (const route of adminRoutes) {
  const routeDir = path.join(outDir, 'admin', route);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(
    path.join(routeDir, 'index.html'),
    `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><script>location.replace('../#/${route}')</script></head><body></body></html>`
  );
}

console.log(`Site pronto em ${outDir}`);
