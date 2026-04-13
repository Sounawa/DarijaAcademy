'use client';

import { useState, useEffect, useMemo } from 'react';
import { levels } from '@/data/curriculum';
import { useProgressStore } from '@/store/progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Shuffle,
} from 'lucide-react';

interface FlashcardItem {
  french: string;
  arabic: string;
  phonetic: string;
  notes?: string;
  type: 'vocabulary' | 'phrase';
  context?: string;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/* Mini progress dots indicator */
function ProgressDots({
  total,
  current,
  known,
  unknown,
}: {
  total: number;
  current: number;
  known: Set<number>;
  unknown: Set<number>;
}) {
  // Show at most 20 dots, with ellipsis for larger sets
  const maxDots = 20;
  if (total <= maxDots) {
    return (
      <div className="flex items-center justify-center gap-1 mt-6 flex-wrap">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              i === current
                ? 'bg-amber-500 scale-125 ring-2 ring-amber-500/30'
                : known.has(i)
                  ? 'bg-emerald-400 dark:bg-emerald-500'
                  : unknown.has(i)
                    ? 'bg-red-400 dark:bg-red-500'
                    : 'bg-muted'
            }`}
          />
        ))}
      </div>
    );
  }

  // For large sets, show current ± 5 with ellipsis
  const dots: { index: number; type: 'dot' | 'ellipsis' }[] = [];
  const rangeStart = Math.max(0, current - 5);
  const rangeEnd = Math.min(total - 1, current + 5);

  if (rangeStart > 2) {
    dots.push({ index: 0, type: 'dot' }, { index: 1, type: 'ellipsis' } as never);
  }

  for (let i = Math.max(0, rangeStart); i <= rangeEnd; i++) {
    dots.push({ index: i, type: 'dot' });
  }

  if (rangeEnd < total - 3) {
    dots.push({ index: total - 1, type: 'ellipsis' } as never);
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      {dots.map((d, i) => {
        if (d.type === 'ellipsis') {
          return (
            <div key={`ellipsis-${i}`} className="h-2 w-3 flex items-center justify-center">
              <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30" />
              <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30 mx-0.5" />
              <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30" />
            </div>
          );
        }
        return (
          <div
            key={d.index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              d.index === current
                ? 'bg-amber-500 scale-125 ring-2 ring-amber-500/30'
                : known.has(d.index)
                  ? 'bg-emerald-400 dark:bg-emerald-500'
                  : unknown.has(d.index)
                    ? 'bg-red-400 dark:bg-red-500'
                    : 'bg-muted'
            }`}
          />
        );
      })}
    </div>
  );
}

