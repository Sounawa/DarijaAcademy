'use client';

import { levels } from '@/data/curriculum';
import { useProgressStore } from '@/store/progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Lightbulb,
  FileText,
  MessageSquare,
  CheckCircle2,
  Heart,
  ChevronLeft,
  ChevronRight,
  StickyNote,
} from 'lucide-react';
import { useEffect, useCallback, useRef, useState } from 'react';
import { LessonNotes } from '@/components/darija/LessonNotes';
import { AudioButton } from '@/components/darija/AudioButton';

export function LessonView() {
  const {
    currentLevel,
    currentLesson,
    setCurrentView,
    setCurrentLevel,
    setCurrentLesson,
    completeLesson,
    completedLessons,
    toggleBookmark,
    isBookmarked,
  } = useProgressStore();

  /* Reading progress indicator */
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const parent = container.closest('.overflow-y-auto') || window;
    const handleScroll = () => {
      const scrollTop = parent instanceof Window ? parent.scrollY : (parent as HTMLElement).scrollTop;
      const scrollHeight = parent instanceof Window ? document.documentElement.scrollHeight - window.innerHeight : (parent as HTMLElement).scrollHeight - (parent as HTMLElement).clientHeight;
      const pct = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0;
      setReadProgress(pct);
    };
    parent.addEventListener('scroll', handleScroll, { passive: true });
    return () => parent.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToLesson = useCallback((targetLevelId: number, targetLessonId: string) => {
    useProgressStore.getState().setCurrentLevel(targetLevelId);
    useProgressStore.getState().setCurrentLesson(targetLessonId);
  }, []);

  /* Keyboard navigation */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const state = useProgressStore.getState();
      if (state.currentView !== 'lesson') return;

      const level = levels.find((l) => l.id === state.currentLevel);
      if (!level) return;
      const lessonIndex = level.lessons.findIndex((l) => l.id === state.currentLesson);
      if (lessonIndex === -1) return;

      if (e.key === 'ArrowLeft') {
        let prev: { id: string; title: string; levelId: number } | null = null;
        if (lessonIndex > 0) {
          prev = { ...level.lessons[lessonIndex - 1], levelId: level.id };
        } else {
          const prevLevelIndex = levels.findIndex((l) => l.id === level.id) - 1;
          if (prevLevelIndex >= 0) {
            const prevLevel = levels[prevLevelIndex];
            prev = { ...prevLevel.lessons[prevLevel.lessons.length - 1], levelId: prevLevel.id };
          }
        }
        if (prev) navigateToLesson(prev.levelId, prev.id);
      } else if (e.key === 'ArrowRight') {
        let next: { id: string; title: string; levelId: number } | null = null;
        if (lessonIndex < level.lessons.length - 1) {
          next = { ...level.lessons[lessonIndex + 1], levelId: level.id };
        } else {
          const nextLevelIndex = levels.findIndex((l) => l.id === level.id) + 1;
          if (nextLevelIndex < levels.length) {
            const nextLevel = levels[nextLevelIndex];
            next = { ...nextLevel.lessons[0], levelId: nextLevel.id };
          }
        }
        if (next) navigateToLesson(next.levelId, next.id);
      }
    },
    [navigateToLesson]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const level = levels.find((l) => l.id === currentLevel);
  if (!level) return null;

  const lessonIndex = level.lessons.findIndex((l) => l.id === currentLesson);
  if (lessonIndex === -1) return null;

  const lesson = level.lessons[lessonIndex];

  const isCompleted = completedLessons.includes(lesson.id);

  const handleBack = () => {
    setCurrentLevel(currentLevel);
  };

  const handleStartQuiz = () => {
    setCurrentView('quiz');
  };

  const handleComplete = () => {
    completeLesson(lesson.id);
  };

  /* Determine accent color from level */
  const levelColorHex = (() => {
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

  /* Previous lesson */
  const prevLesson = (() => {
    if (lessonIndex > 0) {
      return { ...level.lessons[lessonIndex - 1], levelId: level.id };
    }
    /* Go to previous level's last lesson */
    const prevLevelIndex = levels.findIndex((l) => l.id === level.id) - 1;
    if (prevLevelIndex >= 0) {
      const prevLevel = levels[prevLevelIndex];
      const lastLesson = prevLevel.lessons[prevLevel.lessons.length - 1];
      return { ...lastLesson, levelId: prevLevel.id };
    }
    return null;
  })();

  /* Next lesson */
  const nextLesson = (() => {
    if (lessonIndex < level.lessons.length - 1) {
      return { ...level.lessons[lessonIndex + 1], levelId: level.id };
    }
    /* Go to next level's first lesson */
    const nextLevelIndex = levels.findIndex((l) => l.id === level.id) + 1;
    if (nextLevelIndex < levels.length) {
      const nextLevel = levels[nextLevelIndex];
      const firstLesson = nextLevel.lessons[0];
      return { ...firstLesson, levelId: nextLevel.id };
    }
    return null;
  })();

  return (
    <motion.div
      ref={scrollContainerRef}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Reading progress bar */}
      <div className="reading-progress" style={{ width: `${readProgress}%` }} />

      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Niveau {currentLevel}
      </Button>

      {/* Lesson Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Leçon {lesson.id}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {lesson.duration}
              </div>
              {isCompleted && (
                <Badge className="border-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Complétée
                </Badge>
              )}
            </div>
            <h1 className="text-xl font-extrabold md:text-2xl">
              {lesson.title}
            </h1>
            <p className="font-arabic mt-1 text-base text-muted-foreground">
              {lesson.titleAr}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {lesson.description}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="vocabulary" className="mb-8">
        <TabsList className="mb-4 w-full flex-wrap">
          <TabsTrigger value="vocabulary" className="flex-1 gap-1.5 text-xs sm:text-sm">
            <BookOpen className="h-3.5 w-3.5" />
            Vocabulaire
            <Badge variant="secondary" className="ml-1 text-[10px]">
              {lesson.vocabulary.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="phrases" className="flex-1 gap-1.5 text-xs sm:text-sm">
            <MessageSquare className="h-3.5 w-3.5" />
            Phrases
          </TabsTrigger>
          {lesson.grammar && (
            <TabsTrigger value="grammar" className="flex-1 gap-1.5 text-xs sm:text-sm">
              <FileText className="h-3.5 w-3.5" />
              Grammaire
            </TabsTrigger>
          )}
          {lesson.tips && lesson.tips.length > 0 && (
            <TabsTrigger value="tips" className="flex-1 gap-1.5 text-xs sm:text-sm">
              <Lightbulb className="h-3.5 w-3.5" />
              Conseils
            </TabsTrigger>
          )}
          <TabsTrigger value="notes" className="flex-1 gap-1.5 text-xs sm:text-sm">
            <StickyNote className="h-3.5 w-3.5" />
            Notes
          </TabsTrigger>
        </TabsList>

        {/* Vocabulary Tab */}
        <TabsContent value="vocabulary">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {lesson.vocabulary.map((item, index) => {
              const bookmarkKey = `${level.id}-${lessonIndex}-${index}`;
              const bookmarked = isBookmarked(bookmarkKey);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                >
                  <Card className="vocab-card-lift vocab-shimmer vocab-accent-stripe gap-0 overflow-hidden py-0 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5">
                    <CardContent className="p-0">
                      {/* Gradient overlay on Arabic text area */}
                      <div className="relative bg-gradient-to-b from-amber-50/50 to-transparent px-4 pt-4 pb-2 dark:from-amber-950/20">
                        {/* Level/Lesson origin badge */}
                        <div className="absolute left-3 top-3">
                          <Badge variant="secondary" className="text-[9px] font-medium px-1.5 py-0 bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                            {level.title.split(' ')[0]} · {lesson.title}
                          </Badge>
                        </div>
                        {/* Bookmark button */}
                        <button
                          onClick={() => toggleBookmark(bookmarkKey)}
                          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all hover:scale-110"
                          aria-label={
                            bookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'
                          }
                        >
                          <Heart
                            className={`h-5 w-5 transition-colors ${
                              bookmarked
                                ? 'fill-rose-500 text-rose-500'
                                : 'text-muted-foreground/40 hover:text-rose-400'
                            }`}
                          />
                        </button>
                        <AudioButton text={item.arabic} size="sm" className="absolute right-12 top-3 z-10" />
                        <p className="font-arabic mb-1 mt-5 text-center text-3xl leading-relaxed dark:text-amber-200">
                          {item.arabic}
                        </p>
                        {/* Latin transcription - slightly larger and bolder */}
                        <p className="text-center text-lg font-bold text-amber-700 dark:text-amber-400 tracking-wide">
                          {item.phonetic}
                        </p>
                      </div>

                      {/* French */}
                      <div className="px-4 pb-4 pt-2">
                        <p className="text-center text-sm font-medium text-foreground">
                          {item.french}
                        </p>

                        {/* Notes */}
                        {item.notes && (
                          <p className="mt-2 rounded-md bg-amber-50 p-2 text-center text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                            💡 {item.notes}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Phrases Tab */}
        <TabsContent value="phrases">
          <div className="space-y-3">
            {lesson.phrases.map((phrase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card className="phrase-accent-left gap-0 overflow-hidden py-0 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-0.5 rounded-lg">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
                      {/* French */}
                      <div className="flex-1">
                        <p className="mb-1 text-sm font-semibold text-foreground">
                          {phrase.french}
                        </p>
                        {phrase.context && (
                          <span className="context-pill inline-flex items-center">
                            📌 {phrase.context}
                          </span>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="hidden h-full w-px bg-border sm:block" />

                      {/* Arabic */}
                      <div className="flex-1 text-left sm:text-right">
                        <div className="flex items-start gap-2 justify-end">
                          <p className="font-arabic text-xl leading-relaxed dark:text-amber-200">
                          {phrase.arabic}
                        </p>
                        </div>
                        <AudioButton text={phrase.arabic} size="sm" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Grammar Tab */}
        <TabsContent value="grammar">
          <Card className="gap-4">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-lg font-bold">Grammaire</h3>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-li:text-foreground/80">
                {lesson.grammar?.split('\n').map((line, i) => {
                  // Bold text between ** **
                  const parts = line.split(/(\*\*.*?\*\*)/g);
                  if (line.startsWith('# ')) {
                    return (
                      <h3 key={i} className="mt-4 mb-2 text-base font-bold text-foreground">
                        {line.replace('# ', '')}
                      </h3>
                    );
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <li key={i} className="ml-4 list-disc text-sm text-foreground/80">
                        {line.slice(2).split(/(\*\*.*?\*\*)/g).map((part, j) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j}>{part.slice(2, -2)}</strong>;
                          }
                          return <span key={j}>{part}</span>;
                        })}
                      </li>
                    );
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <h4 key={i} className="mt-3 mb-1 text-sm font-bold text-foreground">
                        {line.slice(2, -2)}
                      </h4>
                    );
                  }
                  if (line.trim() === '') {
                    return <div key={i} className="h-2" />;
                  }
                  return (
                    <p key={i} className="text-sm text-foreground/80">
                      {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={j}>{part.slice(2, -2)}</strong>;
                        }
                        return <span key={j}>{part}</span>;
                      })}
                    </p>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tips Tab */}
        <TabsContent value="tips">
          <div className="space-y-3">
            {lesson.tips?.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
              >
                <Card className="gap-2 border-amber-200 bg-amber-50/50 py-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                  <CardContent className="flex gap-3 p-4">
                    <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                    <p className="text-sm text-foreground/80">{tip}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <LessonNotes key={lesson.id} lessonId={lesson.id} />
        </TabsContent>
      </Tabs>

      {/* Lesson Navigation */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        {prevLesson ? (
          <Button
            variant="outline"
            onClick={() => navigateToLesson(prevLesson.levelId, prevLesson.id)}
            className="gap-2 text-left"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" />
            <div className="flex flex-col items-start">
              <span className="text-[10px] text-muted-foreground">Leçon précédente</span>
              <span className="text-xs font-medium">{prevLesson.id}: {prevLesson.title}</span>
            </div>
          </Button>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <Button
            variant="outline"
            onClick={() => navigateToLesson(nextLesson.levelId, nextLesson.id)}
            className="gap-2 text-right"
          >
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-muted-foreground">Leçon suivante</span>
              <span className="text-xs font-medium">{nextLesson.id}: {nextLesson.title}</span>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0" />
          </Button>
        ) : (
          <div />
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-3 pb-6 sm:flex-row">
        {!isCompleted && (
          <Button
            onClick={handleComplete}
            variant="outline"
            className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
          >
            <CheckCircle2 className="h-4 w-4" />
            Marquer comme complétée
          </Button>
        )}
        <Button onClick={handleStartQuiz} className="gap-2">
          <BookOpen className="h-4 w-4" />
          Passer au Quiz
        </Button>
      </div>
    </motion.div>
  );
}
