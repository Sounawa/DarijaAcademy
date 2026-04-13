'use client';

import { useState, useMemo } from 'react';
import { levels, type VocabularyItem, type Level, type Lesson } from '@/data/curriculum';
import { useProgressStore } from '@/store/progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Shuffle, Sparkles } from 'lucide-react';

interface WordSource {
  levelId: number;
  lessonIndex: number;
  vocabIndex: number;
  levelTitle: string;
  lessonTitle: string;
  lessonId: string;
}

interface WordEntry {
  item: VocabularyItem;
  source: WordSource;
}

function getAllVocabWords(): WordEntry[] {
  const words: WordEntry[] = [];
  for (const level of levels) {
    for (let li = 0; li < level.lessons.length; li++) {
      const lesson = level.lessons[li];
      for (let vi = 0; vi < lesson.vocabulary.length; vi++) {
        words.push({
          item: lesson.vocabulary[vi],
          source: {
            levelId: level.id,
            lessonIndex: li,
            vocabIndex: vi,
            levelTitle: level.title,
            lessonTitle: lesson.title,
            lessonId: lesson.id,
          },
        });
      }
    }
  }
  return words;
}

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function WordOfDay() {
  const [overrideIndex, setOverrideIndex] = useState<number | null>(null);
  const { setCurrentLevel, setCurrentLesson } = useProgressStore();

  const allWords = useMemo(() => getAllVocabWords(), []);

  const currentIndex = useMemo(() => {
    if (overrideIndex !== null) return overrideIndex;
    return getDayOfYear() % allWords.length;
  }, [allWords.length, overrideIndex]);

  const word = allWords[currentIndex];

  if (!word) return null;

  const { item, source } = word;

  const handleGoToLesson = () => {
    setCurrentLevel(source.levelId);
    setCurrentLesson(source.lessonId);
  };

  const handleShuffle = () => {
    let newIndex: number;
    do {
      newIndex = Math.floor(Math.random() * allWords.length);
    } while (newIndex === currentIndex && allWords.length > 1);
    setOverrideIndex(newIndex);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mb-12"
    >
      <Card className="relative overflow-hidden border-2 border-white/20 shadow-lg animate-breathing-border">
        {/* Moroccan-inspired gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 dark:from-amber-700 dark:via-orange-700 dark:to-rose-700" />
        {/* Subtle Moroccan pattern overlay */}
        <div className="moroccan-pattern absolute inset-0 opacity-10" />
        {/* Shimmer effect */}
        <div
          className="absolute inset-0 animate-shimmer pointer-events-none"
          style={{
            background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.1) 37%, transparent 63%)',
            backgroundSize: '200% 100%',
          }}
        />
        {/* Decorative circles */}
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />

        <CardContent className="relative z-10 p-6 md:p-8">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5 text-yellow-200" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                ✨ Mot du jour
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShuffle}
              className="gap-1.5 text-white/80 hover:bg-white/15 hover:text-white"
            >
              <Shuffle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">Changer</span>
            </Button>
          </div>

          {/* Word Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {/* Arabic text */}
              <p className="mb-3 font-arabic text-4xl font-bold leading-relaxed text-white drop-shadow-sm md:text-5xl shimmer-text-hover">
                {item.arabic}
              </p>

              {/* Latin transcription */}
              <p className="mb-2 text-xl font-bold text-white tracking-wide drop-shadow-sm md:text-2xl">
                {item.phonetic}
              </p>

              {/* French translation */}
              <p className="mb-3 text-xl font-bold text-white md:text-2xl">
                {item.french}
              </p>

              {/* Notes */}
              {item.notes && (
                <p className="mx-auto mb-4 max-w-md rounded-lg bg-white/15 px-4 py-2 text-sm text-white/90 backdrop-blur-sm">
                  💡 {item.notes}
                </p>
              )}

              {/* Source info */}
              <div className="mb-4 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Badge className="border-0 bg-white/20 text-[11px] text-white backdrop-blur-sm">
                    {source.lessonId}
                  </Badge>
                  <span className="text-xs text-white/70">
                    {source.levelTitle} → {source.lessonTitle}
                  </span>
                </div>
              </div>

              {/* Action button */}
              <Button
                onClick={handleGoToLesson}
                className="gap-2 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 btn-primary-glow"
              >
                <BookOpen className="h-4 w-4" />
                Voir la leçon
              </Button>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
