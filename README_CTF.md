# CyberQuest CTF Platform

Локальная платформа для проведения Capture The Flag соревнования с 5 задачами.

## Запуск платформы

### 1. Запуск backend сервера

```bash
npm run server
```

Сервер запустится на `http://localhost:3001`

### 2. Запуск frontend (в отдельном терминале)

Frontend запускается автоматически в режиме разработки.

## Доступ к админ-панели

- URL: нажмите "Админ" в навигации
- Логин: `admin`
- Пароль: `cyber2025`

## Задания

### 1. Hidden Pixels (Easy, Forensics)
- Файл: `beach.png`
- Флаг спрятан в LSB синего канала
- Флаг: `FLAG{png_lsb_is_fun}`

### 2. Bakery SQL (Medium, Web)
- Файлы: `app.py`, `bakery.db`, `run_bakery.sh`
- SQL-инъекция через параметр `q`
- Флаг: `FLAG{sql_in_my_cake}`

### 3. Small RSA (Medium, Crypto)
- Файлы: `rsa.txt`, `rsa_decrypt.py`
- Факторизация малого модуля RSA
- Флаг: `FLAG{rsa_small_key}`

### 4. HeapBoss (Hard, Pwn)
- Файлы: `heapboss`, `heapboss.c`
- Heap overflow для перезаписи указателя функции
- Флаг: `FLAG{heap_master}`

### 5. ObfusVM (Hard, Reverse)
- Файлы: `obfusvm`, `program.bin`
- Реверс мини-VM и расшифровка вывода
- Флаг: `FLAG{vm_deobfuscated}`

## Возможности платформы

- Просмотр заданий с описанием и подсказками
- Скачивание материалов для каждого задания
- Отправка флагов и проверка решений
- Админ-панель для просмотра всех решений
- Анимированный интерфейс с тёмной темой
- Адаптивный дизайн для мобильных устройств

## Технологии

- Frontend: React + TypeScript + TailwindCSS + Framer Motion
- Backend: Node.js + Express
- Database: Supabase (PostgreSQL)
- Аутентификация: JWT

## Структура файлов

```
project/
├── src/
│   ├── components/      # React компоненты
│   ├── pages/          # Страницы приложения
│   ├── lib/            # Утилиты и API
│   └── App.tsx         # Главный компонент
├── public/tasks/       # Файлы заданий CTF
├── server.js           # Backend API
└── README_CTF.md       # Документация
```
