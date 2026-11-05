import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { StoryThread, NewsArticle } from '../types/news';
import { 
  GitBranch, 
  Plus, 
  ArrowRight, 
  Clock, 
  FileText, 
  Layers, 
  Check, 
  Share2 
} from 'lucide-react';

export const StoryThreadsView: React.FC = () => {
  const { 
    threads, 
    articles, 
    setCurrentArticle, 
    setActiveView, 
    createThread,
    selectedThreadId,
    setSelectedThreadId 
  } = useNews();

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDek, setNewDek] = useState('');
  const [newCategory, setNewCategory] = useState('Clima y Energía');

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createThread({
      title: newTitle.trim(),
      dek: newDek.trim(),
      category: newCategory,
      status: 'en_desarrollo'
    });

    setNewTitle('');
    setNewDek('');
    setIsCreating(false);
  };

  const handleOpenArticle = (art: NewsArticle) => {
    setCurrentArticle(art);
    setActiveView('article');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-200">
        <div>
          <span className="text-xs font-sans uppercase tracking-widest text-stone-500 font-semibold">
            Narrativas Continuas & Cronologías
          </span>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
            Hilos de Cobertura Periodística
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Siga la evolución de las historias complejas a través del tiempo. Cada hilo agrupa los antecedentes, acontecimientos principales y consecuencias en una sola línea cronológica.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Cerrar Formulario' : 'Nuevo Hilo de Cobertura'}</span>
        </button>
      </div>

      {/* Creation form modal/drawer */}
      {isCreating && (
        <form 
          onSubmit={handleCreateThread}
          className="mb-8 p-6 bg-stone-50 rounded-xl border border-stone-300 shadow-sm space-y-4 max-w-3xl"
        >
          <h3 className="text-base font-serif font-bold text-stone-900">
            Crear un Nuevo Hilo de Cobertura
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Título del Hilo / Saga *
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="ej: Crisis de Suministro de Minerales Estratégicos"
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Categoría
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
              >
                <option value="Clima y Energía">Clima y Energía</option>
                <option value="Política y Justicia">Política y Justicia</option>
                <option value="Tecnología y Ciencia">Tecnología y Ciencia</option>
                <option value="Urbanismo y Sociedad">Urbanismo y Sociedad</option>
                <option value="Economía">Economía</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Descripción del Alcance
            </label>
            <textarea
              rows={2}
              value={newDek}
              onChange={(e) => setNewDek(e.target.value)}
              placeholder="¿Qué preguntas persigue este hilo informativo a lo largo de las semanas?"
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold uppercase tracking-wider"
            >
              Crear Hilo
            </button>
          </div>
        </form>
      )}

      {/* Threads List */}
      <div className="space-y-12">
        {threads.map((thread) => {
          const threadArticles = thread.articleIds
            .map((id) => articles.find((a) => a.id === id))
            .filter((a): a is NewsArticle => Boolean(a));

          return (
            <div 
              key={thread.id}
              className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-xs"
            >
              {/* Thread Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-stone-500 font-semibold mb-1">
                    <span>{thread.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-bold">Cobertura Activa</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-stone-900">
                    {thread.title}
                  </h2>
                  <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
                    {thread.dek}
                  </p>
                </div>

                <div className="text-xs text-stone-500 font-sans shrink-0 bg-stone-50 px-3 py-2 rounded border border-stone-200">
                  <span className="font-semibold text-stone-900">{threadArticles.length}</span> Entregas en este hilo
                </div>
              </div>

              {/* Timeline Sequence of Chapters */}
              <div className="mt-6">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900 block mb-4 font-sans">
                  Secuencia Cronológica de Entregas
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                  {threadArticles.map((art, idx) => (
                    <div
                      key={art.id}
                      onClick={() => handleOpenArticle(art)}
                      className="group cursor-pointer p-4 rounded-lg border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-stone-400 hover:shadow-sm transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Chapter indicator */}
                        <div className="flex items-center justify-between text-xs text-stone-500 mb-2 font-sans">
                          <span className="font-bold text-stone-800 uppercase tracking-wider text-[11px]">
                            Capítulo {idx + 1}
                          </span>
                          <span>{art.publishedAt}</span>
                        </div>

                        {art.imageUrl && (
                          <div className="aspect-video w-full rounded overflow-hidden mb-3 bg-stone-100">
                            <img
                              src={art.imageUrl}
                              alt={art.title}
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}

                        <h3 className="text-base font-serif font-bold text-stone-900 group-hover:text-stone-700 leading-snug mb-2">
                          {art.title}
                        </h3>

                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                          {art.dek}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-stone-500 font-sans pt-3 mt-4 border-t border-stone-200">
                        <span>{art.readTime}</span>
                        <span className="flex items-center gap-1 font-semibold text-stone-900 group-hover:text-stone-700">
                          <span>Leer</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}

                  {threadArticles.length === 0 && (
                    <div className="col-span-3 p-8 text-center text-xs text-stone-500 border border-dashed border-stone-300 rounded-lg">
                      Este hilo aún no tiene noticias asignadas. Puede asignar noticias a este hilo desde el editor de artículos.
                    </div>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
