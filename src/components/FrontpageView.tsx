import React from 'react';
import { useNews } from '../context/NewsContext';
import { NewsArticle } from '../types/news';
import { 
  Network, 
  GitBranch, 
  Share2, 
  ArrowRight, 
  TrendingUp, 
  Flame, 
  Clock, 
  MapPin, 
  ExternalLink,
  Users
} from 'lucide-react';

export const FrontpageView: React.FC = () => {
  const { 
    articles, 
    threads, 
    setCurrentArticle, 
    setActiveView, 
    selectedCategory, 
    setSelectedCategory,
    setSelectedThreadId,
    setSelectedEntityId,
    getAllEntities
  } = useNews();

  const filteredArticles = articles.filter((art) => {
    if (selectedCategory === 'all') return true;
    return art.category === selectedCategory;
  });

  const leadStory = filteredArticles.find((a) => a.featured) || filteredArticles[0] || articles[0];
  const secondaryStories = filteredArticles.filter((a) => a.id !== leadStory?.id).slice(0, 2);
  const remainingStories = filteredArticles.filter(
    (a) => a.id !== leadStory?.id && !secondaryStories.some((s) => s.id === a.id)
  );

  const entitiesList = getAllEntities().slice(0, 8);

  const handleOpenArticle = (art: NewsArticle) => {
    setCurrentArticle(art);
    setActiveView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setActiveView('threads');
  };

  const handleOpenEntity = (entityId: string) => {
    setSelectedEntityId(entityId);
    setActiveView('graph');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Editorial Masthead & Date ribbon */}
      <div className="border-b-2 border-stone-900 pb-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 font-sans uppercase tracking-widest gap-2 pb-2 border-b border-stone-200">
          <span>Edición Digital Continua · Conexiones en Red</span>
          <span>Lunes, 2 de Noviembre de 2026</span>
          <span className="font-semibold text-stone-800">3 Noticias Vinculadas</span>
        </div>

        {/* Category Filter Bar (Interactive segmented buttons allowed per §1.A) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar text-xs">
          {[
            { id: 'all', label: 'Todas las Portadas' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap shrink-0 transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Frontpage Content */}
      <div className="max-w-4xl mx-auto space-y-10">
          
          {/* TIER 1: LEAD STORY (Dominant visual & typography) */}
          {leadStory && (
            <article 
              onClick={() => handleOpenArticle(leadStory)}
              className="group cursor-pointer border-b border-stone-200 pb-8"
            >
              <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-stone-500 font-semibold mb-2">
                <span>{leadStory.kicker}</span>
                <span aria-hidden="true">·</span>
                <span className="text-stone-400 font-normal">Historia Principal</span>
              </div>

              <h1 
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 group-hover:text-stone-700 transition-colors leading-[1.12] mb-4"
              >
                {leadStory.title}
              </h1>

              <div className="w-full aspect-[16/9] bg-stone-100 rounded-lg overflow-hidden mb-4 border border-stone-200 shadow-xs">
                <img
                  src={leadStory.imageUrl}
                  alt={leadStory.title}
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <p 
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                className="text-base sm:text-lg text-stone-700 leading-relaxed mb-4 line-clamp-3"
              >
                {leadStory.dek}
              </p>

              {/* Clean unboxed metadata */}
              <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 font-sans pt-2 border-t border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-900">{leadStory.author.name}</span>
                  <span aria-hidden="true">·</span>
                  <span>{leadStory.author.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{leadStory.readTime}</span>
                </div>

                {/* Connection pills or indicators */}
                <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                  <Share2 className="w-3.5 h-3.5 text-stone-500" />
                  <span>{leadStory.connections?.length || 0} conexiones activas</span>
                </div>
              </div>
            </article>
          )}

          {/* TIER 2: SECONDARY FEATURES (2-3 Structured cards) */}
          <div 
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-stone-200 pb-8"
          >
            {secondaryStories.map((story) => (
              <article
                key={story.id}
                onClick={() => handleOpenArticle(story)}
                className="group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] bg-stone-100 rounded-lg overflow-hidden mb-3 border border-stone-200">
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <span className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold block mb-1">
                    {story.kicker}
                  </span>

                  <h2 
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    className="text-xl font-bold text-stone-900 group-hover:text-stone-700 transition-colors leading-snug mb-2"
                  >
                    {story.title}
                  </h2>

                  <p 
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3"
                  >
                    {story.dek}
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-[11px] text-stone-500 font-sans pt-2 border-t border-stone-200">
                  <span>{story.author.name}</span>
                  <div className="flex items-center gap-1 text-stone-600 font-medium">
                    <Network className="w-3 h-3 text-stone-400" />
                    <span>{story.connections?.length || 0} vínculos</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </div>
  );
};
