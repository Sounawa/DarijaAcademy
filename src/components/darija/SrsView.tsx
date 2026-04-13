'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { levels } from '@/data/curriculum';
import { useProgressStore } from '@/store/progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Brain,
  Home,
  Sparkles,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';

/* Build a lookup map for vocab items by key (lessonId-vocabIndex) */
interface VocabLookup {
  [key: string]: { french: string; arabic: string; notes?: string; lessonTitle: string };
}

function buildVocabLookup(): VocabLookup {
  const lookup: VocabLookup = {};
  for (const level of levels) {
    for (const lesson of level.lessons) {
      lesson.vocabulary.forEach((v, idx) => {
        lookup[`${lesson.id}-${idx}`] = {
          french: v.french,
          arabic: v.arabic,
          notes: v.notes,
          lessonTitle: lesson.title,
        };
      });
    }
  }
  return lookup;
}

const vocabLookup = buildVocabLookup();

/* SRS rating options */
const SRS_RATINGS = [
  { quality: 1, label: 'À revoir', emoji: '🔴', color: 'border-red-300 bg-red-50 hover:bg-red-100 dark:border-red-700 dark:bg-red-950/40 dark:hover:bg-red-950/60', shortcut: '1' },
  { quality: 3, label: 'Difficile', emoji: '🟠', color: 'border-orange-300 bg-orange-50 hover:bg-orange-100 dark:border-orange-700 dark:bg-orange-950/40 dark:hover:bg-orange-950/60', shortcut: '2' },
  { quality: 4, label: 'Bon', emoji: '🟢', color: 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60', shortcut: '3' },
  { quality: 5, label: 'Facile', emoji: '🔵', color: 'border-amber-300 bg-amber-50 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/40 dark:hover:bg-amber-950/60', shortcut: '4' },
];

export function SrsView() {
  const {
    srsData,
    getSrsDueItems,
    getSrsStats,
    updateSrsItem,
    setCurrentView,
  } = useProgressStore();

  const dueKeys = useMemo(() => getSrsDueItems(), [srsData, getSrsDueItems]);
  const stats = useMemo(() => getSrsStats(), [srsData, getSrsStats]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [reviewResults, setReviewResults] = useState<{ key: string; quality: number }[]>([]);
  const [started, setStarted] = useState(false);

  const currentItem = dueKeys[currentIndex];
  const vocab = currentItem ? vocabLookup[currentItem] : null;

  const handleFlip = useCallback(() => {
    setIsFlipped((f) => !f);
  }, []);

  const handleRate = useCallback(
    (quality: number) => {
      if (!currentItem) return;
      updateSrsItem(currentItem, quality);
      setReviewedCount((c) => c + 1);
      setReviewResults((r) => [...r, { key: currentItem, quality }]);

      if (currentIndex + 1 >= dueKeys.length) {
        setIsCompleted(true);
      } else {
        setCurrentIndex((i) => i + 1);
        setIsFlipped(false);
      }
    },
    [currentItem, currentIndex, dueKeys.length, updateSrsItem]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!started || isCompleted) return;
      if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        handleFlip();
      }
      if (isFlipped) {
        if (e.key === '1') handleRate(1);
        if (e.key === '2') handleRate(3);
        if (e.key === '3') handleRate(4);
        if (e.key === '4') handleRate(5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [started, isCompleted, isFlipped, handleFlip, handleRate]);

  const handleStartReview = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
    setReviewedCount(0);
    setReviewResults([]);
    setStarted(true);
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
    setReviewedCount(0);
    setReviewResults([]);
  };

  const progressPercent = dueKeys.length > 0 ? Math.round((reviewedCount / dueKeys.length) * 100) : 0;

  // ═══ Empty State ═══
  if (dueKeys.length === 0 && !isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center py-16"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentView('home')}
          className="mb-8 self-start"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour
        </Button>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="text-7xl mb-6"
        >
          🧠
        </motion.div>

        <h1 className="mb-3 text-2xl font-extrabold text-center">Révision espacée</h1>
        <p className="mb-2 text-muted-foreground text-center max-w-md">
          Aucune carte à réviser !
        </p>
        <p className="mb-8 text-sm text-muted-foreground text-center max-w-md">
          Complétez des leçons pour ajouter du vocabulaire à votre programme de révision espacée.
        </p>

        {stats.total > 0 && (
          <Card className="mb-8 w-full max-w-sm">
            <CardContent className="flex items-center justify-around p-4">
              <div className="text-center">
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{stats.learning}</p>
                <p className="text-xs text-muted-foreground">En cours</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{stats.mastered}</p>
                <p className="text-xs text-muted-foreground">Maîtrisées</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-lg font-bold text-muted-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          onClick={() => setCurrentView('home')}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Explorer les niveaux
        </Button>
      </motion.div>
    );
  }

  // ═══ Completion Screen ═══
  if (isCompleted) {
    const successCount = reviewResults.filter((r) => r.quality >= 3).length;
    const failCount = reviewResults.filter((r) => r.quality < 3).length;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center py-8"
      >
        <Card className="w-full max-w-lg gap-6 text-center overflow-hidden">
          <CardContent className="p-6 pt-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
              className="mb-4"
            >
              <div className="text-7xl">
                {successCount === reviewResults.length ? '🏆' : successCount > failCount ? '🌟' : '📚'}
              </div>
            </motion.div>

            <h2 className="mb-2 text-2xl font-extrabold">Révision terminée !</h2>
            <p className="mb-6 text-muted-foreground">
              {successCount === reviewResults.length
                ? 'Parfait ! Toutes les cartes sont maîtrisées !'
                : `${successCount} carte(s) réussie(s) sur ${reviewResults.length}`}
            </p>

            <div className="mb-6 inline-flex items-center gap-4 rounded-2xl bg-amber-50 p-5 dark:bg-amber-950/30">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                  {successCount}/{reviewResults.length}
                </p>
                <p className="text-sm text-muted-foreground">cartes réussies</p>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/30">
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{successCount}</p>
                <p className="text-xs text-muted-foreground">Réussites</p>
              </div>
              <div className="rounded-xl bg-red-50 p-3 dark:bg-red-950/30">
                <p className="text-lg font-bold text-red-600 dark:text-red-400">{failCount}</p>
                <p className="text-xs text-muted-foreground">À revoir</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950/30">
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{stats.mastered}</p>
                <p className="text-xs text-muted-foreground">Maîtrisées</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={handleRestart} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Voir l&apos;état
              </Button>
              <Button onClick={() => setCurrentView('home')} className="gap-2">
                <Home className="h-4 w-4" />
                Retour
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // ═══ Mode Selection Screen ═══
  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentView('home')}
          className="mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour
        </Button>

        <div className="mb-6">
          <h1 className="text-xl font-extrabold">Révision espacée</h1>
          <p className="text-xs text-muted-foreground">Système SM-2 pour une mémorisation durable</p>
        </div>

        {/* Stats overview */}
        <div className="mb-6 grid grid-cols-4 gap-3">
          {[
            { label: 'À réviser', value: stats.due, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
            { label: 'En cours', value: stats.learning, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30' },
            { label: 'Maîtrisées', value: stats.mastered, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
            { label: 'Total', value: stats.total, color: 'text-foreground', bg: 'bg-muted/50' },
          ].map((s) => (
            <Card key={s.label} className={`gap-0 p-0 ${s.bg} border-0`}>
              <CardContent className="p-3 text-center">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Due cards preview */}
        <Card className="mb-6 gap-0 p-0">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                Cartes à réviser aujourd&apos;hui
              </h3>
              <Badge variant="outline" className="text-xs">
                {dueKeys.length} carte{dueKeys.length > 1 ? 's' : ''}
              </Badge>
            </div>

            <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2">
              {dueKeys.slice(0, 20).map((key) => {
                const item = vocabLookup[key];
                const srs = srsData[key];
                if (!item) return null;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 rounded-lg border border-border/50 p-2.5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30">
                      <span className="font-arabic text-sm dark:text-amber-200">{item.arabic}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.french}</p>
                    </div>
                    {srs && (
                      <Badge
                        variant="secondary"
                        className={`shrink-0 text-[10px] ${
                          srs.repetitions >= 5 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                          srs.repetitions > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                          'bg-muted text-muted-foreground'
                        }`}
                      >
                        {srs.repetitions >= 5 ? 'Avancé' : srs.repetitions > 0 ? 'En cours' : 'Nouveau'}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>

            {dueKeys.length > 20 && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                et {dueKeys.length - 20} autre(s)...
              </p>
            )}
          </CardContent>
        </Card>

        {/* Start button */}
        <Button onClick={handleStartReview} className="w-full gap-2 text-base">
          <Brain className="h-5 w-5" />
          Commencer la révision ({dueKeys.length})
          <ChevronRight className="h-4 w-4" />
        </Button>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          ⌨️ <kbd className="rounded border px-1.5 py-0.5 font-mono text-[10px]">Espace</kbd> pour retourner &middot;
          <kbd className="rounded border px-1.5 py-0.5 font-mono text-[10px]">1-4</kbd> pour noter après retournement
        </p>
      </motion.div>
    );
  }

  // ═══ Active Review Session ═══
  const remaining = dueKeys.length - reviewedCount;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-extrabold">Révision espacée</h1>
          <p className="text-xs text-muted-foreground">
            {remaining} carte{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {reviewedCount}/{dueKeys.length}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRestart}
            aria-label="Arrêter"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Progress value={progressPercent} className="mb-8 h-2" />

      {/* Flashcard */}
      <div className="mb-8 flex justify-center">
        <div
          className="flip-card w-full cursor-pointer max-w-lg"
          style={{ minHeight: '320px' }}
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
                className={`flip-card-inner ${isFlipped ? 'flipped' : ''} flashcard-shadow ${isFlipped ? 'is-flipped' : ''} relative w-full gap-0 overflow-hidden p-0`}
                style={{
                  minHeight: '320px',
                  borderLeft: '3px solid #DAA520',
                }}
              >
                {/* Front - Arabic */}
                <div className="flip-card-front absolute inset-0 flex flex-col items-center justify-center p-8">
                  <CardContent className="flex flex-col items-center justify-center p-0">
                    {vocab?.lessonTitle && (
                      <Badge variant="secondary" className="mb-4 text-[10px]">
                        📖 {vocab.lessonTitle}
                      </Badge>
                    )}
                    <p className="font-arabic mb-4 text-5xl leading-relaxed dark:text-amber-200">
                      {vocab?.arabic ?? ''}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Appuyez ou Espace pour retourner
                    </p>
                  </CardContent>
                </div>

                {/* Back - French */}
                <div className="flip-card-back absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-8 dark:from-amber-950/30 dark:to-orange-950/30">
                  <CardContent className="flex flex-col items-center justify-center gap-3 p-0">
                    <p className="text-xl font-bold text-foreground">
                      {vocab?.french ?? ''}
                    </p>
                    {vocab?.notes && (
                      <p className="mt-2 rounded-md bg-white/80 p-2 text-center text-xs text-amber-700 dark:bg-black/20 dark:text-amber-300">
                        💡 {vocab.notes}
                      </p>
                    )}
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Rating Buttons */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Comment évaluez-vous votre mémoire ?
            </p>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {SRS_RATINGS.map((rating) => (
                <Button
                  key={rating.quality}
                  variant="outline"
                  className={`flex flex-col items-center gap-1.5 py-4 border-2 ${rating.color} transition-all duration-200 active:scale-[0.97]`}
                  onClick={() => handleRate(rating.quality)}
                >
                  <span className="text-xl">{rating.emoji}</span>
                  <span className="text-xs font-semibold">{rating.label}</span>
                  <kbd className="hidden sm:inline-block rounded border border-current/20 px-1 py-0.5 font-mono text-[10px] opacity-60">
                    {rating.shortcut}
                  </kbd>
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hint when not flipped */}
      {!isFlipped && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          ⌨️ <kbd className="rounded border px-1.5 py-0.5 font-mono text-[10px]">Espace</kbd> pour retourner la carte
        </p>
      )}
    </motion.div>
  );
}
