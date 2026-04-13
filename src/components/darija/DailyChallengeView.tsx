'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { levels, type VocabularyItem } from '@/data/curriculum';
import { useProgressStore } from '@/store/progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Trophy,
  Flame,
  Home,
  Share2,
  Star,
  PartyPopper,
  ChevronRight,
} from 'lucide-react';

/* ─── Deterministic daily question generation ─── */

interface VocabEntry {
  item: VocabularyItem;
  levelId: number;
  lessonId: string;
}

interface ChallengeQuestion {
  french: string;
  correctArabic: string;
  options: string[];       // 4 Arabic options
  correctIndex: number;
  vocabEntry: VocabEntry;
}

function getAllVocab(): VocabEntry[] {
  const all: VocabEntry[] = [];
  for (const level of levels) {
    for (const lesson of level.lessons) {
      for (const item of lesson.vocabulary) {
        all.push({
          item,
          levelId: level.id,
          lessonId: lesson.id,
        });
      }
    }
  }
  return all;
}

/* Simple seeded PRNG (mulberry32) */
function seededRandom(seed: number) {
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function getTodayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getTodaySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

function generateDailyQuestions(allVocab: VocabEntry[]): ChallengeQuestion[] {
  const seed = getTodaySeed();
  const questions: ChallengeQuestion[] = [];
  const shuffled: number[] = [];

  // Create shuffled indices
  for (let i = 0; i < allVocab.length; i++) shuffled.push(i);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i * 7) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const count = Math.min(10, allVocab.length);

  for (let qi = 0; qi < count; qi++) {
    const entry = allVocab[shuffled[qi]];
    const correct = entry.item.arabic;

    // Pick 3 wrong answers
    const wrongPool: string[] = [];
    for (let wi = 0; wi < allVocab.length; wi++) {
      if (shuffled[wi] !== shuffled[qi]) {
        wrongPool.push(allVocab[wi].item.arabic);
      }
    }
    // Shuffle wrong pool with seed
    for (let i = wrongPool.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed + 9999 + qi * 13 + i) * (i + 1));
      [wrongPool[i], wrongPool[j]] = [wrongPool[j], wrongPool[i]];
    }

    // Pick first 3 unique wrong answers
    const wrongs: string[] = [];
    const usedSet = new Set([correct]);
    for (const w of wrongPool) {
      if (!usedSet.has(w) && wrongs.length < 3) {
        wrongs.push(w);
        usedSet.add(w);
      }
    }

    // Build options: place correct randomly
    const options = [...wrongs];
    const correctPos = Math.floor(seededRandom(seed + 50000 + qi * 17) * 4);
    options.splice(correctPos, 0, correct);

    questions.push({
      french: entry.item.french,
      correctArabic: correct,
      options,
      correctIndex: correctPos,
      vocabEntry: entry,
    });
  }

  return questions;
}

/* ─── French date formatting ─── */

