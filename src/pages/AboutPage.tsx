import { motion } from 'framer-motion';
import { Search, Globe, Lock, Cog, Brain } from 'lucide-react';

export default function AboutPage() {
  const categories = [
    {
      icon: <Search className="w-12 h-12" />,
      name: 'Forensics',
      description: 'Файлдарды талдау, стеганография, деректерді қалпына келтіру',
      color: 'text-cyan-400'
    },
    {
      icon: <Globe className="w-12 h-12" />,
      name: 'Web',
      description: 'SQL инъекциялары, XSS, веб-әлсіздіктерді пайдалану',
      color: 'text-green-400'
    },
    {
      icon: <Lock className="w-12 h-12" />,
      name: 'Crypto',
      description: 'Криптография, шифрлау, әлсіз кілттерді бұзу',
      color: 'text-purple-400'
    },
    {
      icon: <Cog className="w-12 h-12" />,
      name: 'Pwn',
      description: 'Бинарлық файлдарды пайдалану, буфер толып кетуі',
      color: 'text-red-400'
    },
    {
      icon: <Brain className="w-12 h-12" />,
      name: 'Reverse',
      description: 'Кері инженерия, дизассемблирлеу, обфускация',
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Тапсырмалар туралы
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            CyberQuest CTF киберқауіпсіздіктің әртүрлі санаттарынан әртүрлі қиындық деңгейіндегі 5 тапсырманы қамтиды.
            Әрбір тапсырмада табу және жіберу қажет жасырын флаг бар.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-[#1a1f3a] to-[#0f1423] rounded-lg border border-cyan-500/30 p-6"
            >
              <div className={`mb-4 ${category.color}`}>
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
              <p className="text-gray-400 text-sm">{category.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-br from-[#1a1f3a] to-[#0f1423] rounded-lg border border-cyan-500/30 p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Ережелер</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>Барлық флагтардың форматы <code className="bg-[#0a0f1c] px-2 py-1 rounded text-cyan-400">FLAG{'{...}'}</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>Тапсырмаларды шешу үшін берілген материалдарды пайдаланыңыз</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>Платформа инфрақұрылымына шабуыл жасамаңыз</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>Тапсырмалардың қиындығы: Easy (100 ұпай), Medium (200 ұпай), Hard (300 ұпай)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>Қиындықтар кездескенде кеңестерді пайдаланыңыз</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
