import React from 'react';
import { useNews } from '../context/NewsContext';
import { 
  Network, 
  GitBranch, 
  Users, 
  Share2, 
  ArrowRight, 
  CheckCircle, 
  Lightbulb, 
  Compass, 
  BookOpen,
  PenTool
} from 'lucide-react';

export const MethodologyGuideView: React.FC = () => {
  const { setActiveView, setEditingArticleId } = useNews();

  const handleStartWeaving = () => {
    setEditingArticleId(null);
    setActiveView('editor');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 mb-8 text-center sm:text-left">
        <span className="text-xs font-sans uppercase tracking-widest text-stone-500 font-semibold flex items-center justify-center sm:justify-start gap-1.5 mb-2">
          <Compass className="w-4 h-4 text-stone-700" />
          <span>Manual de Arquitectura de la Información</span>
        </span>
        <h1 className="editorial-headline text-3xl sm:text-4xl font-serif font-bold text-stone-900 leading-tight">
          Cómo Iniciar Armando las Conexiones entre Noticias
        </h1>
        <p className="text-base text-stone-600 mt-2 font-serif italic max-w-2xl">
          "En el periodismo tradicional, las noticias mueren al día siguiente en un feed vertical. En el periodismo de red, cada información refuerza el mapa del conocimiento colectivo."
        </p>
      </div>

      {/* Action CTA */}
      <div className="p-5 bg-stone-900 text-stone-100 rounded-xl mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-white">¿Listo para probar en la práctica?</h3>
          <p className="text-xs text-stone-300 mt-0.5">
            Abra el redactor, escriba una noticia o elija una existente y ensaye los tipos de enlace.
          </p>
        </div>
        <button
          onClick={handleStartWeaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-stone-900 hover:bg-stone-200 rounded text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Comenzar a Tejer Conexiones</span>
        </button>
      </div>

      {/* Section 1: The 4 Levels of Connection */}
      <div className="space-y-8 mb-12">
        <h2 className="text-2xl font-serif font-bold text-stone-900 border-b border-stone-200 pb-2">
          1. Los Cuatro Niveles de Vínculos Periodísticos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Level 1: Causal */}
          <div className="p-5 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center gap-2 text-xs uppercase font-bold text-blue-800 mb-2 font-sans">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Nivel Causal & Temporal (Antecedente → Consecuencia)</span>
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              ¿Por qué ocurrió esto y qué desencadena?
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-sans mb-3">
              Conecta un hecho presente con su causa histórica inmediata o con su desenlace. Por ejemplo: la firma de un pacto eólico (Causa) se vincula con la electrificación de los tranvías en la capital (Consecuencia).
            </p>
            <div className="text-[11px] bg-white p-2.5 rounded border border-stone-200 text-stone-700 italic">
              <strong>Etiqueta de relación:</strong> <code className="text-blue-700 font-semibold">antecedente</code> o <code className="text-blue-700 font-semibold">consecuencia</code>
            </div>
          </div>

          {/* Level 2: Semantic Entities */}
          <div className="p-5 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center gap-2 text-xs uppercase font-bold text-purple-800 mb-2 font-sans">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <span>Nivel Semántico (Entidades Compartidas)</span>
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              Los protagonistas como puentes de información
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-sans mb-3">
              Dos noticias en frentes dispares (Tribunales y Energía) se conectan porque ambas involucran a la misma persona ("Dra. Elena Vidal") o a la misma empresa adjudicataria ("Consorcio Marítimo").
            </p>
            <div className="text-[11px] bg-white p-2.5 rounded border border-stone-200 text-stone-700 italic">
              <strong>Herramienta:</strong> Etiquetar Personajes, Organizaciones y Lugares en cada noticia.
            </div>
          </div>

          {/* Level 3: Dialectic */}
          <div className="p-5 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center gap-2 text-xs uppercase font-bold text-amber-800 mb-2 font-sans">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              <span>Nivel Dialéctico (Tesis vs. Contrapunto)</span>
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              La noticia oficial y las voces críticas
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-sans mb-3">
              Frente al anuncio ministerial optimista de transición verde, se conecta un reportaje sobre las trabas de las comunidades mineras en el salar de litio.
            </p>
            <div className="text-[11px] bg-white p-2.5 rounded border border-stone-200 text-stone-700 italic">
              <strong>Etiqueta de relación:</strong> <code className="text-amber-700 font-semibold">contrapunto</code>
            </div>
          </div>

          {/* Level 4: Deep Investigation */}
          <div className="p-5 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center gap-2 text-xs uppercase font-bold text-emerald-800 mb-2 font-sans">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Nivel Forense & Sumarios (Investigación)</span>
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              Documentos probatorios y peritajes
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-sans mb-3">
              Conexión directa entre la apertura de un sumario de la Fiscalía y el laboratorio de peritaje informático o los contratos oficiales filtrados.
            </p>
            <div className="text-[11px] bg-white p-2.5 rounded border border-stone-200 text-stone-700 italic">
              <strong>Etiqueta de relación:</strong> <code className="text-emerald-700 font-semibold">investigacion</code>
            </div>
          </div>

        </div>
      </div>

      {/* Section 2: Step-by-Step Guide for Creating Connections */}
      <div className="space-y-6 mb-12">
        <h2 className="text-2xl font-serif font-bold text-stone-900 border-b border-stone-200 pb-2">
          2. El Flujo de Trabajo Editorial Recomendado
        </h2>

        <div className="space-y-4">
          
          <div className="flex gap-4 items-start p-4 bg-white rounded-lg border border-stone-200">
            <span className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </span>
            <div>
              <h4 className="font-bold text-stone-900 text-sm mb-1 font-serif">
                Publicar la noticia raíz o acontecimiento disparador
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Toda red inicia con un hito central (un anuncio ministerial, un veredicto o una catástrofe). Redáctela con su antetítulo y protagonistas clave.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 bg-white rounded-lg border border-stone-200">
            <span className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </span>
            <div>
              <h4 className="font-bold text-stone-900 text-sm mb-1 font-serif">
                Definir el "Hilo de Cobertura" (Storyline)
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Asigne la noticia a un hilo (por ejemplo: "La Gran Red Energética"). Esto crea un orden de lectura cronológico ("Capítulo 1", "Capítulo 2") para que el lector no se pierda en el archivo histórico.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 bg-white rounded-lg border border-stone-200">
            <span className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </span>
            <div>
              <h4 className="font-bold text-stone-900 text-sm mb-1 font-serif">
                Enlazar explícitamente con las noticias ya existentes
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                En la pestaña "Constructor de Conexiones", elija las noticias correspondientes y complete la <em>nota explicativa</em>. NEXO se encarga de crear el enlace bidireccional automáticamente.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 bg-white rounded-lg border border-stone-200">
            <span className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              4
            </span>
            <div>
              <h4 className="font-bold text-stone-900 text-sm mb-1 font-serif">
                Insertar hipervínculos internos en el propio cuerpo del texto
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Al redactar, use la sintaxis <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">[[id_noticia|Texto del enlace]]</code>. El lector podrá pasar el ratón para ver una previsualización flotante y saltar a la otra noticia sin perder el hilo.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Final Action Card */}
      <div className="p-6 bg-stone-100 rounded-xl border border-stone-200 text-center">
        <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
          Comience ahora a armar su propio portal
        </h3>
        <p className="text-xs text-stone-600 max-w-lg mx-auto mb-4">
          Todas las noticias y conexiones se guardan automáticamente en su navegador. Puede crear noticias nuevas, editar las existentes o explorar el grafo global en tiempo real.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setActiveView('graph')}
            className="px-4 py-2 bg-white text-stone-900 border border-stone-300 hover:bg-stone-50 rounded text-xs font-semibold uppercase tracking-wider"
          >
            Ver Grafo Actual
          </button>
          <button
            onClick={handleStartWeaving}
            className="px-4 py-2 bg-stone-900 text-white hover:bg-stone-800 rounded text-xs font-semibold uppercase tracking-wider"
          >
            + Redactar Nueva Noticia
          </button>
        </div>
      </div>

    </div>
  );
};