export function FlashcardsView() {
  const { currentLevel, setCurrentView, setCurrentLevel } = useProgressStore();

  const level = levels.find((l) => l.id === currentLevel);

  /* Determine accent color from level */
  const levelColorHex = (() => {
    if (!level) return '#F59E0B';
    const c = level.color;
    if (c.includes('amber')) return '#F59E0B';
    if (c.includes('orange')) return '#F97316';
    if (c.includes('emerald')) return '#10B981';
    if (c.includes('rose')) return '#F43F5E';
    if (c.includes('red')) return '#EF4444';
    if (c.includes('cyan') || c.includes('teal')) return '#1B9AAA';
    if (c.includes('yellow')) return '#EAB308';
    return '#F59E0B';
  })();

  // Build all flashcards from the level
  const allCards: FlashcardItem[] = useMemo(
    () =>
      level
        ? level.lessons.flatMap((lesson) => [
            ...lesson.vocabulary.map((v) => ({
              french: v.french,
              arabic: v.arabic,
              phonetic: v.phonetic,
              notes: v.notes,
              type: 'vocabulary' as const,
            })),
            ...lesson.phrases.map((p) => ({
              french: p.french,
              arabic: p.arabic,
              phonetic: p.phonetic,
              notes: undefined,
              type: 'phrase' as const,
              context: p.context,
            })),
          ])
        : [],
    [level]
  );

  // Initialize with shuffled cards right away (allCards is always populated when this view renders)
  const [shuffledCards, setShuffledCards] = useState<FlashcardItem[]>(() =>
    allCards.length > 0 ? shuffleArray(allCards) : []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<number>>(new Set());

  const shuffleCards = () => {
    const shuffled = shuffleArray(allCards);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setUnknownCards(new Set());
  };

  const currentCard = shuffledCards[currentIndex];
  const totalCards = shuffledCards.length;
  const progressPercent =
    totalCards > 0
      ? ((currentIndex + 1) / totalCards) * 100
      : 0;

  const handleFlip = () => {
    setIsFlipped((f) => !f);
  };

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsFlipped(false);
    }
  };

  const handleKnown = () => {
    setKnownCards((s) => new Set(s).add(currentIndex));
    handleNext();
  };

  const handleUnknown = () => {
    setUnknownCards((s) => new Set(s).add(currentIndex));
    handleNext();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Early return AFTER all hooks
  if (!level || !currentCard || shuffledCards.length === 0) return null;

  const isLast = currentIndex === totalCards - 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrentLevel(currentLevel)}
        className="mb-4"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Niveau {currentLevel}
      </Button>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-extrabold">Flashcards</h1>
          <p className="text-xs text-muted-foreground">
            {level.title} — {totalCards} cartes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-semibold tabular-nums">
            {currentIndex + 1} / {totalCards}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={shuffleCards}
            aria-label="Mélanger"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Progress value={progressPercent} className="mb-8 h-2" />

      {/* Flashcard */}
      <div className="mb-8 flex justify-center">
        <div
          className="flip-card w-full cursor-pointer max-w-lg"
          style={{ minHeight: '280px' }}
          onClick={handleFlip}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={`flip-card-inner flashcard-tilt ${isFlipped ? 'flipped' : ''} flashcard-shadow ${isFlipped ? 'is-flipped' : ''} relative w-full gap-0 overflow-hidden p-0`}
                style={{
                  minHeight: '280px',
                  borderLeft: `3px solid ${levelColorHex}`,
                }}
              >
                {/* Front - Arabic */}
                <div className="flip-card-front absolute inset-0 flex flex-col items-center justify-center p-8">
                  <CardContent className="flex flex-col items-center justify-center p-0">
                    <Badge
                      variant="secondary"
                      className="mb-4 text-[10px]"
                    >
                      {currentCard.type === 'vocabulary' ? '📖 Vocabulaire' : '💬 Phrase'}
                    </Badge>
                    <p className="font-arabic mb-4 text-5xl leading-relaxed shimmer-text-hover dark:text-amber-200">
                      {currentCard.arabic}
                    </p>
                    <p className="mb-2 text-lg font-semibold text-amber-700 dark:text-amber-400 tracking-wide">
                      {currentCard.phonetic}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Cliquez ou appuyez sur Espace pour retourner
                    </p>
                  </CardContent>
                </div>

                {/* Back - French */}
                <div className="flip-card-back absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-8 dark:from-amber-950/30 dark:to-orange-950/30">
                  <CardContent className="flex flex-col items-center justify-center gap-3 p-0">
                    <p className="text-xl font-bold text-foreground">
                      {currentCard.french}
                    </p>
                    {currentCard.notes && (
                      <p className="mt-2 rounded-md bg-white/80 p-2 text-center text-xs text-amber-700 dark:bg-black/20 dark:text-amber-300">
                        💡 {currentCard.notes}
                      </p>
                    )}
                    {currentCard.context && (
                      <p className="mt-1 text-center text-xs text-muted-foreground">
                        📌 {currentCard.context}
                      </p>
                    )}
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress dots */}
      <ProgressDots
        total={totalCards}
        current={currentIndex}
        known={knownCards}
        unknown={unknownCards}
      />

      {/* Navigation */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          aria-label="Carte précédente"
          className="transition-all duration-200 hover:shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex gap-3">
          <Button
            onClick={handleUnknown}
            variant="outline"
            className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:shadow-sm dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:border-red-700"
          >
            <ThumbsDown className="h-4 w-4" />
            <span className="hidden sm:inline">À revoir</span>
          </Button>
          <Button
            onClick={handleKnown}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 hover:shadow-md hover:shadow-emerald-600/30 transition-all duration-200"
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="hidden sm:inline">Je connais</span>
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={isLast}
          aria-label="Carte suivante"
          className="transition-all duration-200 hover:shadow-sm"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Stats */}
      {(knownCards.size > 0 || unknownCards.size > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className="gap-0 p-0">
            <CardContent className="flex items-center justify-around p-4">
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {knownCards.size}
                </p>
                <p className="text-xs text-muted-foreground">Connues</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {unknownCards.size}
                </p>
                <p className="text-xs text-muted-foreground">À revoir</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-lg font-bold text-muted-foreground">
                  {totalCards - knownCards.size - unknownCards.size}
                </p>
                <p className="text-xs text-muted-foreground">Restantes</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Completion */}
      {isLast && (knownCards.size + unknownCards.size) === totalCards && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <Card className="gap-4 border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
            <CardContent className="p-6">
              <p className="mb-1 text-3xl">🎉</p>
              <h3 className="mb-2 text-lg font-bold">Toutes les cartes vues !</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {knownCards.size} connues sur {totalCards} cartes
              </p>
              <Button onClick={shuffleCards} className="gap-2 btn-primary-glow">
                <RotateCcw className="h-4 w-4" />
                Recommencer
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>⌨️ Raccourcis :</span>
        <span><kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] shadow-sm">Espace</kbd> retourner</span>
        <span><kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] shadow-sm">←</kbd> <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] shadow-sm">→</kbd> naviguer</span>
      </div>
    </motion.div>
  );
}
