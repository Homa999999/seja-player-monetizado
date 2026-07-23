import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import seedData from './seed-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const JSON_FILE = path.join(DATA_DIR, 'site-content.json');
const STATIC_CONTENT_FILE = path.join(__dirname, '../../content.json');

const { Pool } = pg;
let pool = null;

function usePostgres() {
  return Boolean(process.env.DATABASE_URL);
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJsonStore() {
  ensureDataDir();
  if (!fs.existsSync(JSON_FILE)) {
    fs.writeFileSync(JSON_FILE, JSON.stringify(seedData, null, 2));
    return structuredClone(seedData);
  }
  return JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
}

function writeJsonStore(data) {
  ensureDataDir();
  fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));
  exportStaticContent(data);
}

export function exportStaticContent(data) {
  fs.writeFileSync(STATIC_CONTENT_FILE, `${JSON.stringify(data, null, 2)}\n`);
}

function readHistoryJson() {
  const file = path.join(DATA_DIR, 'change-history.json');
  ensureDataDir();
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeHistoryJson(entries) {
  const file = path.join(DATA_DIR, 'change-history.json');
  ensureDataDir();
  fs.writeFileSync(file, JSON.stringify(entries.slice(0, 100), null, 2));
}

export async function initDb() {
  if (!usePostgres()) {
    const content = readJsonStore();
    exportStaticContent(content);
    return { mode: 'json' };
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
  });

  const schema = fs.readFileSync(path.join(__dirname, '../sql/schema.sql'), 'utf8');
  await pool.query(schema);
  const content = await getContent();
  exportStaticContent(content);
  return { mode: 'postgres' };
}

export async function getContent() {
  if (!usePostgres()) return readJsonStore();

  const { rows } = await pool.query('SELECT data FROM site_content WHERE id = 1');
  if (!rows.length) {
    await pool.query('INSERT INTO site_content (id, data) VALUES (1, $1)', [seedData]);
    return structuredClone(seedData);
  }
  return rows[0].data;
}

export async function saveContent(data, meta = {}) {
  const now = new Date().toISOString();

  if (!usePostgres()) {
    writeJsonStore(data);
    if (meta.section) await addHistory(meta.section, meta.action || 'update', meta.summary);
    return { updatedAt: now };
  }

  await pool.query(
    'INSERT INTO site_content (id, data, updated_at) VALUES (1, $1, NOW()) ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = NOW()',
    [data]
  );

  exportStaticContent(data);

  if (meta.section) await addHistory(meta.section, meta.action || 'update', meta.summary);
  const { rows } = await pool.query('SELECT updated_at FROM site_content WHERE id = 1');
  return { updatedAt: rows[0]?.updated_at || now };
}

export async function addHistory(section, action, summary) {
  const entry = {
    id: crypto.randomUUID(),
    section,
    action,
    summary: summary || `Alteração em ${section}`,
    createdAt: new Date().toISOString()
  };

  if (!usePostgres()) {
    const history = readHistoryJson();
    history.unshift(entry);
    writeHistoryJson(history);
    return entry;
  }

  const { rows } = await pool.query(
    'INSERT INTO change_history (section, action, summary) VALUES ($1, $2, $3) RETURNING id, section, action, summary, created_at',
    [section, action, summary]
  );
  return {
    id: String(rows[0].id),
    section: rows[0].section,
    action: rows[0].action,
    summary: rows[0].summary,
    createdAt: rows[0].created_at
  };
}

export async function getHistory(limit = 20) {
  if (!usePostgres()) {
    return readHistoryJson().slice(0, limit);
  }

  const { rows } = await pool.query(
    'SELECT id, section, action, summary, created_at FROM change_history ORDER BY created_at DESC LIMIT $1',
    [limit]
  );
  return rows.map(r => ({
    id: String(r.id),
    section: r.section,
    action: r.action,
    summary: r.summary,
    createdAt: r.created_at
  }));
}

export async function getStats() {
  const content = await getContent();
  const history = await getHistory(1);
  const sections = ['hero', 'course', 'modules', 'instructor', 'testimonials', 'offer', 'buttons', 'general'];

  let updatedAt = history[0]?.createdAt || new Date().toISOString();
  if (usePostgres()) {
    const { rows } = await pool.query('SELECT updated_at FROM site_content WHERE id = 1');
    if (rows[0]) updatedAt = rows[0].updated_at;
  } else if (fs.existsSync(JSON_FILE)) {
    updatedAt = fs.statSync(JSON_FILE).mtime.toISOString();
  }

  return {
    lastUpdate: updatedAt,
    editableSections: sections.length,
    siteOnline: content.general?.siteOnline !== false,
    testimonialCount: content.testimonials?.items?.length || 0,
    moduleCount: content.modules?.items?.length || 0
  };
}

export function getDbMode() {
  return usePostgres() ? 'postgres' : 'json';
}
