export type RelationshipType = 
  | 'antecedente'        // Contexto previo o causa histórica
  | 'consecuencia'       // Efecto, réplica o desenlace directo
  | 'contrapunto'        // Perspectiva opuesta, desmentido o visión alternativa
  | 'investigacion'      // Análisis profundo o filtración de datos relacionada
  | 'mismo_hilo';        // Siguiente o anterior entrega de una misma cobertura

export interface ArticleConnection {
  targetArticleId: string;
  relationshipType: RelationshipType;
  description: string;
}

export type EntityType = 'persona' | 'organizacion' | 'lugar' | 'concepto';

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  roleInArticle?: string;
}

export interface StoryThread {
  id: string;
  title: string;
  dek: string;
  category: string;
  status: 'en_desarrollo' | 'concluido' | 'archivado';
  articleIds: string[];
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  kicker: string;
  dek: string;
  content: string;
  category: 'Clima y Energía' | 'Política y Justicia' | 'Tecnología y Ciencia' | 'Urbanismo y Sociedad' | 'Economía';
  imageUrl: string;
  imageCaption: string;
  author: {
    name: string;
    role: string;
    location: string;
  };
  publishedAt: string;
  readTime: string;
  threadId?: string;
  threadOrder?: number;
  connections: ArticleConnection[];
  entities: Entity[];
  featured?: boolean;
  sources?: { title: string; type: string }[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'article' | 'entity';
  category?: string;
  entityType?: EntityType;
  articleId?: string;
  connectionsCount: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: RelationshipType | 'menciona_entidad';
  label?: string;
}
