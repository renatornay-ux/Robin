import React from 'react';
import { useNews } from '../context/NewsContext';
import { 
  Network, 
  GitBranch, 
  Users, 
  PenTool, 
  BookOpen, 
  Newspaper,
  Compass
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, setEditingArticleId } = useNews();

  const handleCreateNew = () => {
    setEditingArticleId(null);
    setActiveView('editor');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6]/95 backdrop-blur-md border-b border-stone-200/80">
      {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-5 Nav Links) - Zone 3 (1 Action CTA) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveView('frontpage')}
          className="group text-left text-xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="font-serif text-2xl tracking-tighter text-stone-900 group-hover:text-stone-700 transition-colors">
            ROBIN
          </span>
          <span className="text-xs font-sans tracking-widest uppercase text-stone-500 hidden sm:inline-block">
            · Periodismo en Red
          </span>
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveView('frontpage')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'frontpage'
                ? 'text-stone-950 font-semibold border-b-2 border-stone-900 pb-0.5'
                : 'hover:text-stone-900'
            }`}
          >
            <Newspaper className="w-4 h-4 text-stone-500" />
            <span>Portada</span>
          </button>

        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-stone-900 hover:bg-stone-800 rounded transition-all shadow-sm hover:shadow whitespace-nowrap shrink-0"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>+ Redactar Noticia</span>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer strip */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200/70 px-2 py-2 text-xs text-stone-600 bg-stone-50/70">
        <button
          onClick={() => setActiveView('frontpage')}
          className={`px-2 py-1 ${activeView === 'frontpage' ? 'font-bold text-stone-900' : ''}`}
        >
          Portada
        </button>
      </div>
    </header>
  );
};
