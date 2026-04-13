'use client';

import { useState, useEffect, useRef } from 'react';
import { levels } from '@/data/curriculum';
import { useProgressStore } from '@/store/progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  BookOpen,
  Sparkles,
} from 'lucide-react';

/* Quiz progress ring component */
function QuizProgressRing({
  current,
  total,
  size = 44,
  strokeWidth = 3,
}: {
  current: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? (current / total) * 100 : 0;
  const offset = circumference - (progress / 100) * circumference;

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
          className="text-muted/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F59E0B"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="quiz-progress-ring"
        />
      </svg>
      <span className="absolute text-xs font-bold text-foreground">
        {current}/{total}
      </span>
    </div>
  );
}

/* Confetti particles for perfect score */
function ConfettiParticles() {
  const colors = ['#F59E0B', '#EA580C', '#DAA520', '#10B981', '#F43F5E', '#1B9AAA'];
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: `${15 + i * 14}%`,
    delay: `${i * 0.15}s`,
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

export function QuizView() {
  const {
    currentLevel,
    currentLesson,
    setCurrentView,
    setCurrentLesson,
    setCurrentLevel,
    setQuizScore,
    completeLesson,
    addVocabToSrs,
    addWrongAnswer,
  } = useProgressStore();

  const level = levels.find((l) => l.id === currentLevel);
  const lesson = level?.lessons.find((l) => l.id === currentLesson);

  // All hooks before early return
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState<
    { correct: boolean; selectedIndex: number; correctIndex: number }[]
  >([]);
  const [answerAnimation, setAnswerAnimation] = useState<'correct' | 'incorrect' | null>(null);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  /* Animated score counter for results */
  useEffect(() => {
    if (!isFinished) {
      queueMicrotask(() => setAnimatedScore(0));
      return;
    }
    let current = 0;
    const step = Math.max(1, Math.ceil(score / 30));
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
  }, [isFinished, score]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    };
  }, []);

  const quiz = lesson?.quiz ?? [];
  const question = quiz[currentQuestion];
  const progressPercent =
    quiz.length > 0
      ? ((currentQuestion + 1) / quiz.length) * 100
      : 0;

  const handleSelectAnswer = (index: number) => {
    if (isAnswered || !question) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === question.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
      setAnswerAnimation('correct');
    } else {
      setAnswerAnimation('incorrect');
      // Record wrong answer for review
      if (lesson) {
        addWrongAnswer({
          questionId: `${lesson.id}-q${currentQuestion}`,
          question: question.question,
          correctAnswer: question.options[question.correctIndex],
          userAnswer: question.options[index],
          lessonId: lesson.id,
        });
      }
    }
    setAnswers((a) => [
      ...a,
      {
        correct: isCorrect,
        selectedIndex: index,
        correctIndex: question.correctIndex,
      },
    ]);

    // Clear animation after it plays
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    animationTimeoutRef.current = setTimeout(() => {
      setAnswerAnimation(null);
    }, 600);
  };

  const handleNext = () => {
    if (currentQuestion + 1 < quiz.length) {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setAnswerAnimation(null);
    } else {
      const percentage = quiz.length > 0 ? Math.round((score / quiz.length) * 100) : 0;
      if (lesson) {
        setQuizScore(lesson.id, percentage);
        completeLesson(lesson.id);
        // Auto-populate SRS with lesson vocabulary
        const vocabKeys = lesson.vocabulary.map((_, idx) => `${lesson.id}-${idx}`);
        addVocabToSrs(vocabKeys);
      }
      setIsFinished(true);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setAnswers([]);
    setAnswerAnimation(null);
  };

  const handleBackToLesson = () => {
    setCurrentLesson(currentLesson);
  };

  const handleBackToLevel = () => {
    setCurrentLevel(currentLevel);
  };

  const getScoreEmoji = () => {
    const pct = quiz.length > 0 ? Math.round((score / quiz.length) * 100) : 0;
    if (pct === 100) return '🏆';
    if (pct >= 80) return '🌟';
    if (pct >= 60) return '👍';
    if (pct >= 40) return '📚';
    return '💪';
  };

  const getScoreMessage = () => {
    const pct = quiz.length > 0 ? Math.round((score / quiz.length) * 100) : 0;
    if (pct === 100) return 'Parfait ! Vous maîtrisez cette leçon !';
    if (pct >= 80) return 'Excellent ! Quelques révisions et ce sera parfait.';
    if (pct >= 60) return 'Bien joué ! Continuez vos efforts.';
    if (pct >= 40) return 'Pas mal ! Relisez la leçon et réessayez.';
    return 'Courage ! La pratique fait la perfection.';
  };

  // Early return AFTER all hooks
  if (!level || !lesson || !question) return null;

  // Results screen
  if (isFinished) {
    const percentage = Math.round((score / quiz.length) * 100);
    const isPerfect = percentage === 100;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center py-8"
      >
        <Card className="w-full max-w-lg gap-6 text-center overflow-hidden">
          {/* Confetti for perfect score */}
          {isPerfect && <ConfettiParticles />}

          <CardContent className="p-6 pt-8">
            {/* Trophy section - more dramatic */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 12,
                delay: 0.2,
              }}
              className="mb-4 relative inline-block"
            >
              <div
                className={`text-7xl ${
                  isPerfect
                    ? 'drop-shadow-lg'
                    : ''
                }`}
                style={
                  isPerfect
                    ? {
                        filter: 'drop-shadow(0 0 20px rgba(218, 165, 32, 0.4)) drop-shadow(0 0 40px rgba(218, 165, 32, 0.2))',
                      }
                    : undefined
                }
              >
                {getScoreEmoji()}
              </div>
              {/* Glow ring behind trophy for perfect score */}
              {isPerfect && (
                <motion.div
                  className="absolute inset-0 -m-4 rounded-full"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  style={{
                    background: 'radial-gradient(circle, rgba(218, 165, 32, 0.15) 0%, transparent 70%)',
                  }}
                />
              )}
            </motion.div>

            <h2 className="mb-2 text-2xl font-extrabold">
              Quiz terminé !
            </h2>
            <p className="mb-6 text-muted-foreground">{getScoreMessage()}</p>

            {/* Score display - more dramatic */}
            <div className={`mb-6 animate-score-reveal inline-flex items-center gap-4 rounded-2xl p-5 ${
              isPerfect
                ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 shadow-md dark:from-amber-950/40 dark:via-yellow-950/30 dark:to-orange-950/40'
                : 'bg-amber-50 dark:bg-amber-950/30'
            }`}>
              <div className={`flex h-14 w-14 items-center justify-center rounded-full ${
                isPerfect
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30'
                  : 'bg-amber-100 dark:bg-amber-900/50'
              }`}>
                <Trophy className={`h-7 w-7 ${isPerfect ? 'text-white' : 'text-amber-500'}`} />
              </div>
              <div className="text-left">
                <motion.p
                  className="text-3xl font-extrabold text-amber-600 dark:text-amber-400"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 12 }}
                >
                  {animatedScore}/{quiz.length}
                </motion.p>
                <p className="text-sm text-muted-foreground">{percentage}% de bonnes réponses</p>
              </div>
            </div>

            {/* Answer review */}
            <div className="mb-6 space-y-2 text-left">
              <p className="text-sm font-semibold">Résumé :</p>
              {answers.map((a, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 rounded-lg p-2.5 text-xs transition-colors ${
                    a.correct
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                  }`}
                >
                  {a.correct ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span className="truncate">
                    Q{i + 1}: {quiz[i].question.slice(0, 50)}
                    {quiz[i].question.length > 50 ? '...' : ''}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={handleRetake} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Recommencer
              </Button>
              <Button onClick={handleBackToLesson} variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Retour à la leçon
              </Button>
              <Button onClick={handleBackToLevel} className="gap-2 btn-primary-glow">
                <Sparkles className="h-4 w-4" />
                Autres leçons
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Quiz question screen
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
        onClick={handleBackToLesson}
        className="mb-4"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        {lesson.title}
      </Button>

      {/* Quiz Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-extrabold">
            Quiz — {lesson.title}
          </h1>
          <p className="text-xs text-muted-foreground">
            Question {currentQuestion + 1} sur {quiz.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <QuizProgressRing current={currentQuestion + 1} total={quiz.length} />
          <Badge variant="outline" className="text-xs">
            Score: {score}/{quiz.length}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <Progress value={progressPercent} className="mb-8 h-2" />

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className={answerAnimation === 'correct' ? 'animate-bounce-in' : answerAnimation === 'incorrect' ? 'animate-shake' : ''}
        >
          <Card className="mb-6 gap-4 border-amber-200/50 bg-gradient-to-r from-amber-50/30 to-transparent dark:border-amber-800/30 dark:from-amber-950/10 card-glow-border">
            <CardContent className="p-6">
              <h2 className="text-base font-semibold leading-relaxed md:text-lg">
                {question.question}
              </h2>
              {question.hint && !isAnswered && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  💡 Indice : {question.hint}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              let optionStyle = 'quiz-option border-border';

              if (isAnswered) {
                if (index === question.correctIndex) {
                  optionStyle =
                    'quiz-option answered border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/30';
                } else if (index === selectedAnswer) {
                  optionStyle =
                    'quiz-option answered border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-950/30';
                } else {
                  optionStyle = 'quiz-option answered border-border opacity-50';
                }
              }

              return (
                <motion.div
                  key={index}
                  whileTap={!isAnswered ? { scale: 0.98 } : undefined}
                >
                  <Card
                    className={`gap-0 p-0 ${optionStyle} ${!isAnswered ? 'active:scale-[0.98]' : ''}`}
                    onClick={() => handleSelectAnswer(index)}
                  >
                    <CardContent className="flex items-center gap-3 p-4">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                          isAnswered && index === question.correctIndex
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                            : isAnswered && index === selectedAnswer
                              ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isAnswered && index === question.correctIndex ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : isAnswered && index === selectedAnswer ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </div>
                      <span className="text-sm font-medium">{option}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Next button */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Button onClick={handleNext} className="w-full gap-2 sm:w-auto btn-primary-glow">
                {currentQuestion + 1 < quiz.length
                  ? 'Question suivante'
                  : 'Voir les résultats'}
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
