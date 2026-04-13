'use client';

import { useMemo, useState } from 'react';
import { levels } from '@/data/curriculum';
import { useProgressStore, type WrongAnswer } from '@/store/progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  AlertTriangle,
  RotateCcw,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Play,
  BookOpen,
} from 'lucide-react';

/* ─── Helpers ─────────────────────────────────────────────────── */

function getLessonTitle(lessonId: string): string {
  for (const level of levels) {
    const lesson = level.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson.title;
  }
  return lessonId;
}

function getLevelTitle(lessonId: string): { title: string; id: number } {
  for (const level of levels) {
    const lesson = level.lessons.find((l) => l.id === lessonId);
    if (lesson) return { title: level.title, id: level.id };
  }
  return { title: '', id: 0 };
}

interface GroupedMistakes {
  lessonId: string;
  lessonTitle: string;
  levelTitle: string;
  levelId: number;
  mistakes: WrongAnswer[];
}

/* ─── Mini quiz for reviewing wrong answers ──────────────────── */

interface MiniQuizState {
  active: boolean;
  currentIndex: number;
  score: number;
  isAnswered: boolean;
  selectedAnswer: number | null;
  isFinished: boolean;
  results: Array<{ questionId: string; correct: boolean }>;
}

function useMiniQuiz(questions: WrongAnswer[]) {
  const [state, setState] = useState<MiniQuizState>({
    active: false,
    currentIndex: 0,
    score: 0,
    isAnswered: false,
    selectedAnswer: null,
    isFinished: false,
    results: [],
  });

  const currentQ = questions[state.currentIndex];
  const total = questions.length;

  const start = () => {
    setState({
      active: true,
      currentIndex: 0,
      score: 0,
      isAnswered: false,
      selectedAnswer: null,
      isFinished: false,
      results: [],
    });
  };

  const answer = (index: number) => {
    if (state.isAnswered || !currentQ) return;
    const correct = currentQ.correctAnswer === (index === 0 ? currentQ.userAnswer : currentQ.correctAnswer);
    // Build options: correct answer at index 0 (wrong user answer), correct answer at index 1 (actual correct)
    setState((prev) => ({
      ...prev,
      isAnswered: true,
      selectedAnswer: index,
      score: correct ? prev.score + 1 : prev.score,
      results: [...prev.results, { questionId: currentQ.questionId, correct }],
    }));
  };

  const next = () => {
    if (state.currentIndex + 1 < questions.length) {
      setState((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        isAnswered: false,
        selectedAnswer: null,
      }));
    } else {
      setState((prev) => ({ ...prev, isFinished: true }));
    }
  };

  const reset = () => {
    setState({
      active: false,
      currentIndex: 0,
      score: 0,
      isAnswered: false,
      selectedAnswer: null,
      isFinished: false,
      results: [],
    });
  };

  return { ...state, currentQ, total, start, answer, next, reset };
}

/* ─── Container animation variants ───────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

/* ─── Main Component ─────────────────────────────────────────── */

