import React, { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import { NewsArticle, ArticleConnection, Entity, RelationshipType } from '../types/news';
import { 
  ArrowLeft, 
  Save, 
  Share2, 
  Plus, 
  Trash2, 
  Sparkles, 
  Link as LinkIcon, 
  Eye, 
  FileText, 
  Layers, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

const PRESET_IMAGES = [
  {
    url: '/src/assets/images/news_energy_transition_1793674356466.jpg',
    label: 'Cumbre de Energía y Transición Eólica'
  },
  {
    url: '/src/assets/images/news_court_investigation_1793674358115.jpg',
    label: 'Tribunal Supremo y Diligencias Judiciales'
  },
  {
    url: '/src/assets/images/news_tech_quantum_lab_1793674358552.jpg',
    label: 'Laboratorio Científico y Fotónica Cuántica'
  },
  {
    url: '/src/assets/images/news_urban_climate_1793674358402.jpg',
    label: 'Metrópolis Sostenible y Tranvía Biófilo'
  }
];

export const ArticleEditorView: React.FC = () => {
  const { 
    articles, 
    threads, 
    editingArticleId, 
    createArticle, 
    updateArticle, 
    setActiveView, 
    setCurrentArticle,
    suggestConnections 
  } = useNews();

  const isEditing = Boolean(editingArticleId);
  const targetArticle = isEditing ? articles.find((a) => a.id === editingArticleId) : null;

  const [activeTab, setActiveTab] = useState<'content' | 'connections' | 'preview'>('content');

  // Form State
  const [title, setTitle] = useState('');
  const [kicker, setKicker] = useState('');
  const [dek, setDek] = useState('');
  const [category, setCategory] = useState<NewsArticle['category']>('Clima y Energía');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [imageCaption, setImageCaption] = useState('');
  const [authorName, setAuthorName] = useState('Redacción Nexo');
  const [authorRole, setAuthorRole] = useState('Corresponsal Especial');
  const [authorLocation, setAuthorLocation] = useState('Redacción Central');
  const [readTime, setReadTime] = useState('4 min');
  const [content, setContent] = useState('');
  const [threadId, setThreadId] = useState<string>('');
  
  // Connections & Entities state
  const [connections, setConnections] = useState<ArticleConnection[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);

  // New connection input state
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [relType, setRelType] = useState<RelationshipType>('consecuencia');
  const [relDescription, setRelDescription] = useState<string>('');

  // New entity input state
  const [newEntityName, setNewEntityName] = useState('');
  const [newEntityType, setNewEntityType] = useState<Entity['type']>('persona');
  const [newEntityRole, setNewEntityRole] = useState('');

  // Status message
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize form if editing
  useEffect(() => {
    if (targetArticle) {
      setTitle(targetArticle.title);
      setKicker(targetArticle.kicker);
      setDek(targetArticle.dek);
      setCategory(targetArticle.category);
      setImageUrl(targetArticle.imageUrl);
      setImageCaption(targetArticle.imageCaption || '');
      setAuthorName(targetArticle.author?.name || 'Redacción Nexo');
      setAuthorRole(targetArticle.author?.role || 'Periodista');
      setAuthorLocation(targetArticle.author?.location || 'Redacción');
      setReadTime(targetArticle.readTime || '4 min');
      setContent(targetArticle.content);
      setThreadId(targetArticle.threadId || '');
      setConnections(targetArticle.connections || []);
      setEntities(targetArticle.entities || []);
    } else {
      // Default sample for quick inspiration
      setTitle('');
      setKicker('ÚLTIMA HORA');
      setDek('');
      setContent('');
      setConnections([]);
      setEntities([]);
    }
  }, [targetArticle]);

  // Handle adding a connection
  const handleAddConnection = () => {
    if (!selectedTargetId) return;
    const exists = connections.some((c) => c.targetArticleId === selectedTargetId);
    if (exists) return;

    const newConn: ArticleConnection = {
      targetArticleId: selectedTargetId,
      relationshipType: relType,
      description: relDescription.trim() || 'Noticia directamente vinculada por contexto periodístico.'
    };

    setConnections((prev) => [...prev, newConn]);
    setSelectedTargetId('');
    setRelDescription('');
  };

  const handleRemoveConnection = (targetId: string) => {
    setConnections((prev) => prev.filter((c) => c.targetArticleId !== targetId));
  };

  // Handle adding an entity
  const handleAddEntity = () => {
    if (!newEntityName.trim()) return;
    const id = newEntityName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newEnt: Entity = {
      id,
      name: newEntityName.trim(),
      type: newEntityType,
      roleInArticle: newEntityRole.trim() || undefined
    };
    setEntities((prev) => [...prev, newEnt]);
    setNewEntityName('');
    setNewEntityRole('');
  };

  const handleRemoveEntity = (id: string) => {
    setEntities((prev) => prev.filter((e) => e.id !== id));
  };

  // Helper to insert [[id|title]] into content
  const handleInsertWikilink = (art: NewsArticle) => {
    const linkSyntax = `[[${art.id}|${art.title}]]`;
    setContent((prev) => prev + `\n\nComo se documentó en ${linkSyntax}...`);
    // Also auto-add connection if not present
    if (!connections.some((c) => c.targetArticleId === art.id)) {
      setConnections((prev) => [
        ...prev,
        {
          targetArticleId: art.id,
          relationshipType: 'antecedente',
          description: `Referenciada en el cuerpo del texto sobre ${art.title}.`
        }
      ]);
    }
  };

  // Smart suggestions
  const suggestedArticles = suggestConnections(title + ' ' + content, editingArticleId || undefined);

  // Submit
  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('Por favor ingrese al menos un titular y el contenido de la noticia.');
      return;
    }

    const payload = {
      title: title.trim(),
      kicker: kicker.trim() || 'ACTUALIDAD',
      dek: dek.trim() || title.trim(),
      content: content.trim(),
      category,
      imageUrl,
      imageCaption,
      author: {
        name: authorName.trim() || 'Redacción Nexo',
        role: authorRole.trim() || 'Periodista',
        location: authorLocation.trim() || 'Redacción'
      },
      publishedAt: '2026-11-02',
      readTime: readTime || '4 min',
      threadId: threadId || undefined,
      connections,
      entities
    };

    let savedId = '';
    if (isEditing && targetArticle) {
      updateArticle(targetArticle.id, payload);
      savedId = targetArticle.id;
    } else {
      savedId = createArticle(payload);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      const articleToView = articles.find((a) => a.id === savedId) || { ...payload, id: savedId, slug: savedId };
      setCurrentArticle(articleToView);
      setActiveView('article');
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top action strip */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-200">
        <button
          onClick={() => setActiveView('frontpage')}
          className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancelar y Volver</span>
        </button>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
              <CheckCircle className="w-4 h-4" />
              <span>¡Noticia y conexiones guardadas con éxito!</span>
            </span>
          )}

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Actualizar Noticia' : 'Publicar Noticia'}</span>
          </button>
        </div>
      </div>

      {/* Editor Title & Explanation */}
      <div className="mb-6">
        <span className="text-xs uppercase tracking-widest text-stone-500 font-sans font-semibold">
          Sala de Redacción & Estructura de Datos
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
          {isEditing ? 'Editar Noticia y Reconfigurar Vínculos' : 'Redactar Nueva Noticia y Tejer Conexiones'}
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
          En NEXO, cada noticia es un nodo de conocimiento. Use las pestañas para redactar el texto y definir sus vínculos causales, temporales y temáticos con el resto de informaciones del portal.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-stone-200 mb-8 bg-stone-100/60 p-1 rounded-t-lg">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
            activeTab === 'content'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>1. Contenido Periodístico</span>
        </button>

        <button
          onClick={() => setActiveTab('connections')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all relative ${
            activeTab === 'connections'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Share2 className="w-3.5 h-3.5 text-stone-700" />
          <span>2. Constructor de Conexiones ({connections.length})</span>
          {connections.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
            activeTab === 'preview'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>3. Vista Previa en Vivo</span>
        </button>
      </div>

      {/* TAB 1: CONTENT */}
      {activeTab === 'content' && (
        <div className="space-y-6 bg-white p-6 rounded-xl border border-stone-200 shadow-xs">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Antetítulo / Kicker
              </label>
              <input
                type="text"
                value={kicker}
                onChange={(e) => setKicker(e.target.value)}
                placeholder="ej: INVESTIGACIÓN JUDICIAL"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Área Temática / Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NewsArticle['category'])}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 focus:outline-none"
              >
                <option value="Clima y Energía">Clima y Energía</option>
                <option value="Política y Justicia">Política y Justicia</option>
                <option value="Tecnología y Ciencia">Tecnología y Ciencia</option>
                <option value="Urbanismo y Sociedad">Urbanismo y Sociedad</option>
                <option value="Economía">Economía</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Hilo de Cobertura Continua
              </label>
              <select
                value={threadId}
                onChange={(e) => setThreadId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 focus:outline-none"
              >
                <option value="">-- Sin hilo específico --</option>
                {threads.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Titular Principal *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titular claro, riguroso y periodístico..."
              className="w-full px-4 py-2.5 text-base sm:text-lg font-serif font-bold text-stone-900 bg-stone-50 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Bajada / Dek (Resumen editorial)
            </label>
            <textarea
              rows={2}
              value={dek}
              onChange={(e) => setDek(e.target.value)}
              placeholder="Explicación en dos líneas de la relevancia, implicados y alcance..."
              className="w-full px-3 py-2 text-xs sm:text-sm text-stone-800 bg-stone-50 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 focus:outline-none"
            />
          </div>

          {/* Image selection */}
          <div className="border-t border-stone-200 pt-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Fotografía Documental Destacada
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {PRESET_IMAGES.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setImageUrl(preset.url);
                    setImageCaption(preset.label);
                  }}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    imageUrl === preset.url ? 'border-stone-900 shadow-md ring-2 ring-stone-900/20' : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full aspect-[4/3] object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-1.5 bg-stone-50 text-[10px] text-stone-700 font-medium truncate">
                    {preset.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-stone-500 mb-1">O ingrese una URL personalizada:</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-500 mb-1">Pie de foto periodístico:</label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Descripción documental del encuadre..."
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Author info */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border-t border-stone-200 pt-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">Firma / Autor</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">Cargo / Especialidad</label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">Ubicación</label>
              <input
                type="text"
                value={authorLocation}
                onChange={(e) => setAuthorLocation(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">Tiempo de Lectura</label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded"
              />
            </div>
          </div>

          {/* Content Body with Wikilink Toolbar */}
          <div className="border-t border-stone-200 pt-5">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Cuerpo del Artículo *
              </label>
              <span className="text-[11px] text-stone-500 font-sans">
                Atajo para enlaces internos: <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">[[id_noticia|Texto visible]]</code>
              </span>
            </div>

            {/* Quick insert buttons from existing articles */}
            {articles.length > 0 && (
              <div className="mb-3 p-2.5 bg-stone-50 rounded-lg border border-stone-200 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-stone-500 font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" />
                  Insertar enlace a noticia existente:
                </span>
                {articles.slice(0, 4).map((art) => (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => handleInsertWikilink(art)}
                    className="px-2 py-0.5 bg-white hover:bg-stone-200 border border-stone-300 text-stone-800 rounded text-[11px] transition-colors truncate max-w-xs"
                    title={`Insertar [[${art.id}|${art.title}]]`}
                  >
                    + {art.title.substring(0, 24)}...
                  </button>
                ))}
              </div>
            )}

            <textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escriba aquí la crónica. Use párrafos dobles para separar secciones. Puede usar subtítulos con ### Subtítulo..."
              className="w-full p-4 text-sm font-serif leading-relaxed text-stone-900 bg-stone-50 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none"
            />
          </div>

        </div>
      )}

      {/* TAB 2: CONNECTION BUILDER (THE CRITICAL ARCHITECTURAL TOOL) */}
      {activeTab === 'connections' && (
        <div className="space-y-8 bg-white p-6 rounded-xl border border-stone-200 shadow-xs">
          
          {/* Conceptual intro box */}
          <div className="p-4 bg-stone-50 rounded-lg border border-stone-200/90 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700 space-y-1">
              <strong className="font-semibold text-stone-900 block text-sm">
                ¿Cómo tejer conexiones informativas útiles para el lector?
              </strong>
              <p>
                Una conexión no es solo una "noticia relacionada" genérica. En el periodismo de red, cada enlace tiene un rol causal o dialéctico: 
                <strong> Antecedente</strong> (lo que ocurrió antes), <strong> Consecuencia</strong> (lo que desencadenó), 
                <strong> Contrapunto</strong> (la voz que disiente o datos contradictorios), o <strong> Investigación</strong> (documentos o peritajes forenses).
              </p>
            </div>
          </div>

          {/* Section 1: Article-to-Article Connections */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  1. Vínculos con Otras Noticias del Portal
                </h3>
                <p className="text-xs text-stone-500">
                  Seleccione una noticia publicada y defina el tipo exacto de relación periodística.
                </p>
              </div>
            </div>

            {/* Form to add a connection */}
            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-6">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Noticia Destino *
                  </label>
                  <select
                    value={selectedTargetId}
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 focus:outline-none"
                  >
                    <option value="">-- Elija una noticia existente --</option>
                    {articles
                      .filter((a) => a.id !== editingArticleId)
                      .map((art) => (
                        <option key={art.id} value={art.id}>
                          [{art.category}] {art.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="md:col-span-6">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Naturaleza del Vínculo *
                  </label>
                  <select
                    value={relType}
                    onChange={(e) => setRelType(e.target.value as RelationshipType)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 focus:outline-none"
                  >
                    <option value="antecedente">Antecedente (Causa o contexto previo)</option>
                    <option value="consecuencia">Consecuencia (Efecto, réplica o resultado directo)</option>
                    <option value="contrapunto">Contrapunto (Perspectiva contraria o desacuerdo)</option>
                    <option value="investigacion">Investigación (Peritaje, sumario judicial o filtración)</option>
                    <option value="mismo_hilo">Mismo Hilo (Siguiente entrega de la cobertura)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Nota Explicativa del Vínculo para el Lector
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={relDescription}
                    onChange={(e) => setRelDescription(e.target.value)}
                    placeholder="ej: El peritaje técnico de este laboratorio fue requerido por la fiscalía que investiga los contratos..."
                    className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddConnection}
                    disabled={!selectedTargetId}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
                  >
                    + Vincular
                  </button>
                </div>
              </div>
            </div>

            {/* Smart suggestions bar */}
            {suggestedArticles.length > 0 && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg mb-6 text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Sugerencias automáticas por similitud temática o entidades:</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {suggestedArticles.map((sug) => (
                    <button
                      key={sug.id}
                      type="button"
                      onClick={() => {
                        setSelectedTargetId(sug.id);
                        setRelDescription(`Vinculación sugerida por co-ocurrencia temática con "${sug.title}".`);
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded text-amber-950 font-medium text-[11px] transition-colors"
                    >
                      + Seleccionar "{sug.title.substring(0, 32)}..."
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Connections Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Conexiones Configuradas ({connections.length})
              </span>

              {connections.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-500 border border-dashed border-stone-300 rounded-lg">
                  No hay conexiones directas configuradas aún. Utilice el formulario superior para añadir la primera.
                </div>
              ) : (
                connections.map((c) => {
                  const target = articles.find((a) => a.id === c.targetArticleId);
                  return (
                    <div
                      key={c.targetArticleId}
                      className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200"
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                            {c.relationshipType}
                          </span>
                          <span className="text-xs font-serif font-bold text-stone-900">
                            {target?.title || c.targetArticleId}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 italic">
                          "{c.description}"
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveConnection(c.targetArticleId)}
                        className="text-stone-400 hover:text-red-600 p-1 rounded transition-colors"
                        title="Eliminar vínculo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Section 2: Named Entities & Key Protagonists */}
          <div className="border-t border-stone-200 pt-6">
            <h3 className="text-base font-serif font-bold text-stone-900 mb-1">
              2. Protagonistas y Entidades Clave (Personas, Organizaciones, Lugares)
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Las entidades compartidas son el pegamento semántico que permite navegar entre noticias dispares.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Nombre de la Entidad
                </label>
                <input
                  type="text"
                  value={newEntityName}
                  onChange={(e) => setNewEntityName(e.target.value)}
                  placeholder="ej: Dra. Elena Vidal"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Tipo
                </label>
                <select
                  value={newEntityType}
                  onChange={(e) => setNewEntityType(e.target.value as Entity['type'])}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded"
                >
                  <option value="persona">Persona</option>
                  <option value="organizacion">Organización</option>
                  <option value="lugar">Lugar</option>
                  <option value="concepto">Concepto clave</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Rol en la Noticia
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newEntityRole}
                    onChange={(e) => setNewEntityRole(e.target.value)}
                    placeholder="ej: Negociadora jefa"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={handleAddEntity}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold shrink-0"
                  >
                    + Añadir
                  </button>
                </div>
              </div>
            </div>

            {/* Entities tags */}
            <div className="flex flex-wrap gap-2">
              {entities.map((ent) => (
                <div
                  key={ent.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-300 rounded-lg shadow-2xs text-xs"
                >
                  <div>
                    <span className="font-semibold text-stone-900">{ent.name}</span>
                    <span className="text-[10px] text-stone-500 font-sans ml-1.5">
                      ({ent.type}{ent.roleInArticle ? ` · ${ent.roleInArticle}` : ''})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveEntity(ent.id)}
                    className="text-stone-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              {entities.length === 0 && (
                <span className="text-xs text-stone-400 italic">No hay entidades etiquetadas aún.</span>
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: LIVE PREVIEW */}
      {activeTab === 'preview' && (
        <div className="bg-stone-100 p-6 rounded-xl border border-stone-200">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg border border-stone-200 shadow-sm">
            <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold block mb-2">
              {kicker || 'ACTUALIDAD'}
            </span>
            <h1 className="editorial-headline text-3xl font-serif font-bold text-stone-900 mb-3">
              {title || 'Titular sin definir'}
            </h1>
            <p className="text-base font-serif italic text-stone-600 mb-4">
              {dek || 'Bajada del artículo...'}
            </p>
            <div className="text-xs text-stone-500 border-t border-b border-stone-200 py-2 mb-6">
              <span>{authorName}</span> · <span>{authorRole}</span> · <span>{readTime} de lectura</span>
            </div>

            {imageUrl && (
              <div className="w-full aspect-[16/9] rounded overflow-hidden mb-6 bg-stone-100">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="font-serif text-base text-stone-800 leading-relaxed whitespace-pre-line mb-8">
              {content || 'Contenido en redacción...'}
            </div>

            {/* Connections summary in preview */}
            <div className="border-t border-stone-200 pt-6 bg-stone-50 p-4 rounded-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-900 block mb-3">
                Conexiones que verá el lector ({connections.length})
              </span>
              <div className="space-y-2">
                {connections.map((c, i) => {
                  const target = articles.find((a) => a.id === c.targetArticleId);
                  return (
                    <div key={i} className="p-2.5 bg-white rounded border border-stone-200 text-xs">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-blue-800 mr-2">
                        [{c.relationshipType}]
                      </span>
                      <span className="font-serif font-semibold text-stone-900">
                        {target?.title || c.targetArticleId}
                      </span>
                      <p className="text-[11px] text-stone-600 mt-1 italic">"{c.description}"</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
