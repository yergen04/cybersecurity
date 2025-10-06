import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Info, Send, CheckCircle } from 'lucide-react';
import { Task, api } from '../lib/api';

interface TaskCardProps {
  task: Task;
  index: number;
}

export default function TaskCard({ task, index }: TaskCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [flag, setFlag] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [solved, setSolved] = useState(() => {
    const solved = localStorage.getItem(`solved_${task.id}`);
    return solved === 'true';
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim()) return;

    setSubmitting(true);
    setResult(null);

    try {
      const response = await api.submitFlag(task.id, flag);

      if (response.correct) {
        setResult({ success: true, message: 'Флаг қабылданды!' });
        setSolved(true);
        localStorage.setItem(`solved_${task.id}`, 'true');
        setTimeout(() => {
          setShowModal(false);
          setFlag('');
          setResult(null);
        }, 2000);
      } else {
        setResult({ success: false, message: 'Қате флаг. Қайталап көріңіз.' });
      }
    } catch (error) {
      setResult({ success: false, message: 'Жіберу қатесі. Серверге қосылымды тексеріңіз.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = () => {
    window.open(api.getDownloadUrl(task.id), '_blank');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-gradient-to-br from-[#1a1f3a] to-[#0f1423] rounded-lg border border-cyan-500/30 p-6 hover:border-cyan-400/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20 relative overflow-hidden"
      >
        {solved && (
          <div className="absolute top-4 right-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
        )}

        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl">{task.icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">{task.title}</h3>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(task.difficulty)}`}>
                {task.difficulty.toUpperCase()}
              </span>
              <span className="text-xs text-gray-400">{task.category}</span>
              <span className="text-xs text-cyan-400">{task.points} pts</span>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{task.description}</p>

        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors text-sm"
          >
            <Info className="w-4 h-4" />
            Толығырақ
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Материалдар
          </button>
        </div>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1a1f3a] rounded-lg border border-cyan-500/30 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="text-5xl">{task.icon}</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{task.title}</h2>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(task.difficulty)}`}>
                    {task.difficulty.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">{task.category}</span>
                  <span className="text-xs text-cyan-400">{task.points} pts</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Сипаттама</h3>
              <p className="text-gray-300 text-sm whitespace-pre-wrap">{task.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Кеңес</h3>
              <p className="text-yellow-300 text-sm bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
                {task.hint}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Файлдар</h3>
              <div className="flex flex-wrap gap-2">
                {task.files.map((file, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded">
                    {file}
                  </span>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Флагты енгізіңіз
                </label>
                <input
                  type="text"
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  placeholder="FLAG{...}"
                  className="w-full px-4 py-2 bg-[#0a0f1c] border border-cyan-500/30 rounded text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                  disabled={submitting || solved}
                />
              </div>

              {result && (
                <div className={`text-sm p-3 rounded border ${
                  result.success
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {result.message}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting || solved}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Жіберуде...' : solved ? 'Шешілді' : 'Жіберу'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Жабу
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}
