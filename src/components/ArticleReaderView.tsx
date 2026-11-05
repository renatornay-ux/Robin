import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { NewsArticle, RelationshipType, Entity } from '../types/news';
import { 
  ArrowLeft, 
  Network, 
  GitBranch, 
  Edit3, 
  Share2, 
  Bookmark, 
  Clock, 
  MapPin, 
  FileText, 
  ExternalLink,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const ArticleReaderView: React.FC = () => {
  const { 
    currentArticle, 
    setCurrentArticle, 
    setActiveView, 
    getReciprocalConnections, 
    threads, 
    getArticleById,
    setEditingArticleId,
    setSelectedEntityId
  } = useNews();

  const [hoveredPreview, setHoveredPreview] = useState<{
    article: NewsArticle | null;
    x: number;
    y: number;
  }>({ article: null, x: 0, y: 0 });

  if (!currentArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-stone-500 mb-4">No se ha seleccionado ninguna noticia.</p>
        <button
          onClick={() => setActiveView('frontpage')}
          className="px-4 py-2 bg-stone-900 text-white rounded text-sm"
        >
          Volver a la Portada
        </button>
      </div>
    );
  }

  const reciprocalConnections = getReciprocalConnections(currentArticle.id);
  const currentThread = threads.find((t) => t.id === currentArticle.threadId);

  // Thread navigation (Previous / Next article in thread)
  const threadArticles = currentThread
    ? currentThread.articleIds
        .map((aid) => getArticleById(aid))
        .filter((a): a is NewsArticle => Boolean(a))
    : [];

  const currentThreadIndex = threadArticles.findIndex((a) => a.id === currentArticle.id);
  const prevInThread = currentThreadIndex > 0 ? threadArticles[currentThreadIndex - 1] : null;
  const nextInThread =
    currentThreadIndex >= 0 && currentThreadIndex < threadArticles.length - 1
      ? threadArticles[currentThreadIndex + 1]
      : null;

  // Parser for inline wikilinks: [[article_id|Text to show]] or [[article_id]]
  const renderFormattedContent = (content: string) => {
    const paragraphs = content.split('\n\n');

    return paragraphs.map((paragraph, pIdx) => {
      // Check for markdown headers
      if (paragraph.startsWith('### ')) {
        return (
          <h3 
            key={pIdx} 
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            className="text-xl font-bold text-stone-900 mt-8 mb-4"
          >
            {paragraph.replace('### ', '')}
          </h3>
        );
      }

      // Parse inline [[id|Label]] or [[id]]
      const parts: React.ReactNode[] = [];
      const linkRegex = /\[\[(.*?)(?:\|(.*?))?\]\]/g;
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = linkRegex.exec(paragraph)) !== null) {
        const fullMatch = match[0];
        const matchStart = match.index;
        const targetId = match[1].trim();
        const displayLabel = match[2]?.trim() || targetId;

        // Push preceding plain text
        if (matchStart > lastIndex) {
          parts.push(paragraph.substring(lastIndex, matchStart));
        }

        const linkedArticle = getArticleById(targetId);

        if (linkedArticle) {
          parts.push(
            <span
              key={`link-${matchStart}`}
              onClick={() => {
                setCurrentArticle(linkedArticle);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setHoveredPreview({
                  article: linkedArticle,
                  x: rect.left,
                  y: rect.bottom + window.scrollY
                });
              }}
              onMouseLeave={() => setHoveredPreview({ article: null, x: 0, y: 0 })}
              className="text-stone-900 font-semibold underline decoration-stone-400 decoration-1 underline-offset-4 hover:decoration-stone-900 hover:bg-stone-100/80 px-0.5 rounded cursor-pointer transition-all inline-flex items-center gap-0.5"
            >
              <span>{displayLabel}</span>
              <span className="text-[10px] text-stone-400 font-normal">↗</span>
            </span>
          );
        } else {
          // Check if entity mention
          parts.push(
            <span key={`mention-${matchStart}`} className="font-semibold text-stone-800">
              {displayLabel}
            </span>
          );
        }

        lastIndex = matchStart + fullMatch.length;
      }

      if (lastIndex < paragraph.length) {
        parts.push(paragraph.substring(lastIndex));
      }

      const isFirstParagraph = pIdx === 0;

      return (
        <p
          key={pIdx}
          style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '19px', lineHeight: '20px' }}
          className={`editorial-body text-stone-800 mb-6 ${
            isFirstParagraph ? 'editorial-dropcap' : ''
          }`}
        >
          {parts}
        </p>
      );
    });
  };

  const handleEntityClick = (ent: Entity) => {
    setSelectedEntityId(ent.id);
    setActiveView('graph');
  };

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      {/* Top back navigation and quick utility bar */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-stone-200">
        <button
          onClick={() => setActiveView('frontpage')}
          className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la Portada</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingArticleId(currentArticle.id);
              setActiveView('editor');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-stone-900 hover:bg-stone-800 text-white transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar Noticia y Conexiones</span>
          </button>
        </div>
      </div>


      {/* Article Header */}
      <header className="max-w-4xl mb-8">
        <span className="text-xs font-sans uppercase tracking-widest text-stone-500 font-semibold block mb-2">
          {currentArticle.kicker}
        </span>
        <h1 className="editorial-headline text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15] mb-4">
          {currentArticle.title}
        </h1>
        <p 
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          className="text-lg sm:text-xl text-stone-600 leading-relaxed italic mb-6"
        >
          {currentArticle.dek}
        </p>

        {/* Clean unboxed metadata with typographic separators */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 border-t border-b border-stone-200 py-3 font-sans">
          <span className="font-semibold text-stone-900">{currentArticle.author.name}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {currentArticle.author.location}
          </span>
          <span aria-hidden="true">·</span>
          <span>Publicado {currentArticle.publishedAt}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {currentArticle.readTime} de lectura
          </span>
        </div>
      </header>

      {/* Main Reading Layout */}
      <div className="max-w-4xl mx-auto">
        
        {/* Reading Column: Media + Reading Prose */}
        <div>
          {/* Main Visual */}
          {currentArticle.imageUrl && (
            <figure className="mb-8">
              <div className="w-full aspect-[16/9] bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                <img
                  src={currentArticle.imageUrl}
                  alt={currentArticle.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {currentArticle.imageCaption && (
                <figcaption className="text-xs text-stone-500 italic mt-2.5">
                  {currentArticle.imageCaption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Reading Column Prose */}
          <div 
            style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '19px', lineHeight: '20px' }}
            className="prose prose-stone max-w-none text-stone-900"
          >
            {renderFormattedContent(currentArticle.content)}
          </div>

        </div>
      </div>

      {/* Hover preview popup for inline links */}
      {hoveredPreview.article && (
        <div
          style={{ top: hoveredPreview.y + 8, left: Math.min(hoveredPreview.x, window.innerWidth - 340) }}
          className="fixed z-50 w-80 bg-white rounded-lg shadow-xl border border-stone-300 p-3 pointer-events-none transition-opacity"
        >
          <span className="text-[10px] uppercase font-bold text-stone-500 block mb-1">
            {hoveredPreview.article.category}
          </span>
          <h4 className="text-xs font-serif font-bold text-stone-900 leading-snug mb-1">
            {hoveredPreview.article.title}
          </h4>
          <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
            {hoveredPreview.article.dek}
          </p>
          <div className="mt-2 text-[10px] text-stone-400 font-sans flex items-center gap-2">
            <span>{hoveredPreview.article.readTime} de lectura</span>
            <span>·</span>
            <span>Clic para ir a la noticia</span>
          </div>
        </div>
      )}

    </article>
  );
};
