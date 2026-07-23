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
const buildStamp = new Date().toISOString();
const buildBanner = `<!--
  PM-ADMIN-BUILD: ${buildStamp}
  Copie ESTE arquivo inteiro para o GAS (arquivo Admin).
  Depois: Implantar > Gerenciar implantacoes > Nova versao > Implantar.
-->`;
if (!html.includes('PM-ADMIN-BUILD:')) {
  html = html.replace('<!DOCTYPE html>', `<!DOCTYPE html>\n${buildBanner}`);
}
if (!html.includes('<base target="_top">')) {
  html = html.replace('<head>', '<head>\n  <base target="_top">');
}
html = html.replace(
  /content="width=device-width, initial-scale=1\.0(?:, viewport-fit=cover)?"/,
  'content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"'
);
if (!html.includes('viewport-fit=cover')) {
  html = html.replace(
    'name="viewport"',
    'name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"'
  );
}
const viewportFixScript = `<script>
(function(){var sw=window.screen&&window.screen.width,iw=window.innerWidth;if(sw&&iw>sw+40){var m=document.querySelector('meta[name="viewport"]');if(m)m.setAttribute('content','width='+sw+', initial-scale=1, maximum-scale=5, viewport-fit=cover');}})();
</script>`;
if (!html.includes('iw>sw+40')) {
  html = html.replace(
    /(<meta name="viewport"[^>]*>)/i,
    `$1\n  ${viewportFixScript}`
  );
}

fs.writeFileSync(gasAdmin, html);
console.log(`CMS visual copiado para ${gasAdmin}`);
