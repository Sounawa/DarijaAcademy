'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { levels } from '@/data/curriculum';
import { vocabLookup, useProgressStore } from '@/store/progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  PenLine,
  Lightbulb,
  SkipForward,
  RotateCcw,
  Share2,
  BookOpen,
  Shuffle,
  AlertTriangle,
  Home,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────────── */
type WritingMode = 'lesson' | 'mixed' | 'weak';

interface VocabQuestion {
  key: string;
  arabic: string;
  french: string;
  phonetic: string;
  lessonId: string;
}

interface AnswerRecord {
  key: string;
  arabic: string;
  french: string;
  expected: string;
  userAnswer: string;
  correct: boolean;
}

/* ─── Helper: normalize string for comparison ────────────────────── */
function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"');
}

/* ─── Helper: build hint from phonetic ───────────────────────────── */
function buildHint(phonetic: string): string {
  const clean = phonetic.trim();
  const first = clean[0] ?? '';
  const len = clean.length;
  const dots = '•'.repeat(Math.max(0, len - 1));
  return `${first}${dots} (${len} lettres)`;
}

/* ─── Circular progress component ───────────────────────────────── */
function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const color =
    value >= 90
      ? '#10B981'
      : value >= 70
        ? '#F59E0B'
        : '#EF4444';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out', stroke: color }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-extrabold" style={{ color }}>
          {Math.round(value)}%
        </span>
      </div>
    </div>
  );
}

