'use client';

import { useMemo } from 'react';
import { levels, type VocabularyItem } from '@/data/curriculum';
import { useProgressStore } from '@/store/progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, BookOpen, Trash2 } from 'lucide-react';

interface BookmarkedWord {
  item: VocabularyItem;
  levelId: number;
  lessonIndex: number;
  vocabIndex: number;
  lessonTitle: string;
  levelTitle: string;
  lessonId: string;
}

function parseBookmarkKey(key: string): {
  levelId: number;
  lessonIndex: number;
  vocabIndex: number;
} {
  const parts = key.split('-');
  return {
    levelId: parseInt(parts[0], 10),
    lessonIndex: parseInt(parts[1], 10),
    vocabIndex: parseInt(parts[2], 10),
  };
}

export function BookmarksView() {
  const {
    bookmarkedVocab,
    toggleBookmark,
    clearBookmarks,
    setCurrentLevel,
    setCurrentLesson,
  } = useProgressStore();

  const bookmarkedWords = useMemo(() => {
    const words: BookmarkedWord[] = [];

    for (const key of bookmarkedVocab) {
      const { levelId, lessonIndex, vocabIndex } = parseBookmarkKey(key);
      const level = levels.find((l) => l.id === levelId);
      if (!level) continue;
      const lesson = level.lessons[lessonIndex];
      if (!lesson) continue;
      const vocab = lesson.vocabulary[vocabIndex];
      if (!vocab) continue;

      words.push({
        item: vocab,
        levelId,
        lessonIndex,
        vocabIndex,
        lessonTitle: lesson.title,
        levelTitle: level.title,
        lessonId: lesson.id,
      });
    }

    return words;
  }, [bookmarkedVocab]);

  const handleGoToLesson = (levelId: number, lessonId: string) => {
    setCurrentLevel(levelId);
    setCurrentLesson(lessonId);
  };

  const handleRemoveBookmark = (key: string) => {
    toggleBookmark(key);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => useProgressStore.getState().setCurrentView('home')}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Accueil
            </Button>
          </div>
          <h1 className="text-xl font-extrabold md:text-2xl">
            <Heart className="mb-1 mr-2 inline-block h-6 w-6 text-rose-500" />
            Mes favoris
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {bookmarkedWords.length > 0
              ? `${bookmarkedWords.length} mot${bookmarkedWords.length > 1 ? 's' : ''} enregistré${bookmarkedWords.length > 1 ? 's' : ''}`
              : 'Retrouvez ici vos mots favoris'}
          </p>
        </div>

        {bookmarkedWords.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearBookmarks}
            className="gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/30"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Tout effacer
          </Button>
        )}
      </div>

      {/* Bookmarked words grid */}
      {bookmarkedWords.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-muted-foreground/20 py-16 text-center empty-state-gradient"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/30 empty-state-float">
            <Heart className="h-8 w-8 text-rose-300 dark:text-rose-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold empty-state-text">Aucun favori</h3>
          <p className="max-w-sm text-sm text-muted-foreground empty-state-text">
            Cliquez sur l&apos;icône cœur dans les fiches de vocabulaire pour
            ajouter des mots à vos favoris. Vous pourrez les réviser ici à tout moment !
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AnimatePresence>
            {bookmarkedWords.map((word, index) => {
              const bookmarkKey = `${word.levelId}-${word.lessonIndex}-${word.vocabIndex}`;
              return (
                <motion.div
                  key={bookmarkKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                >
                  <Card className="vocab-card-lift vocab-accent-stripe card-glow-border gap-0 overflow-hidden py-0 transition-shadow hover:shadow-lg">
                    <CardContent className="p-0">
                      {/* Header row with source info and remove button */}
                      <div className="flex items-center justify-between px-4 pt-3 pb-1">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[10px]">
                            {word.lessonId}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {word.levelTitle}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveBookmark(bookmarkKey);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-rose-500 transition-all hover:bg-rose-50 hover:scale-110 dark:hover:bg-rose-950/30"
                          aria-label="Retirer des favoris"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                      </div>

                      {/* Arabic text area */}
                      <div className="relative bg-gradient-to-b from-amber-50/50 to-transparent px-4 pt-2 pb-2 dark:from-amber-950/20">
                        <p className="font-arabic mb-1 text-center text-3xl leading-relaxed dark:text-amber-200">
                          {word.item.arabic}
                        </p>
                        {/* Latin transcription */}
                        <p className="text-center text-base font-semibold text-amber-700 dark:text-amber-400 tracking-wide">
                          {word.item.phonetic}
                        </p>
                      </div>

                      {/* French */}
                      <div
                        className="cursor-pointer px-4 pb-4 pt-2"
                        onClick={() =>
                          handleGoToLesson(word.levelId, word.lessonId)
                        }
                      >
                        <p className="text-center text-sm font-medium text-foreground">
                          {word.item.french}
                        </p>

                        {/* Notes */}
                        {word.item.notes && (
                          <p className="mt-2 rounded-md bg-amber-50 p-2 text-center text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                            💡 {word.item.notes}
                          </p>
                        )}

                        {/* Go to lesson hint */}
                        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                          <BookOpen className="h-3 w-3" />
                          <span>{word.lessonTitle}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
