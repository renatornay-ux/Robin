import React, { createContext, useContext, useState, useEffect } from 'react';
import { NewsArticle, StoryThread, ArticleConnection, Entity, RelationshipType } from '../types/news';
import { INITIAL_ARTICLES, INITIAL_THREADS } from '../data/initialNews';

interface NewsContextType {
  articles: NewsArticle[];
  threads: StoryThread[];
  currentArticle: NewsArticle | null;
  setCurrentArticle: (article: NewsArticle | null) => void;
  activeView: 'frontpage' | 'article' | 'graph' | 'threads' | 'entities' | 'editor' | 'guide';
  setActiveView: (view: 'frontpage' | 'article' | 'graph' | 'threads' | 'entities' | 'editor' | 'guide') => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedThreadId: string | null;
  setSelectedThreadId: (threadId: string | null) => void;
  selectedEntityId: string | null;
  setSelectedEntityId: (entityId: string | null) => void;
  editingArticleId: string | null;
  setEditingArticleId: (id: string | null) => void;
  createArticle: (article: Omit<NewsArticle, 'id' | 'slug'>) => string;
  updateArticle: (id: string, updated: Partial<NewsArticle>) => void;
  deleteArticle: (id: string) => void;
  createThread: (thread: Omit<StoryThread, 'id' | 'articleIds'>) => string;
  getArticleById: (id: string) => NewsArticle | undefined;
  getReciprocalConnections: (articleId: string) => Array<{
    article: NewsArticle;
    relationshipType: RelationshipType;
    description: string;
    isIncoming: boolean;
  }>;
  getAllEntities: () => Array<{
    entity: Entity;
    articles: NewsArticle[];
  }>;
  suggestConnections: (text: string, currentId?: string) => NewsArticle[];
  resetToDefaults: () => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

const STORAGE_KEY_ARTICLES = 'nexo_news_articles_v1';
const STORAGE_KEY_THREADS = 'nexo_news_threads_v1';

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ARTICLES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ARTICLES;
  });

  const [threads, setThreads] = useState<StoryThread[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THREADS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_THREADS;
  });

  const [currentArticle, setCurrentArticle] = useState<NewsArticle | null>(() => articles[0] || null);
  const [activeView, setActiveView] = useState<'frontpage' | 'article' | 'graph' | 'threads' | 'entities' | 'editor' | 'guide'>('frontpage');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THREADS, JSON.stringify(threads));
  }, [threads]);

  const getArticleById = (id: string) => {
    return articles.find((a) => a.id === id || a.slug === id);
  };

  const createArticle = (newArt: Omit<NewsArticle, 'id' | 'slug'>): string => {
    const slug = newArt.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `noticia-${Date.now()}`;

    const id = slug;
    const created: NewsArticle = {
      ...newArt,
      id,
      slug
    };

    setArticles((prev) => [created, ...prev]);

    // If assigned to a thread, add to thread
    if (created.threadId) {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === created.threadId
            ? { ...t, articleIds: Array.from(new Set([...t.articleIds, id])) }
            : t
        )
      );
    }

    return id;
  };

  const updateArticle = (id: string, updated: Partial<NewsArticle>) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
    );
    if (currentArticle?.id === id) {
      setCurrentArticle((prev) => (prev ? { ...prev, ...updated } : null));
    }
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    // Remove from threads
    setThreads((prev) =>
      prev.map((t) => ({
        ...t,
        articleIds: t.articleIds.filter((aid) => aid !== id)
      }))
    );
    if (currentArticle?.id === id) {
      setCurrentArticle(null);
      setActiveView('frontpage');
    }
  };

  const createThread = (newThread: Omit<StoryThread, 'id' | 'articleIds'>): string => {
    const id = newThread.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `hilo-${Date.now()}`;

    const threadObj: StoryThread = {
      ...newThread,
      id,
      articleIds: []
    };

    setThreads((prev) => [...prev, threadObj]);
    return id;
  };

  // Reciprocal connection resolution: shows both outgoing AND incoming links!
  const getReciprocalConnections = (articleId: string) => {
    const current = getArticleById(articleId);
    if (!current) return [];

    const outgoing = (current.connections || []).map((conn) => {
      const target = getArticleById(conn.targetArticleId);
      return {
        article: target!,
        relationshipType: conn.relationshipType,
        description: conn.description,
        isIncoming: false
      };
    }).filter((c) => Boolean(c.article));

    // Incoming: other articles that point to this article
    const incoming: Array<{
      article: NewsArticle;
      relationshipType: RelationshipType;
      description: string;
      isIncoming: boolean;
    }> = [];

    articles.forEach((other) => {
      if (other.id === articleId) return;
      (other.connections || []).forEach((conn) => {
        if (conn.targetArticleId === articleId) {
          // Invert or mirror relationship if desired
          let reciprocalType: RelationshipType = 'mismo_hilo';
          if (conn.relationshipType === 'antecedente') reciprocalType = 'consecuencia';
          else if (conn.relationshipType === 'consecuencia') reciprocalType = 'antecedente';
          else if (conn.relationshipType === 'investigacion') reciprocalType = 'investigacion';
          else if (conn.relationshipType === 'contrapunto') reciprocalType = 'contrapunto';

          incoming.push({
            article: other,
            relationshipType: reciprocalType,
            description: `Vinculada desde "${other.title}": ${conn.description}`,
            isIncoming: true
          });
        }
      });
    });

    // Avoid duplicates if bidirectional
    const seen = new Set<string>();
    const all = [...outgoing];
    seen.add(articleId);
    outgoing.forEach(o => seen.add(o.article.id));

    incoming.forEach((inc) => {
      if (!seen.has(inc.article.id)) {
        seen.add(inc.article.id);
        all.push(inc);
      }
    });

    return all;
  };

  // Extract all entities aggregated with their corresponding articles
  const getAllEntities = () => {
    const map = new Map<string, { entity: Entity; articles: NewsArticle[] }>();

    articles.forEach((art) => {
      (art.entities || []).forEach((ent) => {
        const key = ent.name.trim().toLowerCase();
        if (!map.has(key)) {
          map.set(key, { entity: ent, articles: [art] });
        } else {
          const existing = map.get(key)!;
          if (!existing.articles.find((a) => a.id === art.id)) {
            existing.articles.push(art);
          }
        }
      });
    });

    return Array.from(map.values()).sort((a, b) => b.articles.length - a.articles.length);
  };

  // Suggest connections based on shared keywords or entity names in text
  const suggestConnections = (text: string, currentId?: string): NewsArticle[] => {
    if (!text || text.length < 10) return [];
    const lower = text.toLowerCase();
    
    return articles
      .filter((art) => art.id !== currentId)
      .filter((art) => {
        // Check title words
        const titleWords = art.title.toLowerCase().split(/\s+/).filter(w => w.length > 4);
        const matchesTitle = titleWords.some(w => lower.includes(w));
        // Check entities
        const matchesEntity = (art.entities || []).some(ent => lower.includes(ent.name.toLowerCase()));
        return matchesTitle || matchesEntity;
      })
      .slice(0, 4);
  };

  const resetToDefaults = () => {
    setArticles(INITIAL_ARTICLES);
    setThreads(INITIAL_THREADS);
    setCurrentArticle(INITIAL_ARTICLES[0]);
    localStorage.removeItem(STORAGE_KEY_ARTICLES);
    localStorage.removeItem(STORAGE_KEY_THREADS);
  };

  return (
    <NewsContext.Provider
      value={{
        articles,
        threads,
        currentArticle,
        setCurrentArticle,
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        selectedThreadId,
        setSelectedThreadId,
        selectedEntityId,
        setSelectedEntityId,
        editingArticleId,
        setEditingArticleId,
        createArticle,
        updateArticle,
        deleteArticle,
        createThread,
        getArticleById,
        getReciprocalConnections,
        getAllEntities,
        suggestConnections,
        resetToDefaults
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
