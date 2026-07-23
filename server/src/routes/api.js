import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { getContent, saveContent, getHistory, getStats, addHistory } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '../../../uploads');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg|mp4|webm/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase()) || allowed.test(file.mimetype);
    cb(ok ? null : new Error('Tipo de arquivo não permitido'), ok);
  }
});

const router = Router();

router.get('/content', async (_req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const content = await getContent();
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao carregar conteúdo' });
  }
});

router.get('/stats', authMiddleware, async (_req, res) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar estatísticas' });
  }
});

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const history = await getHistory(Number(req.query.limit) || 30);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar histórico' });
  }
});

router.put('/content', authMiddleware, async (req, res) => {
  try {
    const { data, section, summary } = req.body;
    if (!data) return res.status(400).json({ error: 'Dados inválidos' });

    const result = await saveContent(data, {
      section: section || 'geral',
      action: 'update',
      summary: summary || `Conteúdo atualizado: ${section || 'geral'}`
    });

    res.json({ ok: true, updatedAt: result.updatedAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar conteúdo' });
  }
});

router.patch('/content/:section', authMiddleware, async (req, res) => {
  try {
    const { section } = req.params;
    const patch = req.body;
    const content = await getContent();

    if (!content[section]) content[section] = {};
    content[section] = { ...content[section], ...patch };

    const result = await saveContent(content, {
      section,
      summary: req.body._summary || `Seção "${section}" atualizada`
    });

    res.json({ ok: true, updatedAt: result.updatedAt, data: content[section] });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar seção' });
  }
});

router.post('/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

export default router;
