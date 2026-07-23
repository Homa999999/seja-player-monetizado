/**
 * Copia estilos base do admin React para gas/AdminStyles.html (GAS).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const adminCss = fs.readFileSync(path.join(root, 'admin/src/styles/admin.css'), 'utf8');
const base = adminCss.split('/* ── Stats & Dashboard ── */')[0];

const extra = `
/* ── GAS editor extras ── */
.gas-shell { min-height: 100vh; padding: 1.5rem; }
.gas-editor-card { max-width: 960px; margin: 0 auto; }
.gas-url-box {
  margin: 1rem 0 1.25rem;
  padding: 1rem;
  background: var(--bg);
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  font-size: .85rem;
  word-break: break-all;
  color: var(--text-muted);
}
.gas-url-box strong { color: var(--text); display: block; margin-bottom: .35rem; }
.gas-url-box code { color: var(--primary); font-size: .8rem; }
.gas-json {
  min-height: 420px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  line-height: 1.5;
  resize: vertical;
}
.gas-actions { display: flex; gap: .5rem; flex-wrap: wrap; margin-top: 1rem; }
.gas-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.gas-top p { color: var(--text-muted); font-size: .9rem; margin-top: .35rem; }
.gas-status {
  margin-top: 1rem;
  padding: .75rem 1rem;
  border-radius: var(--radius);
  font-size: .875rem;
}
.gas-status--ok {
  background: rgba(16,185,129,.12);
  border: 1px solid rgba(16,185,129,.25);
  color: #6ee7b7;
}
.gas-status--err {
  background: rgba(239,68,68,.12);
  border: 1px solid rgba(239,68,68,.25);
  color: #fca5a5;
}
.hidden { display: none !important; }
`;

fs.writeFileSync(path.join(root, 'gas/AdminStyles.html'), `${base}\n${extra}`);
console.log('gas/AdminStyles.html atualizado a partir de admin/src/styles/admin.css');
