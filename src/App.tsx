import React from 'react';
import { NewsProvider, useNews } from './context/NewsContext';
import { Navbar } from './components/Navbar';
import { FrontpageView } from './components/FrontpageView';
import { ArticleReaderView } from './components/ArticleReaderView';
import { InteractiveGraphView } from './components/InteractiveGraphView';
import { StoryThreadsView } from './components/StoryThreadsView';
import { EntitiesIndexView } from './components/EntitiesIndexView';
import { ArticleEditorView } from './components/ArticleEditorView';
import { MethodologyGuideView } from './components/MethodologyGuideView';
const AppContent: React.FC = () => {
  const { activeView } = useNews();

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 flex flex-col justify-between selection:bg-stone-800 selection:text-white">
      {/* Navigation */}
      <div>
        <Navbar />

        {/* View Router */}
        <main className="transition-opacity duration-200">
          {activeView === 'frontpage' && <FrontpageView />}
          {activeView === 'article' && <ArticleReaderView />}
          {activeView === 'graph' && <InteractiveGraphView />}
          {activeView === 'threads' && <StoryThreadsView />}
          {activeView === 'entities' && <EntitiesIndexView />}
          {activeView === 'editor' && <ArticleEditorView />}
          {activeView === 'guide' && <MethodologyGuideView />}
        </main>
      </div>

      {/* Editorial Broadhseet Footer */}
      <footer className="mt-20 border-t border-stone-200 bg-[#f7f5f0] text-stone-600 text-xs py-10 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <div className="font-serif font-bold text-base text-stone-900 tracking-tight">
            ROBIN · Diario Interconectado
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <NewsProvider>
      <AppContent />
    </NewsProvider>
  );
}
