import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Trash2, User, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { api, Submission } from '../lib/api';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      loadSubmissions(savedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login(login, password);

      if (response.success && response.token) {
        setIsAuthenticated(true);
        setToken(response.token);
        localStorage.setItem('admin_token', response.token);
        loadSubmissions(response.token);
      } else {
        setError(response.error || 'Неверные учетные данные');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async (authToken: string) => {
    try {
      const data = await api.getSubmissions(authToken);
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    }
  };

  const handleReset = async () => {
    if (!confirm('Вы уверены, что хотите удалить все решения?')) return;

    try {
      await api.resetSubmissions(token);
      setSubmissions([]);
    } catch (err) {
      alert('Ошибка при сбросе решений');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken('');
    setLogin('');
    setPassword('');
    localStorage.removeItem('admin_token');
    setSubmissions([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1a1f3a] to-[#0f1423] rounded-lg border border-cyan-500/30 p-8 w-full max-w-md"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Вход в админ-панель</h2>
            <p className="text-gray-400 text-sm">Введите учетные данные для доступа</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Логин
              </label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full px-4 py-2 bg-[#0a0f1c] border border-cyan-500/30 rounded text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                placeholder="admin"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#0a0f1c] border border-cyan-500/30 rounded text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            Логин: admin | Пароль: cyber2025
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl font-bold text-white">Админ-панель</h2>
            <div className="flex gap-2">
              <button
                onClick={() => loadSubmissions(token)}
                className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors"
              >
                Обновить
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Сбросить всё
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
          <p className="text-gray-400">
            Всего решений: {submissions.length} | Правильных: {submissions.filter(s => s.is_correct).length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-[#1a1f3a] to-[#0f1423] rounded-lg border border-cyan-500/30 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0a0f1c] border-b border-cyan-500/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                    Задание
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                    Флаг
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider">
                    Время
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/10">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      Пока нет решений
                    </td>
                  </tr>
                ) : (
                  submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-cyan-500/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-white text-sm">{submission.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-white text-sm">
                          {submission.tasks?.title || `Task #${submission.task_id}`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs text-gray-300 bg-[#0a0f1c] px-2 py-1 rounded">
                          {submission.submitted_flag}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.is_correct ? (
                          <span className="flex items-center gap-1 text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Верный
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-400 text-sm">
                            <XCircle className="w-4 h-4" />
                            Неверный
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <Calendar className="w-4 h-4" />
                          {new Date(submission.submitted_at).toLocaleString('ru-RU')}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
