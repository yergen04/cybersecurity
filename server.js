// server.js — локальный backend без Supabase (ESM)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const JWT_SECRET = 'cyberquest-secret-2025';
const ADMIN_CREDENTIALS = { login: 'admin', password: 'cyber2025' };

// ===== Paths & storage =====
const DATA_DIR = path.join(__dirname, 'data');
const SESSIONS_FILE = path.join(DATA_DIR, 'admin_sessions.json');
const SUBMITS_FILE = path.join(DATA_DIR, 'submissions.json');
const PUBLIC_TASKS_DIR = path.join(__dirname, 'public', 'tasks');

// Ensure dirs/files exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(SESSIONS_FILE)) fs.writeFileSync(SESSIONS_FILE, JSON.stringify([]));
if (!fs.existsSync(SUBMITS_FILE)) fs.writeFileSync(SUBMITS_FILE, JSON.stringify([]));

// ===== Static files =====
app.use(cors());
app.use(express.json());
app.use('/tasks', express.static(PUBLIC_TASKS_DIR));

// ===== In-memory task registry (IDs 1..5) =====
const TASKS = [
  {
    id: 1,
    title: 'Hidden Pixels',
    category: 'Forensics / Stego',
    difficulty: 'easy',
    description: 'В PNG-файле флаг спрятан в младших битах синего канала.',
    hint: 'Считай LSB канала B и ищи ASCII: FLAG{...}',
    files: ['beach.png'],
    points: 100,
    icon: '🔍',
    flag: 'FLAG{png_lsb_is_fun}'
  },
  {
    id: 2,
    title: 'Bakery SQL',
    category: 'Web',
    difficulty: 'medium',
    description: 'Flask-приложение с SQL-инъекцией в параметре q на /search.',
    hint: "Поиграйся с LIKE и UNION: %' UNION SELECT flag,'x' FROM flags --",
    files: ['app.py', 'bakery.db', 'run_bakery.sh'],
    points: 300,
    icon: '🌐',
    flag: 'FLAG{sql_in_my_cake}'
  },
  {
    id: 3,
    title: 'Small RSA',
    category: 'Crypto',
    difficulty: 'medium',
    description: 'Расшифруй сообщение, факторизовав маленькое n (без padding).',
    hint: 'Trial division быстро разложит n.',
    files: ['rsa.txt', 'rsa_decrypt.py'],
    points: 350,
    icon: '🔐',
    flag: 'FLAG{rsa_small_key}'
  },
  {
    id: 4,
    title: 'HeapBoss',
    category: 'Pwn',
    difficulty: 'hard',
    description: 'Переполнение в edit позволяет переписать fn и вызвать secret().',
    hint: 'Перезапиши указатель функции на secret и сделай show.',
    files: ['heapboss', 'heapboss.c'],
    points: 650,
    icon: '⚙️',
    flag: 'FLAG{heap_master}'
  },
  {
    id: 5,
    title: 'ObfusVM',
    category: 'Reverse',
    difficulty: 'hard',
    description: 'Мини-VM выдаёт зашифрованные байты; XOR с ключом из первых 16 байт.',
    hint: 'Эмулируй PUSH-и ключ, затем XOR out.enc с ним.',
    files: ['obfusvm', 'program.bin'],
    points: 800,
    icon: '🧠',
    flag: 'FLAG{vm_deobfuscated}'
  }
];

// Helpers
const findTaskById = (id) => TASKS.find((t) => t.id === Number(id));
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// ===== Routes =====
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Admin login -> returns JWT (valid 24h), stores session token with expiry
app.post('/api/login', (req, res) => {
  const { login, password } = req.body || {};
  if (login === ADMIN_CREDENTIALS.login && password === ADMIN_CREDENTIALS.password) {
    const sessions = readJson(SESSIONS_FILE);

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    sessions.push({ token, expires_at: expiresAt });
    writeJson(SESSIONS_FILE, sessions);

    const jwtToken = jwt.sign({ login, token }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ success: true, token: jwtToken });
  }
  return res.status(401).json({ success: false, error: 'Invalid credentials' });
});

// Middleware: verify admin
function verifyAdmin(req, res, next) {
  const hdr = req.headers.authorization || '';
  if (!hdr.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

  const raw = hdr.slice(7);
  try {
    const decoded = jwt.verify(raw, JWT_SECRET);
    const sessions = readJson(SESSIONS_FILE);
    const now = new Date().toISOString();
    const ok = sessions.some((s) => s.token === decoded.token && s.expires_at > now);
    if (!ok) return res.status(401).json({ error: 'Invalid or expired session' });
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Submit flag
// body: { task_id: number|string, flag: string, username?: string }
app.post('/api/submit', (req, res) => {
  const { task_id, flag, username } = req.body || {};
  if (!task_id || !flag) return res.status(400).json({ error: 'Missing task_id or flag' });

  const task = findTaskById(task_id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const isCorrect = flag.trim() === task.flag.trim();

  const rows = readJson(SUBMITS_FILE);
  rows.push({
    id: `${Date.now()}_${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`,
    username: username || 'anonymous',
    task_id: Number(task_id),
    submitted_flag: flag,
    is_correct: isCorrect,
    submitted_at: new Date().toISOString()
  });
  writeJson(SUBMITS_FILE, rows);

  return res.json({ success: isCorrect, correct: isCorrect });
});

// Admin: fetch all submissions
app.get('/api/submissions', verifyAdmin, (_req, res) => {
  const rows = readJson(SUBMITS_FILE).sort((a, b) => (a.submitted_at < b.submitted_at ? 1 : -1));
  // обогащаем тайтлом задачи (как было через join в Supabase)
  const detailed = rows.map((r) => ({
    ...r,
    task: { title: findTaskById(r.task_id)?.title || String(r.task_id) }
  }));
  res.json(detailed);
});

// Admin: reset all submissions
app.delete('/api/reset', verifyAdmin, (_req, res) => {
  writeJson(SUBMITS_FILE, []);
  res.json({ success: true });
});

// Tasks list (как раньше из Supabase)
app.get('/api/tasks', (_req, res) => {
  const publicTasks = TASKS.map(({ flag, ...rest }) => rest); // флаг не отдаём
  res.json(publicTasks);
});

// Download files for a specific task
app.get('/api/download/:taskId', (req, res) => {
  const { taskId } = req.params;
  const task = findTaskById(taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  res.attachment(`task${taskId}-files.zip`);
  const archive = archiver('zip');
  archive.on('error', (err) => res.status(500).end(String(err)));
  archive.pipe(res);

  for (const fname of task.files) {
    const full = path.join(PUBLIC_TASKS_DIR, fname);
    if (fs.existsSync(full)) {
      archive.file(full, { name: fname });
    }
  }
  archive.finalize();
});

app.listen(PORT, () => {
  console.log(`CyberQuest CTF Server running on http://localhost:${PORT}`);
});
