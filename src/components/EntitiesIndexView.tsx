import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { EntityType, NewsArticle, Entity } from '../types/news';
import { 
  Users, 
  Search, 
  ArrowRight, 
  Network, 
  Building2, 
  MapPin, 
  User, 
  Lightbulb 
} from 'lucide-react';

export const EntitiesIndexView: React.FC = () => {
  const { 
    getAllEntities, 
    setCurrentArticle, 
    setActiveView, 
    setSelectedEntityId 
  } = useNews();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const entitiesData = getAllEntities();

  const filtered = entitiesData.filter(({ entity }) => {
    const matchType = filterType === 'all' || entity.type === filterType;
    const matchSearch =
      !search ||
      entity.name.toLowerCase().includes(search.toLowerCase()) ||
      (entity.roleInArticle && entity.roleInArticle.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchSearch;
  });

  const handleOpenEntityInGraph = (entityId: string) => {
    setSelectedEntityId(entityId);
    setActiveView('graph');
  };

  const handleOpenArticle = (art: NewsArticle) => {
    setCurrentArticle(art);
    setActiveView('article');
  };

  const getEntityIcon = (type: EntityType) => {
    if (type === 'persona') return <User className="w-4 h-4 text-blue-700" />;
    if (type === 'organizacion') return <Building2 className="w-4 h-4 text-purple-700" />;
    if (type === 'lugar') return <MapPin className="w-4 h-4 text-emerald-700" />;
    return <Lightbulb className="w-4 h-4 text-amber-700" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="pb-6 mb-8 border-b border-stone-200">
        <span className="text-xs font-sans uppercase tracking-widest text-stone-500 font-semibold">
          Ecosistema Semántico
        </span>
        <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
          Directorio de Protagonistas y Entidades
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-2xl">
          Las personas, instituciones y lugares son los puentes que enlazan historias aparentemente inconexas. Explore aquí todos los actores citados en la redacción.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-stone-100/70 p-3 rounded-lg border border-stone-200">
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          {[
            { id: 'all', label: 'Todos los Tipos' },
            { id: 'persona', label: 'Personas' },
            { id: 'organizacion', label: 'Organizaciones' },
            { id: 'lugar', label: 'Lugares' },
            { id: 'concepto', label: 'Conceptos' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                filterType === item.id
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-700 hover:bg-stone-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar entidad o cargo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-500 w-56 sm:w-64"
          />
        </div>
      </div>

      {/* Grid of Entity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(({ entity, articles }) => (
          <div
            key={entity.id}
            className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs hover:border-stone-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-stone-500">
                  {getEntityIcon(entity.type)}
                  <span>{entity.type}</span>
                </div>
                <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                  {articles.length} {articles.length === 1 ? 'noticia' : 'noticias'}
                </span>
              </div>

              <h2 className="text-lg font-serif font-bold text-stone-900 mb-1">
                {entity.name}
              </h2>

              {entity.roleInArticle && (
                <p className="text-xs text-stone-500 font-sans italic mb-3">
                  {entity.roleInArticle}
                </p>
              )}

              {/* Connected articles list */}
              <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Artículos donde aparece:
                </span>
                {articles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => handleOpenArticle(art)}
                    className="p-2 rounded bg-stone-50 hover:bg-stone-100 cursor-pointer text-xs text-stone-900 font-serif line-clamp-1 transition-colors"
                  >
                    • {art.title}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => handleOpenEntityInGraph(entity.id)}
                className="flex items-center gap-1 text-xs font-semibold text-stone-800 hover:text-stone-950 transition-colors"
              >
                <Network className="w-3.5 h-3.5" />
                <span>Explorar en el Grafo</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-stone-400 text-sm">
            No se encontraron entidades con el criterio de búsqueda seleccionado.
          </div>
        )}
      </div>

    </div>
  );
};
