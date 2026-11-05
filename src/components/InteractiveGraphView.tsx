import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNews } from '../context/NewsContext';
import { NewsArticle, Entity, RelationshipType } from '../types/news';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Filter, 
  ArrowRight, 
  Layers, 
  Search, 
  Share2, 
  BookOpen, 
  ExternalLink,
  Info,
  Network
} from 'lucide-react';

interface SimNode {
  id: string;
  label: string;
  type: 'article' | 'entity';
  category?: string;
  entityType?: string;
  articleData?: NewsArticle;
  connectionsCount: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface SimEdge {
  id: string;
  source: string;
  target: string;
  type: RelationshipType | 'menciona_entidad';
  label?: string;
}

export const InteractiveGraphView: React.FC = () => {
  const { 
    articles, 
    setCurrentArticle, 
    setActiveView, 
    selectedEntityId, 
    setSelectedEntityId,
    setEditingArticleId 
  } = useNews();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(articles[0]?.id || null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [includeEntities, setIncludeEntities] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState<SimNode | null>(null);

  // Synchronize if selectedEntityId is set externally
  useEffect(() => {
    if (selectedEntityId) {
      setSelectedNodeId(`ent-${selectedEntityId}`);
    }
  }, [selectedEntityId]);

  // Build nodes & edges
  const { nodes, edges } = useMemo(() => {
    const rawNodes: SimNode[] = [];
    const rawEdges: SimEdge[] = [];
    const articleMap = new Map<string, NewsArticle>();
    const entitySet = new Map<string, { entity: Entity; articles: string[] }>();

    // Filter articles by category or search
    const filteredArticles = articles.filter((art) => {
      const matchCat = categoryFilter === 'all' || art.category === categoryFilter;
      const matchSearch =
        !searchQuery ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.dek.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    filteredArticles.forEach((art, idx) => {
      articleMap.set(art.id, art);
      const angle = (idx / filteredArticles.length) * Math.PI * 2;
      const distance = 160 + (idx % 3) * 60;

      rawNodes.push({
        id: art.id,
        label: art.title,
        type: 'article',
        category: art.category,
        articleData: art,
        connectionsCount: (art.connections?.length || 0) + (art.entities?.length || 0),
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        radius: art.featured ? 28 : 22
      });

      // Collect entities
      (art.entities || []).forEach((ent) => {
        const key = ent.id;
        if (!entitySet.has(key)) {
          entitySet.set(key, { entity: ent, articles: [art.id] });
        } else {
          entitySet.get(key)!.articles.push(art.id);
        }
      });

      // Article-to-article connections
      (art.connections || []).forEach((conn) => {
        rawEdges.push({
          id: `${art.id}->${conn.targetArticleId}`,
          source: art.id,
          target: conn.targetArticleId,
          type: conn.relationshipType,
          label: conn.description
        });
      });
    });

    // Optionally add entity nodes
    if (includeEntities) {
      let entIdx = 0;
      entitySet.forEach((val, entId) => {
        // Only include entity if at least one connected article is visible
        const connectedVisible = val.articles.some((aid) => articleMap.has(aid));
        if (connectedVisible) {
          const angle = (entIdx / entitySet.size) * Math.PI * 2 + 0.3;
          const distance = 280 + (entIdx % 2) * 50;
          const nodeKey = `ent-${entId}`;

          rawNodes.push({
            id: nodeKey,
            label: val.entity.name,
            type: 'entity',
            entityType: val.entity.type,
            connectionsCount: val.articles.length,
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            vx: 0,
            vy: 0,
            radius: 16
          });

          val.articles.forEach((aid) => {
            if (articleMap.has(aid)) {
              rawEdges.push({
                id: `${aid}->${nodeKey}`,
                source: aid,
                target: nodeKey,
                type: 'menciona_entidad',
                label: `Menciona a ${val.entity.name}`
              });
            }
          });
          entIdx++;
        }
      });
    }

    return { nodes: rawNodes, edges: rawEdges };
  }, [articles, categoryFilter, searchQuery, includeEntities]);

  // Keep animated simulation reference
  const simNodesRef = useRef<SimNode[]>([]);
  useEffect(() => {
    // Preserve existing positions if possible
    const existing = new Map(simNodesRef.current.map((n) => [n.id, n]));
    simNodesRef.current = nodes.map((n) => {
      const prev = existing.get(n.id);
      if (prev) {
        return { ...n, x: prev.x, y: prev.y, vx: prev.vx, vy: prev.vy };
      }
      return n;
    });
  }, [nodes]);

  // Physics animation loop
  useEffect(() => {
    let animId: number;
    let stepCount = 0;

    const tick = () => {
      const currentNodes = simNodesRef.current;
      const nodeMap = new Map(currentNodes.map((n) => [n.id, n]));

      // 1. Repulsion between nodes
      for (let i = 0; i < currentNodes.length; i++) {
        for (let j = i + 1; j < currentNodes.length; j++) {
          const a = currentNodes[i];
          const b = currentNodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = a.radius + b.radius + 60;
          if (dist < 400) {
            const force = (400 - dist) / 400;
            const push = (force * 1.8) / dist;
            if (a !== draggedNode) {
              a.vx -= dx * push;
              a.vy -= dy * push;
            }
            if (b !== draggedNode) {
              b.vx += dx * push;
              b.vy += dy * push;
            }
          }
        }
      }

      // 2. Attraction along edges
      edges.forEach((edge) => {
        const sourceNode = nodeMap.get(edge.source);
        const targetNode = nodeMap.get(edge.target);
        if (sourceNode && targetNode) {
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const desiredDist = edge.type === 'menciona_entidad' ? 120 : 160;
          const pull = (dist - desiredDist) * 0.003;
          if (sourceNode !== draggedNode) {
            sourceNode.vx += dx * pull;
            sourceNode.vy += dy * pull;
          }
          if (targetNode !== draggedNode) {
            targetNode.vx -= dx * pull;
            targetNode.vy -= dy * pull;
          }
        }
      });

      // 3. Center gravitational pull
      currentNodes.forEach((node) => {
        if (node !== draggedNode) {
          node.vx -= node.x * 0.0015;
          node.vy -= node.y * 0.0015;
          // Apply velocity & damping
          node.x += node.vx;
          node.y += node.vy;
          node.vx *= 0.85;
          node.vy *= 0.85;
        }
      });

      render();
      stepCount++;
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [edges, draggedNode]);

  // Canvas Render function
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    // Center origin + pan + zoom
    ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
    ctx.scale(zoom, zoom);

    const nodeMap = new Map(simNodesRef.current.map((n) => [n.id, n]));
    const activeHoverOrSelected = hoveredNodeId || selectedNodeId;

    // Draw Edges
    edges.forEach((edge) => {
      const src = nodeMap.get(edge.source);
      const tgt = nodeMap.get(edge.target);
      if (!src || !tgt) return;

      const isConnectedToActive =
        activeHoverOrSelected &&
        (edge.source === activeHoverOrSelected || edge.target === activeHoverOrSelected);

      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.lineTo(tgt.x, tgt.y);

      // Color based on relationship type
      if (edge.type === 'antecedente') {
        ctx.strokeStyle = isConnectedToActive ? '#475569' : 'rgba(100, 116, 139, 0.28)';
        ctx.lineWidth = isConnectedToActive ? 2.5 : 1.2;
        ctx.setLineDash([]);
      } else if (edge.type === 'consecuencia') {
        ctx.strokeStyle = isConnectedToActive ? '#2563eb' : 'rgba(37, 99, 235, 0.35)';
        ctx.lineWidth = isConnectedToActive ? 2.5 : 1.5;
        ctx.setLineDash([]);
      } else if (edge.type === 'contrapunto') {
        ctx.strokeStyle = isConnectedToActive ? '#d97706' : 'rgba(217, 119, 6, 0.35)';
        ctx.lineWidth = isConnectedToActive ? 2.5 : 1.5;
        ctx.setLineDash([4, 4]);
      } else if (edge.type === 'investigacion') {
        ctx.strokeStyle = isConnectedToActive ? '#9333ea' : 'rgba(147, 51, 234, 0.35)';
        ctx.lineWidth = isConnectedToActive ? 2.5 : 1.5;
        ctx.setLineDash([]);
      } else if (edge.type === 'mismo_hilo') {
        ctx.strokeStyle = isConnectedToActive ? '#059669' : 'rgba(5, 150, 105, 0.35)';
        ctx.lineWidth = isConnectedToActive ? 2.5 : 1.5;
        ctx.setLineDash([]);
      } else {
        // menciona_entidad
        ctx.strokeStyle = isConnectedToActive ? '#64748b' : 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = isConnectedToActive ? 1.8 : 0.8;
        ctx.setLineDash([2, 4]);
      }

      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw Nodes
    simNodesRef.current.forEach((node) => {
      const isSelected = selectedNodeId === node.id;
      const isHovered = hoveredNodeId === node.id;

      ctx.save();
      ctx.translate(node.x, node.y);

      if (node.type === 'article') {
        // Article Node: Circular broadsheet badge
        ctx.beginPath();
        ctx.arc(0, 0, node.radius, 0, Math.PI * 2);

        // Fill based on category
        let fillColor = '#1c1917';
        if (node.category === 'Clima y Energía') fillColor = '#0f766e'; // teal-700
        else if (node.category === 'Política y Justicia') fillColor = '#1e3a8a'; // blue-900
        else if (node.category === 'Tecnología y Ciencia') fillColor = '#581c87'; // purple-900
        else if (node.category === 'Urbanismo y Sociedad') fillColor = '#b45309'; // amber-700
        else if (node.category === 'Economía') fillColor = '#44403c'; // stone-700

        ctx.fillStyle = fillColor;
        ctx.fill();

        // Stroke
        ctx.lineWidth = isSelected ? 4 : isHovered ? 3 : 2;
        ctx.strokeStyle = isSelected ? '#ffffff' : '#f5f5f4';
        ctx.stroke();

        if (isSelected) {
          ctx.beginPath();
          ctx.arc(0, 0, node.radius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = fillColor;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Inner icon / count
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${node.connectionsCount}`, 0, 0);

      } else {
        // Entity Node: Diamond shape
        const r = node.radius;
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.lineTo(r, 0);
        ctx.lineTo(0, r);
        ctx.lineTo(-r, 0);
        ctx.closePath();

        ctx.fillStyle = isSelected ? '#09090b' : '#f4f4f5';
        ctx.fill();
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.strokeStyle = '#71717a';
        ctx.stroke();

        ctx.fillStyle = isSelected ? '#ffffff' : '#27272a';
        ctx.font = '9px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const typeInitial = node.entityType === 'persona' ? 'P' : node.entityType === 'organizacion' ? 'O' : 'L';
        ctx.fillText(typeInitial, 0, 0);
      }

      // Label below node
      ctx.font = isSelected
        ? 'bold 12px "Playfair Display", Georgia, serif'
        : '500 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const label = node.label.length > 28 ? node.label.substring(0, 26) + '...' : node.label;
      
      // Label background pill
      const metrics = ctx.measureText(label);
      const bgW = metrics.width + 12;
      const bgH = 18;
      ctx.fillStyle = isSelected ? 'rgba(28, 25, 23, 0.95)' : 'rgba(255, 255, 255, 0.88)';
      ctx.fillRect(-bgW / 2, node.radius + 4, bgW, bgH);
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(-bgW / 2, node.radius + 4, bgW, bgH);

      ctx.fillStyle = isSelected ? '#ffffff' : '#1c1917';
      ctx.fillText(label, 0, node.radius + 7);

      ctx.restore();
    });

    ctx.restore();
  };

  // Resize canvas to container
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
        render();
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse interaction coordinates transform
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const x = (clientX - canvas.width / 2 - pan.x) / zoom;
    const y = (clientY - canvas.height / 2 - pan.y) / zoom;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    // Find node clicked
    const clicked = simNodesRef.current.find((n) => {
      const dx = n.x - coords.x;
      const dy = n.y - coords.y;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius + 6;
    });

    if (clicked) {
      setDraggedNode(clicked);
      setSelectedNodeId(clicked.id);
      if (clicked.type === 'entity') {
        const rawEntId = clicked.id.replace('ent-', '');
        setSelectedEntityId(rawEntId);
      }
    } else {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);

    if (draggedNode) {
      draggedNode.x = coords.x;
      draggedNode.y = coords.y;
      draggedNode.vx = 0;
      draggedNode.vy = 0;
      return;
    }

    if (isDraggingCanvas) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      return;
    }

    // Hover detect
    const hovered = simNodesRef.current.find((n) => {
      const dx = n.x - coords.x;
      const dy = n.y - coords.y;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius + 6;
    });

    if (hovered?.id !== hoveredNodeId) {
      setHoveredNodeId(hovered ? hovered.id : null);
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
    setIsDraggingCanvas(false);
  };

  // Selected Node Details
  const selectedNode = simNodesRef.current.find((n) => n.id === selectedNodeId) || simNodesRef.current[0];
  const selectedArticle = selectedNode?.type === 'article' ? selectedNode.articleData : null;

  // Selected Entity Details
  const selectedEntityObj = useMemo<{ entity: Entity | null; articles: NewsArticle[] } | null>(() => {
    if (!selectedNode || selectedNode.type !== 'entity') return null;
    const rawId = selectedNode.id.replace('ent-', '');
    let matchedEntity: Entity | null = null;
    const appearingArticles: NewsArticle[] = [];

    articles.forEach((art) => {
      const found = (art.entities || []).find((e) => e.id === rawId);
      if (found) {
        matchedEntity = found;
        appearingArticles.push(art);
      }
    });

    return { entity: matchedEntity, articles: appearingArticles };
  }, [selectedNode, articles]);

  const handleOpenArticle = (art: NewsArticle) => {
    setCurrentArticle(art);
    setActiveView('article');
  };

  const handleEditConnections = (art: NewsArticle) => {
    setEditingArticleId(art.id);
    setActiveView('editor');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs font-sans uppercase tracking-widest text-stone-500">
            Topología del Conocimiento Periodístico
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Grafo Interactivo de Conexiones
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Explore cómo cada noticia se ancla en antecedentes, genera consecuencias, abre investigaciones judiciales y comparte protagonistas clave.
          </p>
        </div>

        {/* Legend strip */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 bg-white/70 p-2.5 rounded-lg border border-stone-200">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-600 inline-block"></span>
            <span>Consecuencia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-stone-600 inline-block"></span>
            <span>Antecedente</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-amber-600 inline-block"></span>
            <span>Contrapunto</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-purple-600 inline-block"></span>
            <span>Investigación</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rotate-45 border border-stone-500 bg-stone-100 inline-block"></span>
            <span>Entidad clave</span>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-stone-100/80 p-2 rounded-lg border border-stone-200">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar en el grafo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-500 w-44 sm:w-56"
            />
          </div>

          {/* Category filter tabs */}
          <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-stone-200 text-xs">
            {['all', 'Clima y Energía', 'Política y Justicia', 'Tecnología y Ciencia', 'Urbanismo y Sociedad', 'Economía'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-stone-900 text-white font-medium'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat === 'all' ? 'Todas las áreas' : cat.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* View toggles & zoom */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIncludeEntities(!includeEntities)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border transition-colors whitespace-nowrap shrink-0 ${
              includeEntities
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{includeEntities ? 'Entidades: ON' : 'Solo Noticias'}</span>
          </button>

          <div className="flex items-center bg-white border border-stone-300 rounded">
            <button
              onClick={() => setZoom((z) => Math.min(2, z + 0.15))}
              className="p-1.5 hover:bg-stone-100 text-stone-700"
              title="Acercar"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.4, z - 0.15))}
              className="p-1.5 hover:bg-stone-100 text-stone-700 border-l border-stone-200"
              title="Alejar"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1.5 hover:bg-stone-100 text-stone-700 border-l border-stone-200"
              title="Restablecer vista"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace: Canvas + Inspector Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[640px]">
        
        {/* Canvas area (8 cols) */}
        <div 
          ref={containerRef}
          className="lg:col-span-8 bg-stone-900/5 rounded-xl border border-stone-300/80 relative overflow-hidden h-full select-none cursor-grab active:cursor-grabbing"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full block"
          />

          {/* Quick HUD hints */}
          <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-sm text-stone-200 text-[11px] px-3 py-1.5 rounded pointer-events-none flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>Arrastra nodos para reorganizar · Haz clic para inspeccionar conexiones</span>
          </div>

          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-stone-600 text-xs px-2.5 py-1 rounded border border-stone-200 shadow-sm">
            <span>{nodes.length} nodos · {edges.length} enlaces activos</span>
          </div>
        </div>

        {/* Node Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-stone-200 p-5 overflow-y-auto flex flex-col justify-between shadow-xs">
          {selectedArticle ? (
            <div>
              {/* Category & kicker */}
              <div className="text-xs uppercase tracking-wider text-stone-500 font-medium mb-1">
                {selectedArticle.kicker}
              </div>
              <h2 className="text-xl font-serif font-bold text-stone-900 leading-snug mb-2">
                {selectedArticle.title}
              </h2>
              <p className="text-xs text-stone-600 line-clamp-3 mb-4 leading-relaxed font-sans">
                {selectedArticle.dek}
              </p>

              {/* Lead thumbnail */}
              {selectedArticle.imageUrl && (
                <div className="aspect-video w-full rounded-md overflow-hidden mb-4 bg-stone-100 border border-stone-200">
                  <img
                    src={selectedArticle.imageUrl}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Connections breakdown */}
              <div className="border-t border-stone-200 pt-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900 block mb-2">
                  Vínculos Directos ({selectedArticle.connections?.length || 0})
                </span>
                <div className="space-y-2">
                  {(selectedArticle.connections || []).map((conn, idx) => {
                    const target = articles.find((a) => a.id === conn.targetArticleId);
                    if (!target) return null;

                    let badgeColor = 'bg-slate-100 text-slate-800 border-slate-200';
                    if (conn.relationshipType === 'consecuencia') badgeColor = 'bg-blue-50 text-blue-900 border-blue-200';
                    if (conn.relationshipType === 'contrapunto') badgeColor = 'bg-amber-50 text-amber-900 border-amber-200';
                    if (conn.relationshipType === 'investigacion') badgeColor = 'bg-purple-50 text-purple-900 border-purple-200';

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedNodeId(target.id)}
                        className="p-2.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${badgeColor}`}>
                            {conn.relationshipType}
                          </span>
                          <span className="text-stone-400 font-sans">Tocar para centrar</span>
                        </div>
                        <div className="text-xs font-semibold text-stone-900 font-serif leading-tight mb-1">
                          {target.title}
                        </div>
                        <p className="text-[11px] text-stone-600 italic">
                          "{conn.description}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Entities listed */}
              {selectedArticle.entities && selectedArticle.entities.length > 0 && (
                <div className="border-t border-stone-200 pt-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-900 block mb-2">
                    Entidades Vinculadas ({selectedArticle.entities.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedArticle.entities.map((ent) => (
                      <button
                        key={ent.id}
                        onClick={() => setSelectedNodeId(`ent-${ent.id}`)}
                        className="text-xs px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded border border-stone-200/80 font-sans text-left"
                      >
                        <span className="font-medium">{ent.name}</span>
                        {ent.roleInArticle && (
                          <span className="text-[10px] text-stone-500 block">
                            {ent.roleInArticle}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-stone-200">
                <button
                  onClick={() => handleOpenArticle(selectedArticle)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Leer Noticia Completa</span>
                </button>
                <button
                  onClick={() => handleEditConnections(selectedArticle)}
                  className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-semibold uppercase tracking-wider border border-stone-300 transition-colors"
                  title="Editar o tejer nuevos vínculos"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : selectedEntityObj ? (
            <div>
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium mb-1 block">
                Ficha de Entidad ({selectedEntityObj.entity?.type})
              </span>
              <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">
                {selectedEntityObj.entity?.name}
              </h2>
              <p className="text-xs text-stone-600 mb-4">
                Esta entidad actúa como puente informativo apareciendo en{' '}
                <strong className="text-stone-900 font-semibold">
                  {selectedEntityObj.articles.length} noticias
                </strong>.
              </p>

              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900 block">
                  Artículos donde interviene:
                </span>
                {selectedEntityObj.articles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => handleOpenArticle(art)}
                    className="p-3 rounded-lg border border-stone-200 hover:border-stone-400 bg-stone-50 hover:bg-white cursor-pointer transition-all"
                  >
                    <span className="text-[10px] uppercase font-bold text-stone-500">
                      {art.category}
                    </span>
                    <h3 className="text-xs font-serif font-bold text-stone-900 mt-0.5">
                      {art.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-stone-600 mt-2 font-medium">
                      <span>Leer artículo</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-stone-400">
              <Network className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Seleccione cualquier nodo del grafo para examinar sus conexiones.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
