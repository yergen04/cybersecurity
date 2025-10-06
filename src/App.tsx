import { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      <main>{renderPage()}</main>
      <footer className="bg-[#0a0f1c] border-t border-cyan-500/20 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          © 2025 CyberQuest CTF | Оқу және қызық үшін жасалған
        </div>
      </footer>
    </div>
  );
}

export default App;
