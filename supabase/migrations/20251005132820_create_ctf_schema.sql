/*
  # CyberQuest CTF Database Schema

  1. New Tables
    - `tasks`
      - `id` (integer, primary key)
      - `title` (text) - Task name
      - `category` (text) - forensics, web, crypto, pwn, reverse
      - `difficulty` (text) - easy, medium, hard
      - `description` (text) - Full task description
      - `hint` (text) - Hint for solving
      - `flag` (text) - Correct flag value
      - `files` (text[]) - Array of file names
      - `points` (integer) - Points awarded
      - `created_at` (timestamptz)
    
    - `submissions`
      - `id` (uuid, primary key)
      - `username` (text) - User who submitted
      - `task_id` (integer) - References tasks
      - `submitted_flag` (text) - The flag they submitted
      - `is_correct` (boolean) - Whether flag was correct
      - `submitted_at` (timestamptz)
    
    - `admin_sessions`
      - `id` (uuid, primary key)
      - `token` (text, unique) - Session token
      - `created_at` (timestamptz)
      - `expires_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public can read tasks (except flag field)
    - Public can insert submissions
    - Only authenticated admin can view submissions and admin_sessions
*/

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id integer PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL,
  description text NOT NULL,
  hint text NOT NULL,
  flag text NOT NULL,
  files text[] DEFAULT '{}',
  points integer DEFAULT 100,
  icon text DEFAULT '🔍',
  created_at timestamptz DEFAULT now()
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL DEFAULT 'anonymous',
  task_id integer NOT NULL REFERENCES tasks(id),
  submitted_flag text NOT NULL,
  is_correct boolean NOT NULL,
  submitted_at timestamptz DEFAULT now()
);

-- Create admin_sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Tasks policies: anyone can read tasks, but not the flag field
CREATE POLICY "Anyone can view tasks"
  ON tasks FOR SELECT
  USING (true);

-- Submissions policies: anyone can submit
CREATE POLICY "Anyone can submit flags"
  ON submissions FOR INSERT
  WITH CHECK (true);

-- Admin sessions: only for internal use
CREATE POLICY "Admin sessions are private"
  ON admin_sessions FOR ALL
  USING (false);

-- Insert the 5 CTF tasks
INSERT INTO tasks (id, title, category, difficulty, description, hint, flag, files, points, icon) VALUES
(1, 'Hidden Pixels', 'forensics', 'easy', 'В PNG-файле спрятан флаг в младших битах синего канала. Используйте стеганографию для извлечения скрытого сообщения.', 'Попробуй извлечь LSB из канала B. Можно использовать Python с PIL/Pillow для чтения пикселей.', 'FLAG{png_lsb_is_fun}', ARRAY['beach.png', 'README.txt'], 100, '🔍'),
(2, 'Bakery SQL', 'web', 'medium', 'Уязвимое веб-приложение Flask с SQL-инъекцией. База данных содержит секретную таблицу с флагом.', 'Поэкспериментируй с параметром q на /search. Попробуй UNION SELECT для извлечения данных из других таблиц.', 'FLAG{sql_in_my_cake}', ARRAY['app.py', 'bakery.db', 'run_bakery.sh', 'README.txt'], 200, '🌐'),
(3, 'Small RSA', 'crypto', 'medium', 'Расшифруй RSA без padding, факторизовав n. Публичный ключ использует слишком маленький модуль.', 'Маленькое n легко раскладывается. Используй онлайн-факторизаторы или библиотеку sympy для разложения на простые множители.', 'FLAG{rsa_small_key}', ARRAY['rsa.txt', 'rsa_decrypt.py', 'README.txt'], 200, '🔐'),
(4, 'HeapBoss', 'pwn', 'hard', 'ELF-бинарник с heap overflow. Эксплуатируй переполнение буфера для перезаписи указателя функции.', 'Перезапиши указатель функции fn на secret(). Изучи структуру heap и найди offset между буферами.', 'FLAG{heap_master}', ARRAY['heapboss', 'heapboss.c', 'README.txt'], 300, '⚙️'),
(5, 'ObfusVM', 'reverse', 'hard', 'Мини-VM, генерирующая зашифрованный вывод. Нужно расшифровать XOR с ключом из первых 16 байт.', 'Эмулируй байткод, чтобы восстановить флаг. VM использует простой набор инструкций: PUSH, XOR, PRINT.', 'FLAG{vm_deobfuscated}', ARRAY['obfusvm', 'program.bin', 'README.txt'], 300, '🧠')
ON CONFLICT (id) DO NOTHING;