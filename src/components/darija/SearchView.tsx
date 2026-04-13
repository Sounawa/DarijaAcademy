'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { levels, type VocabularyItem, type Phrase } from '@/data/curriculum';
import { useProgressStore } from '@/store/progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  X,
  BookOpen,
  MessageSquare,
  ChevronRight,
  Languages,
} from 'lucide-react';

type FilterType = 'all' | 'vocabulary' | 'phrases';

interface SearchResult {
  type: 'vocabulary' | 'phrase';
  item: VocabularyItem | Phrase;
  lessonId: string;
  lessonTitle: string;
  lessonTitleAr: string;
  levelId: number;
  levelTitle: string;
  levelColor: string;
}

export function SearchView() {
  const { setCurrentView, setCurrentLevel, setCurrentLesson } = useProgressStore();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the search input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Search across all curriculum data
  const results = useMemo(() => {
    if (!query.trim()) return [];

    const normalizedQuery = query.trim().toLowerCase();
    const found: SearchResult[] = [];

    for (const level of levels) {
      for (const lesson of level.lessons) {
        // Search vocabulary
        if (filter === 'all' || filter === 'vocabulary') {
          for (const item of lesson.vocabulary) {
            const matches =
              item.french.toLowerCase().includes(normalizedQuery) ||
              item.phonetic.toLowerCase().includes(normalizedQuery) ||
              item.arabic.includes(normalizedQuery);
            if (matches) {
              found.push({
                type: 'vocabulary',
                item,
                lessonId: lesson.id,
                lessonTitle: lesson.title,
                lessonTitleAr: lesson.titleAr,
                levelId: level.id,
                levelTitle: level.title,
                levelColor: level.color,
              });
            }
          }
        }

        // Search phrases
        if (filter === 'all' || filter === 'phrases') {
          for (const item of lesson.phrases) {
            const matches =
              item.french.toLowerCase().includes(normalizedQuery) ||
              item.phonetic.toLowerCase().includes(normalizedQuery) ||
              item.arabic.includes(normalizedQuery) ||
              (item.context && item.context.toLowerCase().includes(normalizedQuery));
            if (matches) {
              found.push({
                type: 'phrase',
                item,
                lessonId: lesson.id,
                lessonTitle: lesson.title,
                lessonTitleAr: lesson.titleAr,
                levelId: level.id,
                levelTitle: level.title,
                levelColor: level.color,
              });
            }
          }
        }
      }
    }

    return found;
  }, [query, filter]);

  // Group results by level
  const groupedResults = useMemo(() => {
    const groups: Record<number, SearchResult[]> = {};
    for (const result of results) {
      if (!groups[result.levelId]) {
        groups[result.levelId] = [];
      }
      groups[result.levelId].push(result);
    }
    // Sort levels numerically
    return Object.entries(groups)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([levelId, items]) => ({
        levelId: Number(levelId),
        levelTitle: items[0].levelTitle,
        levelColor: items[0].levelColor,
        results: items,
      }));
  }, [results]);

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      setCurrentLevel(result.levelId);
      setCurrentLesson(result.lessonId);
    },
    [setCurrentLevel, setCurrentLesson]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, []);

  const handleBack = useCallback(() => {
    setCurrentView('home');
  }, [setCurrentView]);

  const vocabCount = results.filter((r) => r.type === 'vocabulary').length;
  const phraseCount = results.filter((r) => r.type === 'phrase').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-4xl"
    >
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Accueil
      </Button>

      {/* Search Header */}
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-extrabold md:text-3xl">
          <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Rechercher
          </span>{' '}
          dans les leçons
        </h1>
        <p className="text-sm text-muted-foreground">
          Cherchez un mot, une expression ou une phrase dans les 38 leçons
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-4 search-glow rounded-lg">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tapez en français ou arabe..."
          className="h-12 pl-11 pr-24 text-base shadow-sm transition-all duration-300"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-7 w-7"
              aria-label="Effacer"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
          <Badge
            variant="secondary"
            className="hidden border-border/50 text-[10px] text-muted-foreground sm:inline-flex"
          >
            <kbd className="font-mono">⌘</kbd>K
          </Badge>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)} className="mb-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="all" className="flex-1 gap-1.5 sm:flex-initial">
            <Languages className="h-3.5 w-3.5" />
            Tout
            {query && results.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px]">
                {results.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="vocabulary" className="flex-1 gap-1.5 sm:flex-initial">
            <BookOpen className="h-3.5 w-3.5" />
            Vocabulaire
            {query && vocabCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px]">
                {vocabCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="phrases" className="flex-1 gap-1.5 sm:flex-initial">
            <MessageSquare className="h-3.5 w-3.5" />
            Phrases
            {query && phraseCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px]">
                {phraseCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Results */}
      <AnimatePresence mode="wait">
        {query.trim() && (
          <motion.div
            key={`${query}-${filter}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {results.length > 0 ? (
              <div className="space-y-6">
                {/* Result count */}
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{results.length}</span>{' '}
                  résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
                </p>

                {/* Grouped by level */}
                {groupedResults.map((group) => (
                  <div key={group.levelId} className="space-y-3">
                    {/* Level header */}
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${group.levelColor}`} />
                      <h2 className="text-sm font-bold">
                        Niveau {group.levelId} — {group.levelTitle}
                      </h2>
                      <Badge variant="outline" className="text-[10px]">
                        {group.results.length}
                      </Badge>
                    </div>

                    {/* Results within level */}
                    <div className="space-y-2">
                      {group.results.map((result, index) => (
                        <motion.div
                          key={`${result.lessonId}-${result.type}-${index}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: index * 0.03,
                            duration: 0.25,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <Card
                            className="cursor-pointer gap-0 py-0 transition-all hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700 card-glow-border"
                            onClick={() => handleResultClick(result)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                {/* Type indicator */}
                                <div
                                  className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                    result.type === 'vocabulary'
                                      ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                                      : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                                  }`}
                                >
                                  {result.type === 'vocabulary' ? (
                                    <BookOpen className="h-4 w-4" />
                                  ) : (
                                    <MessageSquare className="h-4 w-4" />
                                  )}
                                </div>

                                {/* Content */}
                                <div className="min-w-0 flex-1">
                                  {/* Arabic */}
                                  <div className="mb-1">
                                    <span className="font-arabic text-xl leading-relaxed dark:text-amber-200">
                                      {result.item.arabic}
                                    </span>
                                  </div>

                                  {/* French */}
                                  <p className="mb-2 text-sm font-medium text-foreground">
                                    {result.item.french}
                                  </p>

                                  {/* Notes or Context */}
                                  {result.type === 'vocabulary' && result.item.notes && (
                                    <p className="mb-2 text-xs text-muted-foreground">
                                      💡 {(result.item as VocabularyItem).notes}
                                    </p>
                                  )}
                                  {result.type === 'phrase' && result.item.context && (
                                    <p className="mb-2 text-xs text-muted-foreground">
                                      📌 {(result.item as Phrase).context}
                                    </p>
                                  )}

                                  {/* Lesson breadcrumb */}
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Badge
                                      variant="outline"
                                      className="h-5 gap-1 border-border/50 px-2 text-[10px] font-normal"
                                    >
                                      Leçon {result.lessonId}
                                    </Badge>
                                    <ChevronRight className="h-3 w-3" />
                                    <span className="truncate">{result.lessonTitle}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* No results state */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-16 text-center empty-state-gradient rounded-2xl"
              >
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/50 empty-state-float">
                  <Search className="h-8 w-8 text-amber-500 dark:text-amber-400" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground empty-state-text">
                  Aucun résultat trouvé
                </h3>
                <p className="max-w-sm text-sm text-muted-foreground empty-state-text">
                  Essayez de chercher en français, en arabe latinisé (ex: &quot;7arf&quot;, &quot;salam&quot;), ou directement en arabe.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {['salam', '7arf', 'bghit', 'kifash', 'سَلَام'].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setQuery(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Empty state - no query yet */}
        {!query.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950/50 dark:to-orange-950/50 empty-state-float">
              <Languages className="h-8 w-8 text-amber-500 dark:text-amber-400" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">
              Explorez le vocabulaire
            </h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              Recherchez parmi plus de 600 mots et 200 phrases à travers les 38 leçons.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'salam',
                'bonjour',
                'bghit',
                'merci',
                'kifash',
                '7arf',
                'shukran',
                'ma-3raftch',
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setQuery(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
