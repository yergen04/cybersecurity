import { Shield } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  return (
    <nav className="bg-[#0a0f1c] border-b border-cyan-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <Shield className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">CyberQuest CTF</h1>
              <p className="text-sm text-cyan-400">5 тапсырма, 1 мақсат: флагты ұстаңыз!</p>
            </div>
          </div>

          <div className="flex gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'home' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Басты бет
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'about' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Тапсырмалар туралы
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'admin' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Әкімші
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