/* ─── Mode selection screen ──────────────────────────────────────── */
function ModeSelection({
  onSelect,
  onBack,
}: {
  onSelect: (mode: WritingMode, lessonId?: string) => void;
  onBack: () => void;
}) {
  const { completedLessons, wrongAnswers } = useProgressStore();

  const weakCount = wrongAnswers.length;

  // Build list of completed lessons for lesson mode
  const completedLessonsList = useMemo(() => {
    return levels.flatMap((level) =>
      level.lessons
        .filter((l) => completedLessons.includes(l.id))
        .map((l) => ({
          id: l.id,
          title: l.title,
          titleAr: l.titleAr,
          levelId: level.id,
          levelTitle: level.title,
          vocabCount: l.vocabulary.length,
        }))
    );
  }, [completedLessons]);

  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center py-4"
    >
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 self-start">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Accueil
      </Button>

      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md shadow-amber-500/20">
          <PenLine className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">Pratique d&apos;écriture</h1>
          <p className="text-sm text-muted-foreground">
            Tapez la transcription latine du mot arabe
          </p>
        </div>
      </div>

      <div className="mt-6 grid w-full max-w-lg gap-4">
        {/* Lesson mode */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Card
            className="cursor-pointer border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-transparent transition-shadow hover:shadow-md dark:border-amber-800/30 dark:from-amber-950/20"
            onClick={() => {
              if (selectedLesson) {
                onSelect('lesson', selectedLesson);
              }
            }}
          >
            <CardContent className="p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50">
                  <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold">Mode Leçon</h3>
                  <p className="text-xs text-muted-foreground">
                    12 questions par session
                  </p>
                </div>
              </div>

              {completedLessonsList.length > 0 ? (
                <div className="max-h-48 space-y-1 overflow-y-auto">
                  {completedLessonsList.map((l) => (
                    <button
                      key={l.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLesson(l.id === selectedLesson ? null : l.id);
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                        selectedLesson === l.id
                          ? 'bg-amber-500 text-white'
                          : 'bg-muted/50 hover:bg-muted'
                      }`}
                    >
                      <span className="font-medium">
                        N{l.levelId} — {l.title}
                      </span>
                      <span className="ml-2 text-muted-foreground">
                        ({l.vocabCount} mots)
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Complétez d&apos;abord une leçon pour débloquer ce mode.
                </p>
              )}

              <Button
                disabled={!selectedLesson}
                className="mt-3 w-full gap-2 bg-amber-500 hover:bg-amber-600"
                size="sm"
              >
                Commencer
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mixed mode */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Card
            className="cursor-pointer border-orange-200/50 bg-gradient-to-r from-orange-50/50 to-transparent transition-shadow hover:shadow-md dark:border-orange-800/30 dark:from-orange-950/20"
            onClick={() => onSelect('mixed')}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/50">
                  <Shuffle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Mode Mixte</h3>
                  <p className="text-xs text-muted-foreground">
                    20 questions aléatoires de tous les niveaux
                  </p>
                </div>
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  size="sm"
                >
                  Commencer
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weak words mode */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Card
            className={`cursor-pointer transition-shadow hover:shadow-md ${
              weakCount > 0
                ? 'border-rose-200/50 bg-gradient-to-r from-rose-50/50 to-transparent dark:border-rose-800/30 dark:from-rose-950/20'
                : 'border-muted bg-muted/20 opacity-60'
            }`}
            onClick={() => weakCount > 0 && onSelect('weak')}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/50">
                  <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">Mots faibles</h3>
                    {weakCount > 0 && (
                      <Badge className="bg-rose-500 hover:bg-rose-600" variant="secondary">
                        {weakCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {weakCount > 0
                      ? `${Math.min(weakCount, 20)} questions sur vos erreurs passées`
                      : 'Aucune erreur enregistrée — faites d\'abord des quiz !'}
                  </p>
                </div>
                {weakCount > 0 && (
                  <Button
                    className="bg-rose-500 hover:bg-rose-600"
                    size="sm"
                  >
                    Commencer
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Main WritingPractice component ─────────────────────────────── */
export function WritingPractice() {
  const { setCurrentView, setWritingScore, wrongAnswers, addWrongAnswer } =
    useProgressStore();

  const [phase, setPhase] = useState<'select' | 'playing' | 'results'>('select');
  const [mode, setMode] = useState<WritingMode>('lesson');
  const [sessionId, setSessionId] = useState('');
  const [questions, setQuestions] = useState<VocabQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  // Animated score counter
  useEffect(() => {
    if (phase !== 'results') return;
    let current = 0;
    const step = Math.max(1, Math.ceil(score / 25));
    const timer = setInterval(() => {
      current += step;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [phase, score]);

  // Focus input when question appears
  useEffect(() => {
    if (phase === 'playing' && !feedback) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [phase, currentIndex, feedback]);

  /* ── Generate questions for a given mode ──────────────────────── */
  const generateQuestions = useCallback(
    (m: WritingMode, lessonId?: string): VocabQuestion[] => {
      const allVocab: VocabQuestion[] = [];

      if (m === 'lesson' && lessonId) {
        // From a specific lesson
        const level = levels.find((l) =>
          l.lessons.some((ls) => ls.id === lessonId)
        );
        const lesson = level?.lessons.find((ls) => ls.id === lessonId);
        if (lesson) {
          lesson.vocabulary.forEach((v, i) => {
            allVocab.push({
              key: `${lessonId}-${i}`,
              arabic: v.arabic,
              french: v.french,
              phonetic: v.phonetic,
              lessonId,
            });
          });
        }
      } else if (m === 'mixed') {
        // Random from all levels
        for (const level of levels) {
          for (const lesson of level.lessons) {
            lesson.vocabulary.forEach((v, i) => {
              allVocab.push({
                key: `${lesson.id}-${i}`,
                arabic: v.arabic,
                french: v.french,
                phonetic: v.phonetic,
                lessonId: lesson.id,
              });
            });
          }
        }
      } else if (m === 'weak') {
        // From wrong answers
        const wa = wrongAnswers;
        for (const w of wa) {
          const entry = vocabLookup[w.questionId];
          if (entry) {
            // Extract lessonId from key format "lessonId-index"
            const parts = w.questionId.split('-');
            const lid = parts.slice(0, 2).join('-');
            allVocab.push({
              key: w.questionId,
              arabic: entry.arabic,
              french: entry.french,
              phonetic: entry.phonetic,
              lessonId: lid,
            });
          }
        }
      }

      // Shuffle
      for (let i = allVocab.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allVocab[i], allVocab[j]] = [allVocab[j], allVocab[i]];
      }

      const total = m === 'lesson' ? Math.min(12, allVocab.length) : Math.min(20, allVocab.length);
      return allVocab.slice(0, total);
    },
    [wrongAnswers]
  );

  /* ── Start session ────────────────────────────────────────────── */
  const handleStart = useCallback(
    (m: WritingMode, lessonId?: string) => {
      const qs = generateQuestions(m, lessonId);
      if (qs.length === 0) return;

      setMode(m);
      setSessionId(`${m}-${lessonId ?? 'all'}-${Date.now()}`);
      setQuestions(qs);
      setCurrentIndex(0);
      setUserInput('');
      setShowHint(false);
      setFeedback(null);
      setAnswers([]);
      setScore(0);
      setAnimatedScore(0);
      setPhase('playing');
    },
    [generateQuestions]
  );

  /* ── Submit answer ────────────────────────────────────────────── */
  const handleSubmit = useCallback(() => {
    const trimmed = userInput.trim();
    if (!trimmed || feedback) return;

    const q = questions[currentIndex];
    if (!q) return;

    const isCorrect = normalize(trimmed) === normalize(q.phonetic);

    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
      // Record wrong answer
      addWrongAnswer({
        questionId: q.key,
        question: `${q.arabic} (${q.french})`,
        correctAnswer: q.phonetic,
        userAnswer: trimmed,
        lessonId: q.lessonId,
      });
    }

    setAnswers((a) => [
      ...a,
      {
        key: q.key,
        arabic: q.arabic,
        french: q.french,
        expected: q.phonetic,
        userAnswer: trimmed,
        correct: isCorrect,
      },
    ]);

    // Auto-advance after 1.5s
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((i) => i + 1);
        setUserInput('');
        setShowHint(false);
        setFeedback(null);
      } else {
        // Session complete
        const finalScore = isCorrect ? score + 1 : score;
        const pct = Math.round((finalScore / questions.length) * 100);
        setWritingScore(sessionId, pct);
        setPhase('results');
      }
    }, 1500);
  }, [userInput, feedback, questions, currentIndex, score, sessionId, addWrongAnswer, setWritingScore]);

  /* ── Skip question ────────────────────────────────────────────── */
  const handleSkip = useCallback(() => {
    if (feedback) return;

    const q = questions[currentIndex];
    if (!q) return;

    setAnswers((a) => [
      ...a,
      {
        key: q.key,
        arabic: q.arabic,
        french: q.french,
        expected: q.phonetic,
        userAnswer: '(passé)',
        correct: false,
      },
    ]);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setUserInput('');
      setShowHint(false);
      setFeedback(null);
    } else {
      const pct = Math.round((score / questions.length) * 100);
      setWritingScore(sessionId, pct);
      setPhase('results');
    }
  }, [feedback, questions, currentIndex, score, sessionId, setWritingScore]);

  /* ── Restart ──────────────────────────────────────────────────── */
  const handleRestart = useCallback(() => {
    setPhase('select');
  }, []);

  /* ── Handle keyboard ──────────────────────────────────────────── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const currentQuestion = questions[currentIndex];
  const progressPercent =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  /* ── Results screen ───────────────────────────────────────────── */
  if (phase === 'results') {
    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const isPerfect = percentage === 100;

    const getScoreMessage = () => {
      if (percentage === 100) return 'Parfait ! Vous maîtrisez la transcription latine !';
      if (percentage >= 80) return 'Excellent ! Quelques mots à revoir.';
      if (percentage >= 60) return 'Bien joué ! Continuez la pratique.';
      if (percentage >= 40) return 'Pas mal ! Relisez les leçons et réessayez.';
      return 'Courage ! La pratique fait la perfection.';
    };

    const getScoreEmoji = () => {
      if (percentage === 100) return '🏆';
      if (percentage >= 80) return '🌟';
      if (percentage >= 60) return '👍';
      if (percentage >= 40) return '📚';
      return '💪';
    };

    const handleShare = () => {
      const text = `✏️ DarijaAcademy — Pratique d'écriture\n${getScoreEmoji()} Score: ${animatedScore}/${questions.length} (${percentage}%)\n#DarijaAcademy`;
      if (navigator.share) {
        navigator.share({ title: 'DarijaAcademy', text });
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center py-8"
      >
        <Card className="w-full max-w-lg gap-6 text-center overflow-hidden">
          <CardContent className="p-6 pt-8">
            {/* Trophy */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
              className="mb-4"
            >
              <div className="text-7xl">{getScoreEmoji()}</div>
            </motion.div>

            <h2 className="mb-2 text-2xl font-extrabold">Session terminée !</h2>
            <p className="mb-6 text-muted-foreground">{getScoreMessage()}</p>

            {/* Circular progress */}
            <div className="mb-6 flex justify-center">
              <CircularProgress value={percentage} />
            </div>

            {/* Score text */}
            <p className="mb-2 text-lg font-bold">
              {animatedScore} / {questions.length} bonnes réponses
            </p>
            <Badge
              variant="outline"
              className={`mb-6 text-sm ${
                isPerfect
                  ? 'border-emerald-400 text-emerald-600'
                  : percentage >= 70
                    ? 'border-amber-400 text-amber-600'
                    : 'border-red-400 text-red-600'
              }`}
            >
              {isPerfect ? '🟢 Parfait' : percentage >= 70 ? '🟠 Bien' : '🔴 À améliorer'}
            </Badge>

            {/* Answer grid */}
            <div className="mb-6 max-h-72 space-y-2 overflow-y-auto text-left">
              <p className="mb-2 text-sm font-semibold">Détail des réponses :</p>
              {answers.map((a, i) => (
                <motion.div
                  key={a.key + i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`rounded-lg p-3 text-xs ${
                    a.correct
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {a.correct ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-arabic text-sm font-bold" dir="rtl">
                        {a.arabic}
                      </p>
                      <p className="text-muted-foreground">{a.french}</p>
                      {!a.correct && (
                        <>
                          <p className="mt-1 font-medium text-emerald-600 dark:text-emerald-400">
                            Attendu : <span className="font-bold">{a.expected}</span>
                          </p>
                          <p className="text-red-500">
                            Votre réponse : <span className="font-bold">{a.userAnswer}</span>
                          </p>
                        </>
                      )}
                      {a.correct && (
                        <p className="mt-1 text-emerald-600 dark:text-emerald-400">
                          <span className="font-bold">{a.expected}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={handleRestart} className="gap-2 bg-amber-500 hover:bg-amber-600">
                <RotateCcw className="h-4 w-4" />
                Recommencer
              </Button>
              <Button onClick={handleShare} variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
              <Button onClick={() => setCurrentView('home')} variant="ghost" className="gap-2">
                <Home className="h-4 w-4" />
                Accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  /* ── Playing screen ───────────────────────────────────────────── */
  if (phase === 'playing' && currentQuestion) {
    const hint = buildHint(currentQuestion.phonetic);

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center py-4"
      >
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRestart}
          className="mb-4 self-start"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour
        </Button>

        {/* Header */}
        <div className="mb-4 flex w-full max-w-lg items-center justify-between">
          <div>
            <h1 className="text-lg font-extrabold">
              {mode === 'lesson'
                ? 'Leçon'
                : mode === 'mixed'
                  ? 'Mixte'
                  : 'Mots faibles'}
            </h1>
            <p className="text-xs text-muted-foreground">
              Question {currentIndex + 1}/{questions.length}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              Score: {score}/{currentIndex + (feedback ? 1 : 0)}
            </Badge>
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={progressPercent} className="mb-8 h-2 w-full max-w-lg" />

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`w-full max-w-lg ${
              feedback === 'correct'
                ? 'animate-bounce-in'
                : feedback === 'incorrect'
                  ? 'animate-shake'
                  : ''
            }`}
          >
            <Card className="overflow-hidden border-amber-200/50 bg-gradient-to-br from-amber-50/30 to-orange-50/20 dark:border-amber-800/30 dark:from-amber-950/10 dark:to-orange-950/10">
              <CardContent className="flex flex-col items-center gap-6 p-8">
                {/* Arabic text */}
                <div className="text-center">
                  <p
                    className="font-arabic text-4xl leading-relaxed md:text-5xl"
                    dir="rtl"
                  >
                    {currentQuestion.arabic}
                  </p>
                </div>

                {/* French translation */}
                <p className="text-lg text-muted-foreground">
                  {currentQuestion.french}
                </p>

                {/* Hint button */}
                {!feedback && (
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHint(!showHint)}
                      className="gap-2 text-amber-600 dark:text-amber-400"
                    >
                      <Lightbulb className="h-4 w-4" />
                      {showHint ? 'Masquer l\'indice' : 'Voir l\'indice'}
                    </Button>
                    <AnimatePresence>
                      {showHint && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="rounded-lg bg-amber-100 px-4 py-2 font-mono text-sm font-semibold text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
                        >
                          {hint}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Input */}
                {!feedback && (
                  <div className="w-full">
                    <input
                      ref={inputRef}
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Tapez la transcription en caractères latins..."
                      autoComplete="off"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      className="w-full rounded-xl border-2 border-amber-200 bg-white px-5 py-4 text-center text-lg font-semibold outline-none transition-all placeholder:text-muted-foreground/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-amber-800 dark:bg-gray-900 dark:focus:border-amber-500"
                    />
                    <p className="mt-1 text-center text-xs text-muted-foreground">
                      Appuyez sur Entrée pour valider
                    </p>
                  </div>
                )}

                {/* Submit button */}
                {!feedback && (
                  <Button
                    onClick={handleSubmit}
                    disabled={!userInput.trim()}
                    className="w-full gap-2 bg-amber-500 text-base hover:bg-amber-600 disabled:opacity-40"
                    size="lg"
                  >
                    Valider
                    <CheckCircle2 className="h-5 w-5" />
                  </Button>
                )}

                {/* Feedback */}
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full text-center"
                  >
                    {feedback === 'correct' ? (
                      <div className="rounded-xl bg-emerald-50 p-6 dark:bg-emerald-950/30">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        >
                          <CheckCircle2 className="mx-auto mb-2 h-12 w-12 text-emerald-500" />
                        </motion.div>
                        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                          Bravo !
                        </p>
                        <p className="mt-1 font-mono text-sm text-emerald-600 dark:text-emerald-500">
                          {currentQuestion.phonetic}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-red-50 p-6 dark:bg-red-950/30">
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        >
                          <XCircle className="mx-auto mb-2 h-12 w-12 text-red-500" />
                        </motion.div>
                        <p className="mb-2 text-sm font-semibold text-red-700 dark:text-red-400">
                          La bonne réponse était :
                        </p>
                        <p className="mb-1 font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {currentQuestion.phonetic}
                        </p>
                        <p className="text-xs text-red-500">
                          Votre réponse :{' '}
                          <span className="font-semibold">{userInput.trim()}</span>
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Skip button */}
        {!feedback && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="mt-4 gap-2 text-muted-foreground"
          >
            <SkipForward className="h-4 w-4" />
            Passer
          </Button>
        )}
      </motion.div>
    );
  }

  /* ── Mode selection (default) ─────────────────────────────────── */
  return (
    <ModeSelection
      onSelect={handleStart}
      onBack={() => setCurrentView('home')}
    />
  );
}
