import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TaskCard from '../components/TaskCard';
import { Task, api } from '../lib/api';

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Тапсырмаларды жүктеуде...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Тапсырмалар
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Барлық тапсырмаларды шешіңіз, флагтарды табыңыз және киберқауіпсіздік бойынша өз біліміңізді дәлелдеңіз.
            Әрбір тапсырманың қиындық деңгейі және ұпай құны бар.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
