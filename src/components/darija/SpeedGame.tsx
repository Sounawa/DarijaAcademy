'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useProgressStore } from '@/store/progress-store';
import { levels, type VocabularyItem } from '@/data/curriculum';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  Timer,
  Zap,
  Trophy,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Crown,
  Flame,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────
type Difficulty = 'facile' | 'moyen' | 'difficile';
type GamePhase = 'menu' | 'countdown' | 'playing' | 'results';

interface GameQuestion {
  french: string;
  correctArabic: string;
  correctPhonetic: string;
  options: string[];
  correctIndex: number;
}

// ─── Difficulty config ──────────────────────────────────────────────────
const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; cefr: string[]; color: string; bgColor: string; icon: string }> = {
  facile: { label: 'Facile', cefr: ['A1.1', 'A1.2'], color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-950/50', icon: '🌱' },
  moyen: { label: 'Moyen', cefr: ['A2.1', 'A2.2'], color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-950/50', icon: '🔥' },
  difficile: { label: 'Difficile', cefr: ['B1.1', 'B1.2'], color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-100 dark:bg-rose-950/50', icon: '💀' },
};

const ROUND_DURATION = 30;
const QUESTIONS_PER_ROUND = 10;

// ─── Helpers ────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getVocabPool(difficulty: Difficulty): VocabularyItem[] {
  const cfg = DIFFICULTY_CONFIG[difficulty];
  const pool: VocabularyItem[] = [];
  for (const level of levels) {
    if (cfg.cefr.includes(level.cefrLevel)) {
      for (const lesson of level.lessons) {
        pool.push(...lesson.vocabulary);
      }
    }
  }
  return pool;
}

function generateQuestions(difficulty: Difficulty, count: number): GameQuestion[] {
  const pool = getVocabPool(difficulty);
  if (pool.length < 4) return [];

  const shuffled = shuffle(pool);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  const questions: GameQuestion[] = [];

  for (const item of selected) {
    const wrongOptions = shuffle(pool.filter((v) => v.arabic !== item.arabic)).slice(0, 3);
    if (wrongOptions.length < 3) continue;

    const options = shuffle([
      item.arabic,
      ...wrongOptions.map((w) => w.arabic),
    ]);
    questions.push({
      french: item.french,
      correctArabic: item.arabic,
      correctPhonetic: item.phonetic,
      options,
      correctIndex: options.indexOf(item.arabic),
    });
  }
  return questions;
}

// ─── Animation variants ─────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.2 } },
};

const correctAnim = {
  initial: { borderColor: 'rgba(16, 185, 129, 0.8)', backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  animate: { scale: [1, 1.02, 1] },
};

const wrongAnim = {
  animate: { x: [-8, 8, -6, 6, -4, 4, 0] },
};

const countdownVariants = {
  enter: { scale: 0.5, opacity: 0 },
  center: { scale: 1, opacity: 1 },
  exit: { scale: 1.5, opacity: 0 },
};

// ─── Component ──────────────────────────────────────────────────────────
export function SpeedGame() {
  const { setCurrentView, speedGameHighScores, addSpeedGameScore } = useProgressStore();

  const [phase, setPhase] = useState<GamePhase>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('facile');
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [countdownNum, setCountdownNum] = useState(3);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const question = questions[currentIndex] ?? null;

  // ─── Leaderboard ────────────────────────────────────────────────────
  const leaderboard = useMemo(() => {
    return speedGameHighScores
      .filter((s) => s.difficulty === difficulty)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [speedGameHighScores, difficulty]);

  // ─── Start game ─────────────────────────────────────────────────────
  const startGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    const qs = generateQuestions(diff, QUESTIONS_PER_ROUND);
    setQuestions(qs);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSelectedAnswer(null);
    setReactionTimes([]);
    setTimeLeft(ROUND_DURATION);
    setShowFeedback(null);
    setPhase('countdown');
    setCountdownNum(3);
  }, []);

  // ─── Countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'countdown') return;
    const t = setTimeout(() => {
      if (countdownNum <= 1) {
        setPhase('playing');
        setQuestionStartTime(Date.now());
      } else {
        setCountdownNum((n) => n - 1);
      }
    }, 700);
    return () => clearTimeout(t);
  }, [phase, countdownNum]);

  // ─── Timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // Clear timer and end game on next tick
          setTimeout(() => setPhase('results'), 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // ─── Handle answer ──────────────────────────────────────────────────
  const handleAnswer = useCallback((index: number) => {
    if (selectedAnswer !== null || !question) return;

    const reactionTime = Date.now() - questionStartTime;
    setSelectedAnswer(index);

    const isCorrect = index === question.correctIndex;

    if (isCorrect) {
      setShowFeedback('correct');
      const timeBonus = Math.max(1, Math.round((reactionTime / 1000) * 10));
      const points = 100 + (30 - timeLeft) * 5 + Math.max(0, (3 - Math.floor(reactionTime / 1000))) * 15;
      setScore((s) => s + points);
      setCorrectCount((c) => c + 1);
      setReactionTimes((r) => [...r, reactionTime]);
    } else {
      setShowFeedback('wrong');
      setWrongCount((w) => w + 1);
      setReactionTimes((r) => [...r, reactionTime]);
    }

    setTimeout(() => {
      setShowFeedback(null);
      setSelectedAnswer(null);
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((i) => i + 1);
        setQuestionStartTime(Date.now());
      } else {
        setPhase('results');
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 800);
  }, [selectedAnswer, question, questionStartTime, currentIndex, questions.length, timeLeft]);

  // ─── Save result ────────────────────────────────────────────────────
  const saveResult = useCallback(() => {
    const avgTime = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;
    addSpeedGameScore({
      score,
      difficulty: DIFFICULTY_CONFIG[difficulty].label,
      date: Date.now(),
      correct: correctCount,
      total: correctCount + wrongCount,
      avgTime,
    });
  }, [score, difficulty, correctCount, wrongCount, reactionTimes, addSpeedGameScore]);

  // ─── Save on results phase ──────────────────────────────────────────
  const savedRef = useRef(false);
  useEffect(() => {
    if (phase === 'results' && !savedRef.current) {
      savedRef.current = true;
      saveResult();
    }
    if (phase === 'menu' || phase === 'countdown') {
      savedRef.current = false;
    }
  }, [phase, saveResult]);

  // ─── Stats for results ──────────────────────────────────────────────
  const avgReactionTime = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  const accuracy = correctCount + wrongCount > 0
    ? Math.round((correctCount / (correctCount + wrongCount)) * 100)
    : 0;

  // ─── Keyboard shortcut ──────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing' || selectedAnswer !== null) return;
    const handler = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 4 && question) {
        handleAnswer(num - 1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, selectedAnswer, question, handleAnswer]);

  // ═════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      {/* ─── MENU ─────────────────────────────────────────────────────── */}
      {phase === 'menu' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')} aria-label="Retour">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Jeu de Vitesse
                </span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Testez votre vocabulaire contre la montre !
              </p>
            </div>
          </div>

          {/* Instructions */}
          <Card className="border-amber-200/60 dark:border-amber-800/30">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
                  <Gamepad2 className="h-5 w-5 text-white" />
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong className="text-foreground">Comment jouer :</strong> Choisissez la traduction arabe correcte pour le mot français affiché.</p>
                  <p>⏱️ <strong className="text-foreground">{ROUND_DURATION} secondes</strong> par round</p>
                  <p>🎯 <strong className="text-foreground">{QUESTIONS_PER_ROUND} questions</strong> par round</p>
                  <p>⚡ <strong className="text-foreground">Bonus de temps</strong> pour les réponses rapides</p>
                  <p>⌨️ Utilisez les touches <strong className="text-foreground">1-4</strong> pour répondre vite</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Difficulty selection */}
          <div className="space-y-3">
            <h2 className="text-base font-semibold">Choisir la difficulté</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG[Difficulty]][]).map(([key, cfg]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startGame(key)}
                  className="group rounded-xl border-2 border-transparent bg-gradient-to-br from-amber-50 to-orange-50 p-4 text-left transition-all hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/10 dark:from-amber-950/30 dark:to-orange-950/30 dark:hover:border-amber-700"
                >
                  <div className="text-3xl mb-2">{cfg.icon}</div>
                  <p className={`text-base font-bold ${cfg.color}`}>{cfg.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {cfg.cefr.join(', ')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getVocabPool(key).length} mots disponibles
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          {leaderboard.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Meilleurs scores — {DIFFICULTY_CONFIG[difficulty].label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border px-3 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                        <div>
                          <p className="text-sm font-semibold">{entry.score} pts</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.correct}/{entry.total} correct — {entry.avgTime > 0 ? `${entry.avgTime}ms` : '–'} avg
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      {/* ─── COUNTDOWN ────────────────────────────────────────────────── */}
      {phase === 'countdown' && (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={countdownNum}
              variants={countdownVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="text-8xl font-black text-amber-600 dark:text-amber-400"
            >
              {countdownNum > 0 ? countdownNum : 'GO!'}
            </motion.div>
          </AnimatePresence>
          <Badge variant="outline" className="text-sm">
            {DIFFICULTY_CONFIG[difficulty].icon} {DIFFICULTY_CONFIG[difficulty].label}
          </Badge>
        </div>
      )}

      {/* ─── PLAYING ──────────────────────────────────────────────────── */}
      {phase === 'playing' && question && (
        <motion.div className="space-y-4">
          {/* Top bar: timer + progress + score */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer className={`h-5 w-5 ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-amber-500'}`} />
              <span className={`text-lg font-bold tabular-nums ${timeLeft <= 10 ? 'text-rose-500' : 'text-foreground'}`}>
                {timeLeft}s
              </span>
            </div>
            <Progress
              value={(timeLeft / ROUND_DURATION) * 100}
              className={`h-2 flex-1 ${timeLeft <= 10 ? '[&>div]:bg-rose-500' : '[&>div]:bg-amber-500'}`}
            />
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{score}</span>
            </div>
          </div>

          {/* Question progress */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              Question {currentIndex + 1} / {questions.length}
            </Badge>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              {correctCount}
              <XCircle className="ml-1 h-3.5 w-3.5 text-rose-500" />
              {wrongCount}
            </div>
          </div>

          {/* French word card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 py-8 text-center dark:border-amber-800 dark:from-amber-950/30 dark:to-orange-950/30">
                <CardContent>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Traduisez en arabe :</p>
                  <p className="text-2xl font-bold text-foreground sm:text-3xl">{question.french}</p>
                  <p className="mt-2 text-base font-semibold text-amber-700 dark:text-amber-400">
                    {question.correctPhonetic}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {question.options.map((option, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = i === question.correctIndex;
              const showCorrect = selectedAnswer !== null && isCorrect;
              const showWrong = selectedAnswer !== null && isSelected && !isCorrect;

              return (
                <motion.button
                  key={`${currentIndex}-${i}`}
                  whileHover={selectedAnswer === null ? { scale: 1.02 } : undefined}
                  whileTap={selectedAnswer === null ? { scale: 0.98 } : undefined}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedAnswer !== null}
                  className={`relative flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                    showCorrect
                      ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/30'
                      : showWrong
                        ? 'border-rose-400 bg-rose-50 dark:border-rose-600 dark:bg-rose-950/30'
                        : selectedAnswer === null
                          ? 'border-border bg-background hover:border-amber-300 hover:bg-amber-50/50 dark:hover:border-amber-700 dark:hover:bg-amber-950/20'
                          : 'border-border bg-muted/30 opacity-50'
                  }`}
                  {...(showWrong ? wrongAnim : undefined)}
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    showCorrect
                      ? 'bg-emerald-500 text-white'
                      : showWrong
                        ? 'bg-rose-500 text-white'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="font-arabic text-xl leading-relaxed">{option}</span>
                  {showCorrect && <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-500 shrink-0" />}
                  {showWrong && <XCircle className="ml-auto h-5 w-5 text-rose-500 shrink-0" />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ─── RESULTS ──────────────────────────────────────────────────── */}
      {phase === 'results' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="mb-3 text-6xl"
            >
              {accuracy >= 80 ? '🏆' : accuracy >= 50 ? '🔥' : '💪'}
            </motion.div>
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Round terminé !
              </span>
            </h1>
            <Badge className="mt-2" variant="outline">
              {DIFFICULTY_CONFIG[difficulty].icon} {DIFFICULTY_CONFIG[difficulty].label}
            </Badge>
          </div>

          {/* Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 py-6 text-center dark:border-amber-700 dark:from-amber-950/30 dark:to-orange-950/30">
              <CardContent>
                <p className="text-sm font-medium text-muted-foreground">Score final</p>
                <p className="mt-1 text-5xl font-black text-amber-600 dark:text-amber-400">{score}</p>
                <p className="mt-1 text-sm text-muted-foreground">points</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              icon={<Target className="h-4 w-4" />}
              iconBg="bg-emerald-100 dark:bg-emerald-950/50"
              iconColor="text-emerald-600 dark:text-emerald-400"
              value={`${accuracy}%`}
              label="Précision"
            />
            <StatCard
              icon={<CheckCircle2 className="h-4 w-4" />}
              iconBg="bg-emerald-100 dark:bg-emerald-950/50"
              iconColor="text-emerald-600 dark:text-emerald-400"
              value={`${correctCount}`}
              label="Correct"
            />
            <StatCard
              icon={<XCircle className="h-4 w-4" />}
              iconBg="bg-rose-100 dark:bg-rose-950/50"
              iconColor="text-rose-600 dark:text-rose-400"
              value={`${wrongCount}`}
              label="Incorrect"
            />
            <StatCard
              icon={<Clock className="h-4 w-4" />}
              iconBg="bg-amber-100 dark:bg-amber-950/50"
              iconColor="text-amber-600 dark:text-amber-400"
              value={`${avgReactionTime}ms`}
              label="Temps moyen"
            />
          </div>

          {/* Leaderboard for this difficulty */}
          {leaderboard.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Crown className="h-5 w-5 text-amber-500" />
                  Classement — {DIFFICULTY_CONFIG[difficulty].label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.map((entry, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${
                        i === 0 ? 'border-amber-300 bg-amber-50/80 dark:border-amber-700 dark:bg-amber-950/30' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                        <div>
                          <p className="text-sm font-semibold">{entry.score} pts</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.correct}/{entry.total} — {entry.avgTime > 0 ? `${entry.avgTime}ms` : '–'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => startGame(difficulty)}
              className="flex-1 gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
            >
              <RotateCcw className="h-4 w-4" />
              Rejouer
            </Button>
            <Button
              variant="outline"
              onClick={() => setPhase('menu')}
              className="flex-1 gap-2"
            >
              <Flame className="h-4 w-4" />
              Changer difficulté
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Stat Card sub-component ────────────────────────────────────────────
function StatCard({
  icon,
  iconBg,
  iconColor,
  value,
  label,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
}) {
  return (
    <Card>
      <CardContent className="p-3 text-center">
        <div className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
          <div className={iconColor}>{icon}</div>
        </div>
        <p className="text-lg font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
