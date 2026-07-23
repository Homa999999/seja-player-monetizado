import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initDb, getDbMode } from './db.js';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '5mb' }));

app.use('/uploads', express.static(path.join(ROOT, 'uploads')));
app.use('/assets', express.static(path.join(ROOT, 'assets')));
app.use('/css', express.static(path.join(ROOT, 'css')));
app.use('/js', express.static(path.join(ROOT, 'js')));

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

const adminDist = path.join(ROOT, 'admin/dist');
app.use('/admin', express.static(adminDist, { index: false }));
app.get(/^\/admin(\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(adminDist, 'index.html'));
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.get('/contato.html', (_req, res) => res.sendFile(path.join(ROOT, 'contato.html')));
app.get('/politica-privacidade.html', (_req, res) => res.sendFile(path.join(ROOT, 'politica-privacidade.html')));
app.get('/termos-de-uso.html', (_req, res) => res.sendFile(path.join(ROOT, 'termos-de-uso.html')));

app.get('/content.json', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.sendFile(path.join(ROOT, 'content.json'));
});

app.get('/robots.txt', (_req, res) => res.sendFile(path.join(ROOT, 'robots.txt')));
app.get('/sitemap.xml', (_req, res) => res.sendFile(path.join(ROOT, 'sitemap.xml')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: getDbMode() });
});

await initDb();

app.listen(PORT, () => {
  console.log(`\n  Player Monetizado CMS`);
  console.log(`  Site:  http://localhost:${PORT}`);
  console.log(`  Admin: http://localhost:${PORT}/admin`);
  console.log(`  DB:    ${getDbMode()}\n`);
});
