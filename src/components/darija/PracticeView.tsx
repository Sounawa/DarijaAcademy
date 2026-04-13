'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { levels } from '@/data/curriculum';
import { useProgressStore } from '@/store/progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Zap,
  Home,
  RotateCcw,
  Trophy,
  Clock,
  Flame,
  Star,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Layers,
  Heart,
  Brain,
} from 'lucide-react';

interface VocabItem {
  french: string;
  arabic: string;
  key: string;
}

type PracticeMode = 'all' | 'level' | 'favorites' | 'srs';
type GamePhase = 'select' | 'playing' | 'results';

const QUESTIONS_PER_ROUND = 10;
const TIMER_SECONDS = 15;

/* Circular timer ring */
function TimerRing({ seconds, total }: { seconds: number; total: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progress = (seconds / total) * 100;
  const offset = circumference - (progress / 100) * circumference;
  const isLow = seconds <= 5;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={52} height={52} className="-rotate-90">
        <circle
          cx={26}
          cy={26}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          className="text-muted/30"
        />
        <circle
          cx={26}
          cy={26}
          r={radius}
          fill="none"
          stroke={isLow ? '#EF4444' : '#DAA520'}
          strokeWidth={3}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="quiz-progress-ring"
        />
      </svg>
      <span className={`absolute text-xs font-bold ${isLow ? 'text-red-500 animate-pulse' : 'text-foreground'}`}>
        {seconds}
      </span>
    </div>
  );
}

