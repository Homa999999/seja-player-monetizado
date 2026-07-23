/**
 * Gera gas/Admin.html com o painel React (CMS visual) em arquivo único.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const distIndex = path.join(root, 'admin/dist/index.html');
const gasAdmin = path.join(root, 'gas/Admin.html');

console.log('Building admin CMS for Google Apps Script...');

execSync('npm run build --prefix admin', {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, GAS_BUILD: '1', ADMIN_BASE: './' }
});

if (!fs.existsSync(distIndex)) {
  throw new Error('Build do admin não gerou admin/dist/index.html');
}

let html = fs.readFileSync(distIndex, 'utf8');
if (!html.includes('<base target="_top">')) {
  html = html.replace('<head>', '<head>\n  <base target="_top">');
}

fs.writeFileSync(gasAdmin, html);
console.log(`CMS visual copiado para ${gasAdmin}`);