function getFrenchDate(): string {
  const now = new Date();
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
  ];
  return `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

/* ─── Timer hook ─── */
function useCountdown(seconds: number, running: boolean, onExpire: (() => void) | undefined) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (running) {
      if (!startTimeRef.current) startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
        const remaining = Math.max(0, seconds - elapsed);
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          onExpireRef.current?.();
        }
      }, 200);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, seconds]);

  const reset = useCallback(() => {
    setTimeLeft(seconds);
    startTimeRef.current = running ? Date.now() : null;
  }, [seconds, running]);

  const getElapsedFormatted = useCallback(() => {
    if (!startTimeRef.current) return '00:00';
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, []);

  return { timeLeft, reset, getElapsedFormatted, startTimeRef };
}

/* ─── Confetti particles ─── */
function ConfettiBurst() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: ['#F59E0B', '#F97316', '#10B981', '#F43F5E', '#EAB308', '#1B9AAA'][
        Math.floor(Math.random() * 6)
      ],
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            y: -20,
            x: `${p.x}%`,
            opacity: 1,
            rotate: p.rotation,
          }}
          animate={{
            y: '110vh',
            opacity: 0,
            rotate: p.rotation + 720,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: p.delay,
            ease: 'easeIn',
          }}
          className="absolute"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Past scores dots ─── */
function PastScoresDots() {
  const { dailyChallenge, streak } = useProgressStore();

  // Generate last 7 days dots from stored challenge history
  const dots = useMemo(() => {
    const today = new Date();
    const results: { date: string; score: number; completed: boolean }[] = [];
    // We only have today's data in the store, so we'll show today + placeholder for past days
    // The dots reflect streak behavior
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (iso === dailyChallenge.date && dailyChallenge.completed) {
        results.push({ date: iso, score: dailyChallenge.score, completed: true });
      } else if (i < streak && i > 0) {
        // Assume they completed it during streak (show as green)
        results.push({ date: iso, score: 8, completed: true });
      } else {
        results.push({ date: iso, score: 0, completed: false });
      }
    }
    return results;
  }, [dailyChallenge, streak]);

  return (
    <div className="flex items-center gap-1.5">
      {dots.map((dot, i) => {
        let colorClass = 'bg-muted-foreground/15';
        if (dot.completed) {
          if (dot.score >= 8) colorClass = 'bg-emerald-500';
          else if (dot.score >= 5) colorClass = 'bg-amber-500';
          else colorClass = 'bg-rose-500';
        }
        return (
          <motion.div
            key={dot.date}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`h-3 w-3 rounded-full ${colorClass} transition-colors`}
            title={`${dot.date}${dot.completed ? ` — ${dot.score}/10` : ''}`}
          />
        );
      })}
    </div>
  );
}

/* ─── Score emoji ─── */
function getScoreEmoji(score: number): string {
  if (score === 10) return '🏆';
  if (score >= 8) return '🌟';
  if (score >= 6) return '👍';
  if (score >= 4) return '💪';
  if (score >= 2) return '📚';
  return '🤔';
}

function getScoreMessage(score: number): string {
  if (score === 10) return 'Parfait ! Score parfait !';
  if (score >= 8) return 'Excellent ! Continuez comme ça !';
  if (score >= 6) return 'Bien joué ! Vous progressez !';
  if (score >= 4) return 'Pas mal ! Encore un peu de pratique.';
  if (score >= 2) return 'Continuez à apprendre !';
  return 'Courage ! La pratique fait la perfection.';
}

/* ─── Main Component ─── */

type Screen = 'intro' | 'quiz' | 'results';

export function DailyChallengeView() {
  const {
    streak,
    setCurrentView,
    setDailyChallengeResult,
    getTodayChallengeStatus,
  } = useProgressStore();

  const allVocab = useMemo(() => getAllVocab(), []);
  const questions = useMemo(() => generateDailyQuestions(allVocab), [allVocab]);
  const challengeStatus = getTodayChallengeStatus();

  const [screen, setScreen] = useState<Screen>(challengeStatus.completed ? 'results' : 'intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizRunning, setQuizRunning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);

  const TOTAL_QUESTIONS = questions.length;
  const TOTAL_TIME = 5 * 60; // 5 minutes

  const { timeLeft, getElapsedFormatted, startTimeRef } = useCountdown(TOTAL_TIME, quizRunning, handleSubmitQuiz);

  const handleSubmitQuiz = useCallback(() => {
    setQuizRunning(false);
    setDailyChallengeResult(score, answers.length > 0 ? answers : Array(TOTAL_QUESTIONS).fill(-1));
    setScreen('results');
    if (score === 10) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [score, answers, TOTAL_QUESTIONS, setDailyChallengeResult]);

  const handleStartQuiz = () => {
    setCurrentQ(0);
    setScore(0);
    setSelectedIdx(null);
    setIsAnswered(false);
    setAnswers([]);
    setQuizRunning(true);
    setScreen('quiz');
    startTimeRef.current = Date.now();
  };

  const handleSelectAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    const isCorrect = idx === questions[currentQ].correctIndex;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    setAnswers([...answers, idx]);
  };

  const handleNextQuestion = () => {
    if (currentQ + 1 >= TOTAL_QUESTIONS) {
      setQuizRunning(false);
      handleSubmitQuiz();
    } else {
      setCurrentQ(currentQ + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    }
  };

  const handleShare = async () => {
    const text = `🎯 Défi du jour DarijaAcademy\n📊 Score: ${score}/${TOTAL_QUESTIONS}\n🔥 Série: ${streak} jours\n🇲🇦 Apprendre le darija marocain`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const timerPercent = (timeLeft / TOTAL_TIME) * 100;
  const isTimerLow = timeLeft <= 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {showConfetti && <ConfettiBurst />}

      {/* ─── INTRO SCREEN ─── */}
      <AnimatePresence mode="wait">
        {screen === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <Card className="w-full max-w-md overflow-hidden border-0 shadow-xl">
              {/* Gradient header */}
              <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-8 text-center text-white dark:from-amber-700 dark:via-orange-700 dark:to-rose-700">
                <div className="moroccan-pattern absolute inset-0 opacity-10 pointer-events-none" />
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  >
                    <Calendar className="mx-auto mb-3 h-12 w-12 text-white/90" />
                  </motion.div>
                  <h1 className="mb-1 text-2xl font-extrabold md:text-3xl">Défi du jour</h1>
                  <p className="text-sm text-white/80">{getFrenchDate()}</p>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Info items */}
                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30">
                      <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">10 questions aléatoires</p>
                      <p className="text-xs text-muted-foreground">Tous les niveaux confondus</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/30">
                      <Clock className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">5 minutes</p>
                      <p className="text-xs text-muted-foreground">Chronomètre automatique</p>
                    </div>
                  </div>

                  {streak > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/30">
                        <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Série : {streak} jour{streak > 1 ? 's' : ''}</p>
                        <p className="text-xs text-muted-foreground">Continuez votre série !</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Past 7 days dots */}
                <div className="mb-6 rounded-lg bg-muted/50 p-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">7 derniers jours</p>
                  <PastScoresDots />
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground/60">
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> 80%+
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-amber-500" /> 50-79%
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-rose-500" /> &lt;50%
                    </span>
                  </div>
                </div>

                {/* Start button */}
                <Button
                  onClick={handleStartQuiz}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-600"
                  size="lg"
                >
                  Lancer le défi !
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ─── QUIZ SCREEN ─── */}
        {screen === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto max-w-lg"
          >
            {/* Timer bar */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className={`h-4 w-4 ${isTimerLow ? 'text-rose-500 animate-pulse' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-mono font-bold ${isTimerLow ? 'text-rose-500' : 'text-foreground'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {currentQ + 1} / {TOTAL_QUESTIONS}
                </Badge>
              </div>
              <Progress
                value={timerPercent}
                className={`h-1.5 ${isTimerLow ? '[&>div]:bg-rose-500' : ''}`}
              />
            </div>

            {/* Question progress */}
            <div className="mb-4 flex gap-1">
              {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i < currentQ
                      ? answers[i] === questions[i].correctIndex
                        ? 'bg-emerald-500'
                        : 'bg-rose-500'
                      : i === currentQ
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                        : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Question card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="mb-4 overflow-hidden border-0 shadow-lg">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 text-center dark:from-amber-950/40 dark:to-orange-950/40">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Traduisez en darija
                    </p>
                    <p className="text-2xl font-bold text-foreground md:text-3xl">
                      {questions[currentQ].french}
                    </p>
                  </div>
                </Card>

                {/* Options */}
                <div className="space-y-2">
                  {questions[currentQ].options.map((option, idx) => {
                    let optionStyle = 'border-border hover:border-amber-400/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20';
                    if (isAnswered) {
                      if (idx === questions[currentQ].correctIndex) {
                        optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-600';
                      } else if (idx === selectedIdx && idx !== questions[currentQ].correctIndex) {
                        optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-600';
                      } else {
                        optionStyle = 'border-border opacity-50';
                      }
                    } else if (idx === selectedIdx) {
                      optionStyle = 'border-amber-500 bg-amber-50 dark:bg-amber-950/30';
                    }

                    return (
                      <motion.button
                        key={idx}
                        whileTap={!isAnswered ? { scale: 0.98 } : undefined}
                        onClick={() => handleSelectAnswer(idx)}
                        disabled={isAnswered}
                        className={`w-full rounded-xl border-2 p-4 text-left transition-all duration-200 ${optionStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="font-arabic text-lg font-medium">
                            {option}
                          </span>
                          {isAnswered && idx === questions[currentQ].correctIndex && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto text-emerald-600"
                            >
                              ✓
                            </motion.span>
                          )}
                          {isAnswered && idx === selectedIdx && idx !== questions[currentQ].correctIndex && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto text-rose-600"
                            >
                              ✗
                            </motion.span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Correct answer reveal + Next button */}
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    {/* Show correct arabic */}
                    <Card className="mb-4 border-0 bg-muted/50">
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground">Bonne réponse :</p>
                        <p className="font-arabic text-xl font-bold text-emerald-600 dark:text-emerald-400">
                          {questions[currentQ].correctArabic}
                        </p>
                      </CardContent>
                    </Card>

                    <Button
                      onClick={handleNextQuestion}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                      size="lg"
                    >
                      {currentQ + 1 >= TOTAL_QUESTIONS ? 'Voir les résultats' : 'Question suivante'}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Score indicator */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">
                Score : <span className="text-amber-600 dark:text-amber-400">{score}</span> / {TOTAL_QUESTIONS}
              </span>
            </div>
          </motion.div>
        )}

        {/* ─── RESULTS SCREEN ─── */}
        {screen === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto max-w-md"
          >
            <Card className="overflow-hidden border-0 shadow-xl">
              {/* Gradient header */}
              <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-8 text-center text-white dark:from-amber-700 dark:via-orange-700 dark:to-rose-700">
                <div className="moroccan-pattern absolute inset-0 opacity-10 pointer-events-none" />
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="mb-2 text-5xl"
                  >
                    {getScoreEmoji(score)}
                  </motion.div>
                  <h2 className="mb-1 text-2xl font-extrabold">
                    {score} / {TOTAL_QUESTIONS}
                  </h2>
                  <p className="text-sm text-white/80">{getScoreMessage(score)}</p>
                  {score === 10 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm"
                    >
                      <PartyPopper className="h-3.5 w-3.5" />
                      Score parfait ! 🎉
                    </motion.div>
                  )}
                </div>
              </div>

              <CardContent className="p-6">
                {/* Time taken */}
                <div className="mb-4 flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span className="text-sm text-muted-foreground">Temps écoulé</span>
                  <span className="text-sm font-mono font-bold">{getElapsedFormatted()}</span>
                </div>

                {/* Streak update */}
                <div className="mb-4 flex items-center gap-3 rounded-lg bg-orange-50 p-3 dark:bg-orange-950/30">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
                      Série de {streak} jour{streak > 1 ? 's' : ''} !
                    </p>
                    <p className="text-xs text-orange-600/70 dark:text-orange-400/70">
                      {streak >= 3 ? 'Continue comme ça ! 🔥' : 'Revenez demain pour continuer !'}
                    </p>
                  </div>
                </div>

                {/* Past scores */}
                <div className="mb-6 rounded-lg bg-muted/50 p-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">7 derniers jours</p>
                  <PastScoresDots />
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    {copied ? '✓ Copié !' : 'Partager'}
                  </Button>

                  <Button
                    onClick={() => setCurrentView('home')}
                    className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                  >
                    <Home className="h-4 w-4" />
                    Retour à l&apos;accueil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