/* Confetti for 80%+ score */
function ConfettiParticles() {
  const colors = ['#F59E0B', '#EA580C', '#DAA520', '#10B981', '#F43F5E', '#1B9AAA'];
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: `${10 + i * 10}%`,
    delay: `${i * 0.12}s`,
    size: 6 + (i % 3) * 2,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="animate-confetti absolute bottom-0 rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/* Build a global vocab list from curriculum */
function getAllVocab(): VocabItem[] {
  const all: VocabItem[] = [];
  for (const level of levels) {
    for (const lesson of level.lessons) {
      lesson.vocabulary.forEach((v, idx) => {
        all.push({
          french: v.french,
          arabic: v.arabic,
          key: `${lesson.id}-${idx}`,
        });
      });
    }
  }
  return all;
}

function getLevelVocab(levelId: number): VocabItem[] {
  const level = levels.find((l) => l.id === levelId);
  if (!level) return [];
  const all: VocabItem[] = [];
  for (const lesson of level.lessons) {
    lesson.vocabulary.forEach((v, idx) => {
      all.push({
        french: v.french,
        arabic: v.arabic,
        key: `${lesson.id}-${idx}`,
      });
    });
  }
  return all;
}

const allVocab = getAllVocab();

export function PracticeView() {
  const {
    bookmarkedVocab,
    srsData,
    getSrsDueItems,
    setCurrentView,
    addPracticeScore,
    getPracticeLeaderboard,
  } = useProgressStore();

  const [phase, setPhase] = useState<GamePhase>('select');
  const [mode, setMode] = useState<PracticeMode>('all');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // Game state
  const [questions, setQuestions] = useState<{
    prompt: string;
    promptType: 'arabic' | 'french';
    options: string[];
    correctIndex: number;
    correctAnswer: string;
  }[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [feedbackAnimation, setFeedbackAnimation] = useState<'correct' | 'incorrect' | null>(null);
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Mode selection
  const [leaderboardMode, setLeaderboardMode] = useState<string | null>(null);
  const leaderboard = useMemo(
    () => (leaderboardMode ? getPracticeLeaderboard(leaderboardMode) : []),
    [leaderboardMode, getPracticeLeaderboard]
  );

  // Get vocab pool for selected mode
  const getVocabPool = useCallback((): VocabItem[] => {
    switch (mode) {
      case 'all':
        return allVocab;
      case 'level':
        return selectedLevel ? getLevelVocab(selectedLevel) : [];
      case 'favorites':
        return allVocab.filter((v) => bookmarkedVocab.includes(v.key));
      case 'srs': {
        const dueKeys = getSrsDueItems();
        return allVocab.filter((v) => dueKeys.includes(v.key));
      }
      default:
        return allVocab;
    }
  }, [mode, selectedLevel, bookmarkedVocab, getSrsDueItems]);

  // Generate questions
  const generateQuestions = useCallback(
    (pool: VocabItem[]) => {
      if (pool.length < 4) return [];

      const shuffledPool = shuffleArray(pool).slice(0, QUESTIONS_PER_ROUND);
      const qs = shuffledPool.map((item) => {
        // Alternate between arabic→french and french→arabic
        const promptType = Math.random() > 0.5 ? 'arabic' : 'french';
        const prompt = promptType === 'arabic' ? item.arabic : item.french;
        const correctAnswer = promptType === 'arabic' ? item.french : item.arabic;

        // Generate 3 wrong options
        const wrongPool = pool.filter((v) => v.key !== item.key);
        const wrongOptions = shuffleArray(wrongPool)
          .slice(0, 3)
          .map((v) => (promptType === 'arabic' ? v.french : v.arabic));

        const options = shuffleArray([correctAnswer, ...wrongOptions]);
        const correctIndex = options.indexOf(correctAnswer);

        return {
          prompt,
          promptType,
          options,
          correctIndex,
          correctAnswer,
        };
      });

      return qs;
    },
    []
  );

  // Start game
  const startGame = useCallback(() => {
    const pool = getVocabPool();
    if (pool.length < 4) return;

    const qs = generateQuestions(pool);
    if (qs.length === 0) return;

    setQuestions(qs);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(TIMER_SECONDS);
    setFeedbackAnimation(null);
    setPhase('playing');
    startTimeRef.current = Date.now();
  }, [getVocabPool, generateQuestions]);

  // Timer
  useEffect(() => {
    if (phase !== 'playing' || isAnswered) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - auto-answer wrong
          setIsAnswered(true);
          setStreak(0);
          setFeedbackAnimation('incorrect');
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [phase, isAnswered, currentQ]);

  // Handle answer
  const handleAnswer = useCallback(
    (index: number) => {
      if (isAnswered || phase !== 'playing') return;

      const question = questions[currentQ];
      if (!question) return;

      setSelectedAnswer(index);
      setIsAnswered(true);

      const isCorrect = index === question.correctIndex;

      if (isCorrect) {
        setScore((s) => s + 1);
        setStreak((s) => {
          const newStreak = s + 1;
          setBestStreak((b) => Math.max(b, newStreak));
          return newStreak;
        });
        setFeedbackAnimation('correct');
      } else {
        setStreak(0);
        setFeedbackAnimation('incorrect');
      }

      // Clear timer on answer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    },
    [isAnswered, phase, questions, currentQ]
  );

  // Next question or finish
  const handleNext = useCallback(() => {
    if (currentQ + 1 >= questions.length) {
      // Finish
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      setTotalTime(elapsed);
      setPhase('results');
      const modeKey = `${mode}${selectedLevel ? `-${selectedLevel}` : ''}`;
      addPracticeScore(modeKey, score + (questions[currentQ]?.correctIndex === selectedAnswer ? 1 : 0), questions.length, elapsed, bestStreak);
    } else {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(TIMER_SECONDS);
      setFeedbackAnimation(null);
    }
  }, [currentQ, questions.length, mode, selectedLevel, addPracticeScore, score, selectedAnswer, bestStreak, questions]);

  // Keyboard shortcuts
  useEffect(() => {
    if (phase !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleNext();
        }
        return;
      }

      if (e.key === '1') handleAnswer(0);
      if (e.key === '2') handleAnswer(1);
      if (e.key === '3') handleAnswer(2);
      if (e.key === '4') handleAnswer(3);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, isAnswered, handleAnswer, handleNext]);

  // Get mode label
  const getModeLabel = (m: PracticeMode): string => {
    switch (m) {
      case 'all': return 'Tous les niveaux';
      case 'level': return selectedLevel ? `Niveau ${selectedLevel}` : 'Niveau spécifique';
      case 'favorites': return 'Favoris';
      case 'srs': return 'À réviser (SRS)';
    }
  };

  const getModeVocabCount = (m: PracticeMode): number => {
    switch (m) {
      case 'all': return allVocab.length;
      case 'level': return selectedLevel ? getLevelVocab(selectedLevel).length : 0;
      case 'favorites': return bookmarkedVocab.length;
      case 'srs': return getSrsDueItems().length;
    }
  };

  // ═══ MODE SELECTION ═══
  if (phase === 'select' && !leaderboardMode) {
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
          <h1 className="flex items-center gap-2 text-xl font-extrabold">
            <Zap className="h-6 w-6 text-amber-500" />
            Pratique rapide
          </h1>
          <p className="text-xs text-muted-foreground">
            Testez vos connaissances avec des quiz chronométrés
          </p>
        </div>

        {/* Mode cards */}
        <div className="space-y-3 mb-6">
          {/* All levels */}
          <Card
            className="group gap-0 p-0 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            onClick={() => { setMode('all'); setSelectedLevel(null); setLeaderboardMode('all'); }}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm">
                <Layers className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold">Tous les niveaux</h3>
                <p className="text-xs text-muted-foreground">Mélange de tout le vocabulaire</p>
              </div>
              <Badge variant="secondary" className="shrink-0">{allVocab.length}</Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>

          {/* Per level */}
          <div className="space-y-2">
            {levels.map((level) => {
              const count = getLevelVocab(level.id).length;
              return (
                <Card
                  key={level.id}
                  className="group gap-0 p-0 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  onClick={() => { setMode('level'); setSelectedLevel(level.id); setLeaderboardMode(`level-${level.id}`); }}
                >
                  <CardContent className="flex items-center gap-4 p-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${level.color} text-white`}>
                      <span className="text-lg">{level.icon}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{level.title}</p>
                      <p className="font-arabic text-xs text-muted-foreground">{level.titleAr}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-[10px]">{count}</Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Favorites */}
          <Card
            className="group gap-0 p-0 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            onClick={() => { setMode('favorites'); setSelectedLevel(null); setLeaderboardMode('favorites'); }}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-sm">
                <Heart className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold">Favoris</h3>
                <p className="text-xs text-muted-foreground">Vocabulaire bookmarké</p>
              </div>
              <Badge variant="secondary" className="shrink-0">{bookmarkedVocab.length}</Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>

          {/* SRS due items */}
          <Card
            className="group gap-0 p-0 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            onClick={() => { setMode('srs'); setSelectedLevel(null); setLeaderboardMode('srs'); }}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm">
                <Brain className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold">À réviser (SRS)</h3>
                <p className="text-xs text-muted-foreground">Cartes dues pour révision espacée</p>
              </div>
              <Badge variant="secondary" className="shrink-0">{getSrsDueItems().length}</Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  }

  // ═══ LEADERBOARD + START ═══
  if (phase === 'select' && leaderboardMode) {
    const vocabCount = getModeVocabCount(mode);
    const modeKey = `${mode}${selectedLevel ? `-${selectedLevel}` : ''}`;
    const lb = getPracticeLeaderboard(modeKey);

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLeaderboardMode(null)}
          className="mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Changer de mode
        </Button>

        <div className="mb-6">
          <h1 className="text-lg font-extrabold">{getModeLabel(mode)}</h1>
          <p className="text-xs text-muted-foreground">
            {vocabCount} mots disponibles &middot; {QUESTIONS_PER_ROUND} questions par round
          </p>
        </div>

        {vocabCount < 4 ? (
          <Card className="gap-4 border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
            <CardContent className="p-6 text-center">
              <p className="text-3xl mb-2">📝</p>
              <p className="font-semibold">Pas assez de mots</p>
              <p className="text-sm text-muted-foreground">
                Il faut au moins 4 mots pour démarrer la pratique.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Button onClick={startGame} className="w-full gap-2 mb-6 text-base">
              <Zap className="h-5 w-5" />
              Commencer ({QUESTIONS_PER_ROUND} questions)
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Leaderboard */}
            {lb.length > 0 && (
              <Card className="gap-0 p-0">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <h3 className="text-sm font-semibold">Meilleurs scores</h3>
                  </div>
                  <div className="space-y-2">
                    {lb.slice(0, 5).map((entry, i) => {
                      const pct = Math.round((entry.score / entry.total) * 100);
                      const date = new Date(entry.date);
                      const dateStr = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-3 rounded-lg p-2.5 text-sm ${
                            i === 0 ? 'bg-amber-50 dark:bg-amber-950/30' : ''
                          }`}
                        >
                          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            i === 0 ? 'bg-amber-500 text-white' :
                            i === 1 ? 'bg-orange-400 text-white' :
                            i === 2 ? 'bg-amber-700 text-white' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <span className="font-semibold">{entry.score}/{entry.total}</span>
                            <span className="ml-2 text-xs text-muted-foreground">{pct}%</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {Math.floor(entry.time / 60)}:{String(entry.time % 60).padStart(2, '0')}
                            </span>
                            {entry.streak > 1 && (
                              <span className="flex items-center gap-1 text-orange-500">
                                <Flame className="h-3 w-3" />
                                {entry.streak}
                              </span>
                            )}
                            <span>{dateStr}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <p className="mt-4 text-center text-xs text-muted-foreground">
          ⌨️ <kbd className="rounded border px-1.5 py-0.5 font-mono text-[10px]">1-4</kbd> pour répondre &middot;
          <kbd className="rounded border px-1.5 py-0.5 font-mono text-[10px]">Entrée</kbd> pour continuer
        </p>
      </motion.div>
    );
  }

  // ═══ PLAYING ═══
  if (phase === 'playing') {
    const question = questions[currentQ];
    if (!question) return null;

    const progressPercent = ((currentQ + 1) / questions.length) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top bar */}
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPhase('select')}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Arrêter
          </Button>

          <div className="flex items-center gap-3">
            {/* Score */}
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-bold">{score}</span>
            </div>

            {/* Streak */}
            {streak > 1 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 dark:bg-orange-950/50"
              >
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{streak}</span>
              </motion.div>
            )}

            {/* Timer */}
            {!isAnswered && <TimerRing seconds={timeLeft} total={TIMER_SECONDS} />}
          </div>
        </div>

        {/* Progress */}
        <Progress value={progressPercent} className="mb-6 h-2" />

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className={feedbackAnimation === 'correct' ? 'animate-bounce-in' : feedbackAnimation === 'incorrect' ? 'animate-shake' : ''}
          >
            {/* Prompt card */}
            <Card className="mb-6 gap-4 border-amber-200/50 bg-gradient-to-r from-amber-50/30 to-transparent dark:border-amber-800/30 dark:from-amber-950/10">
              <CardContent className="p-6 text-center">
                <Badge variant="secondary" className="mb-3 text-[10px]">
                  {question.promptType === 'arabic' ? '📖 Quel est le français ?' : '🔤 Quel est l\'arabe ?'}
                </Badge>
                <p className={`text-3xl md:text-4xl font-bold leading-relaxed ${question.promptType === 'arabic' ? 'font-arabic dark:text-amber-200' : ''}`}>
                  {question.prompt}
                </p>
              </CardContent>
            </Card>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => {
                let optionStyle = 'quiz-option border-border';

                if (isAnswered) {
                  if (index === question.correctIndex) {
                    optionStyle = 'quiz-option answered border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/30';
                  } else if (index === selectedAnswer && index !== question.correctIndex) {
                    optionStyle = 'quiz-option answered border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-950/30';
                  } else {
                    optionStyle = 'quiz-option answered border-border opacity-50';
                  }
                }

                return (
                  <motion.div
                    key={`${currentQ}-${index}`}
                    whileTap={!isAnswered ? { scale: 0.98 } : undefined}
                  >
                    <Card
                      className={`gap-0 p-0 ${optionStyle}`}
                      onClick={() => handleAnswer(index)}
                    >
                      <CardContent className="flex items-center gap-3 p-4">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                          isAnswered && index === question.correctIndex
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                            : isAnswered && index === selectedAnswer
                              ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                              : 'bg-muted text-muted-foreground'
                        }`}>
                          {isAnswered && index === question.correctIndex ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : isAnswered && index === selectedAnswer ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <span className="text-xs">{index + 1}</span>
                          )}
                        </div>
                        <span className={`text-sm font-medium ${question.promptType === 'arabic' && isAnswered ? 'font-arabic' : ''}`}>
                          {option}
                        </span>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Feedback & Next */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                {/* Feedback message */}
                <div className={`mb-4 text-center text-sm font-semibold ${
                  feedbackAnimation === 'correct' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {feedbackAnimation === 'correct' ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Correct ! +10 points
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <XCircle className="h-4 w-4" />
                      La bonne réponse était : <span className="font-arabic dark:text-amber-200">{question.correctAnswer}</span>
                    </span>
                  )}
                </div>

                <Button onClick={handleNext} className="w-full gap-2 sm:w-auto">
                  {currentQ + 1 < questions.length ? 'Question suivante' : 'Voir les résultats'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Question {currentQ + 1} sur {questions.length}
        </p>
      </motion.div>
    );
  }

  // ═══ RESULTS ═══
  if (phase === 'results') {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const isGreat = pct >= 80;
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center py-8"
      >
        <Card className="w-full max-w-lg gap-6 text-center overflow-hidden">
          {isGreat && <ConfettiParticles />}
          <CardContent className="p-6 pt-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
              className="mb-4"
            >
              <div className="text-7xl">{pct === 100 ? '🏆' : isGreat ? '🌟' : pct >= 60 ? '👍' : '💪'}</div>
            </motion.div>

            <h2 className="mb-2 text-2xl font-extrabold">
              {pct === 100 ? 'Parfait !' : isGreat ? 'Excellent !' : pct >= 60 ? 'Bien joué !' : 'Continuez !'}
            </h2>
            <p className="mb-6 text-muted-foreground">{getModeLabel(mode)}</p>

            {/* Score */}
            <div className={`mb-6 inline-flex items-center gap-4 rounded-2xl p-5 ${
              isGreat
                ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 shadow-md dark:from-amber-950/40 dark:via-yellow-950/30 dark:to-orange-950/40'
                : 'bg-amber-50 dark:bg-amber-950/30'
            }`}>
              <div className={`flex h-14 w-14 items-center justify-center rounded-full ${
                isGreat
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30'
                  : 'bg-amber-100 dark:bg-amber-900/50'
              }`}>
                <Trophy className={`h-7 w-7 ${isGreat ? 'text-white' : 'text-amber-500'}`} />
              </div>
              <div className="text-left">
                <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                  {score}/{questions.length}
                </p>
                <p className="text-sm text-muted-foreground">{pct}% de bonnes réponses</p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-muted/50 p-3">
                <Clock className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-bold">{minutes}:{String(seconds).padStart(2, '0')}</p>
                <p className="text-[10px] text-muted-foreground">Temps</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <Flame className="mx-auto mb-1 h-4 w-4 text-orange-500" />
                <p className="text-sm font-bold">{bestStreak}</p>
                <p className="text-[10px] text-muted-foreground">Meilleure série</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <Zap className="mx-auto mb-1 h-4 w-4 text-amber-500" />
                <p className="text-sm font-bold">{score * 10}</p>
                <p className="text-[10px] text-muted-foreground">Points</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={startGame} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Recommencer
              </Button>
              <Button onClick={() => { setPhase('select'); setLeaderboardMode(null); }} variant="outline" className="gap-2">
                <Layers className="h-4 w-4" />
                Changer de mode
              </Button>
              <Button onClick={() => setCurrentView('home')} className="gap-2">
                <Home className="h-4 w-4" />
                Accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return null;
}