export function MistakeReview() {
  const {
    wrongAnswers,
    clearWrongAnswers,
    removeWrongAnswer,
    setCurrentLevel,
    setCurrentLesson,
    setCurrentView,
  } = useProgressStore();

  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());

  // Group wrong answers by lesson
  const groupedMistakes = useMemo<GroupedMistakes[]>(() => {
    const map = new Map<string, WrongAnswer[]>();
    for (const wa of wrongAnswers) {
      const existing = map.get(wa.lessonId) ?? [];
      existing.push(wa);
      map.set(wa.lessonId, existing);
    }

    return Array.from(map.entries()).map(([lessonId, mistakes]) => {
      const info = getLevelTitle(lessonId);
      return {
        lessonId,
        lessonTitle: getLessonTitle(lessonId),
        levelTitle: info.title,
        levelId: info.id,
        mistakes: mistakes.sort((a, b) => b.timestamp - a.timestamp),
      };
    });
  }, [wrongAnswers]);

  // Flatten for "Review All" mini quiz
  const allMistakes = useMemo(
    () => [...wrongAnswers].sort((a, b) => b.timestamp - a.timestamp),
    [wrongAnswers]
  );

  const quiz = useMiniQuiz(allMistakes);

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      return next;
    });
  };

  const handleGoToLesson = (levelId: number, lessonId: string) => {
    setCurrentLevel(levelId);
    setCurrentLesson(lessonId);
  };

  const handleRetrySingle = (wa: WrongAnswer) => {
    const levelId = getLevelTitle(wa.lessonId).id;
    if (levelId) {
      setCurrentLevel(levelId);
      setCurrentLesson(wa.lessonId);
    }
  };

  const handleRemove = (questionId: string) => {
    removeWrongAnswer(questionId);
  };

  // ─── Mini Quiz Render ─────────────────────────────────────────
  if (quiz.active && !quiz.isFinished && quiz.currentQ) {
    const q = quiz.currentQ;
    const options = [q.userAnswer, q.correctAnswer];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center py-4"
      >
        <Card className="w-full max-w-lg gap-4">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                  R&eacute;vision rapide
                </h2>
                <p className="text-xs text-muted-foreground">
                  Question {quiz.currentIndex + 1} / {quiz.total}
                </p>
              </div>
              <Badge variant="outline">{quiz.score}/{quiz.total}</Badge>
            </div>

            <div className="mb-6 rounded-xl bg-amber-50 p-4 dark:bg-amber-950/30">
              <p className="text-sm font-medium">{q.question}</p>
            </div>

            <div className="space-y-3">
              {options.map((opt, idx) => {
                const isCorrect = opt === q.correctAnswer;
                const isSelected = idx === quiz.selectedAnswer;
                let style = 'cursor-pointer border-border hover:border-amber-300 transition-all';

                if (quiz.isAnswered) {
                  if (isCorrect) {
                    style = 'border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/30';
                  } else if (isSelected && !isCorrect) {
                    style = 'border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-950/30';
                  } else {
                    style = 'border-border opacity-50';
                  }
                }

                return (
                  <motion.div key={idx} whileTap={!quiz.isAnswered ? { scale: 0.98 } : undefined}>
                    <div
                      className={`rounded-xl border p-4 text-center text-sm font-medium ${style}`}
                      onClick={() => quiz.answer(idx)}
                    >
                      {opt}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {quiz.isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Button
                  onClick={quiz.next}
                  className="w-full gap-2 btn-primary-glow"
                >
                  {quiz.currentIndex + 1 < quiz.total ? 'Question suivante' : 'Voir les résultats'}
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Button>
              </motion.div>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="mt-3 w-full text-muted-foreground"
              onClick={quiz.reset}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Retour aux erreurs
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // ─── Mini Quiz Results ────────────────────────────────────────
  if (quiz.active && quiz.isFinished) {
    const pct = quiz.total > 0 ? Math.round((quiz.score / quiz.total) * 100) : 0;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center py-4"
      >
        <Card className="w-full max-w-lg gap-4 text-center">
          <CardContent className="p-6 pt-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
              className="mb-4 inline-block text-7xl"
            >
              {pct === 100 ? '🏆' : pct >= 80 ? '🌟' : pct >= 60 ? '👍' : '💪'}
            </motion.div>
            <h2 className="mb-2 text-2xl font-extrabold">R&eacute;vision termin&eacute;e !</h2>
            <p className="mb-6 text-muted-foreground">
              {pct === 100
                ? 'Parfait ! Vous avez corrigé toutes vos erreurs !'
                : pct >= 80
                  ? 'Excellent ! Presque parfait cette fois-ci.'
                  : 'Continuez à pratiquer pour améliorer !'}
            </p>
            <div className="mb-6 inline-flex items-center gap-4 rounded-2xl bg-amber-50 p-5 dark:bg-amber-950/30">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                  {quiz.score}/{quiz.total}
                </p>
                <p className="text-sm text-muted-foreground">{pct}% de bonnes r&eacute;ponses</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={quiz.reset} variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour aux erreurs
              </Button>
              <Button onClick={quiz.start} className="gap-2 btn-primary-glow">
                <RotateCcw className="h-4 w-4" />
                R&eacute;viser encore
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // ─── Empty State ──────────────────────────────────────────────
  if (wrongAnswers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView('home')}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Accueil
          </Button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-muted-foreground/20 py-20 text-center empty-state-gradient"
        >
          <motion.div
            className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-4xl">🎉</span>
          </motion.div>
          <h3 className="mb-2 text-lg font-semibold empty-state-text">
            Bravo ! Vous n&apos;avez fait aucune erreur !
          </h3>
          <p className="max-w-sm text-sm text-muted-foreground empty-state-text">
            Continuez comme &ccedil;a ! Les erreurs que vous faites dans les quiz
            appara&icirc;tront ici pour que vous puissiez les r&eacute;viser.
          </p>
          <div className="mt-6 flex gap-2">
            {['🎊', '✨', '🏆', '⭐', '🌟', '💫'].map((emoji, i) => (
              <motion.span
                key={i}
                className="text-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.15 }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // ─── Main Mistake Review ──────────────────────────────────────
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView('home')}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Accueil
            </Button>
          </div>
          <h1 className="text-xl font-extrabold md:text-2xl">
            <AlertTriangle className="mb-1 mr-2 inline-block h-6 w-6 text-amber-500" />
            Mes erreurs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {wrongAnswers.length} erreur{wrongAnswers.length > 1 ? 's' : ''} &agrave; r&eacute;viser
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={quiz.start}
            size="sm"
            className="gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 btn-primary-glow"
          >
            <Play className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tout r&eacute;viser</span>
            <span className="sm:hidden">R&eacute;viser</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearWrongAnswers}
            className="gap-1.5 border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tout effacer</span>
          </Button>
        </div>
      </motion.div>

      {/* Mistake summary card */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center gap-4 rounded-xl border bg-gradient-to-r from-amber-50 to-orange-50 p-4 dark:from-amber-950/30 dark:to-orange-950/30">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm shadow-amber-500/20">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">
              {wrongAnswers.length} erreur{wrongAnswers.length > 1 ? 's' : ''} dans{' '}
              {groupedMistakes.length} le&ccedil;on{groupedMistakes.length > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-muted-foreground">
              R&eacute;visez vos erreurs pour mieux retenir !
            </p>
          </div>
          <Button
            onClick={quiz.start}
            size="sm"
            variant="outline"
            className="shrink-0 gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-950/50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Mini quiz
          </Button>
        </div>
      </motion.div>

      {/* Grouped mistakes by lesson */}
      <div className="space-y-4">
        <AnimatePresence>
          {groupedMistakes.map((group) => {
            const isExpanded = expandedLessons.has(group.lessonId);
            return (
              <motion.div
                key={group.lessonId}
                variants={itemVariants}
                layout
              >
                <Card className="card-glow-border overflow-hidden">
                  <CardContent className="p-0">
                    {/* Lesson header - clickable to expand */}
                    <button
                      onClick={() => toggleLesson(group.lessonId)}
                      className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/50">
                          <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{group.lessonTitle}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px]">
                              {group.lessonId}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {group.levelTitle}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge className="bg-rose-500 hover:bg-rose-600 text-white text-[10px]">
                          {group.mistakes.length} erreur{group.mistakes.length > 1 ? 's' : ''}
                        </Badge>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Expanded mistakes */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border/50 px-4 py-3 space-y-3">
                            {group.mistakes.map((wa, idx) => (
                              <motion.div
                                key={wa.questionId}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="rounded-lg border bg-background p-3"
                              >
                                {/* Question */}
                                <p className="mb-3 text-sm font-medium leading-relaxed">
                                  {wa.question}
                                </p>

                                {/* Answers comparison */}
                                <div className="space-y-2">
                                  {/* User's wrong answer */}
                                  <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-950/30">
                                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                                    <div>
                                      <p className="text-[10px] font-semibold uppercase tracking-wider text-red-500">
                                        Votre r&eacute;ponse
                                      </p>
                                      <p className="text-sm text-red-700 dark:text-red-400">
                                        {wa.userAnswer}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Correct answer */}
                                  <div className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-950/30">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                    <div>
                                      <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
                                        Bonne r&eacute;ponse
                                      </p>
                                      <p className="text-sm text-emerald-700 dark:text-emerald-400">
                                        {wa.correctAnswer}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-3 flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 gap-1 text-[11px]"
                                    onClick={() => handleRetrySingle(wa)}
                                  >
                                    <RotateCcw className="h-3 w-3" />
                                    Recommencer
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 gap-1 text-[11px] text-muted-foreground hover:text-red-500"
                                    onClick={() => handleRemove(wa.questionId)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    Retirer
                                  </Button>
                                  <span className="ml-auto text-[10px] text-muted-foreground">
                                    {new Date(wa.timestamp).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'short',
                                    })}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Bottom motivation */}
      <motion.div variants={itemVariants} className="mt-6">
        <div className="rounded-xl border bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5 text-center dark:from-amber-950/30 dark:to-orange-950/30">
          <p className="text-base font-semibold text-amber-700 dark:text-amber-300">
            🎯 &laquo; L-khya6 f l-mohawla &raquo;
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            L&apos;erreur est dans l&apos;essai — Chaque erreur corrig&eacute;e est un pas en avant !
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
