'use client';

import { levels } from '@/data/curriculum';
import { useProgressStore } from '@/store/progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  BookOpen,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useMemo } from 'react';

/* Confetti particle component */
function ConfettiBurst({ show }: { show: boolean }) {
  const particles = useMemo(() => {
    if (!show) return [];
    const colors = ['#F59E0B', '#EA580C', '#DAA520', '#1B9AAA', '#2D6A4F', '#F43F5E', '#FBBF24'];
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      tx: (Math.random() - 0.5) * 160,
      ty: -(Math.random() * 120 + 40),
      tr: Math.random() * 720 - 360,
      delay: Math.random() * 0.3,
      size: Math.random() * 4 + 6,
    }));
  }, [show]);

  if (!show) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            '--tr': `${p.tr}deg`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            left: '50%',
            top: '50%',
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* Determine level accent hex color */
function getLevelColorHex(colorClass: string): string {
  if (colorClass.includes('amber')) return '#F59E0B';
  if (colorClass.includes('orange')) return '#F97316';
  if (colorClass.includes('emerald')) return '#10B981';
  if (colorClass.includes('rose')) return '#F43F5E';
  if (colorClass.includes('red')) return '#EF4444';
  if (colorClass.includes('cyan') || colorClass.includes('teal')) return '#1B9AAA';
  if (colorClass.includes('yellow')) return '#EAB308';
  return '#F59E0B';
}

export function LevelView() {
  const {
    currentLevel,
    setCurrentView,
    setCurrentLesson,
    completedLessons,
    getLevelProgress,
  } = useProgressStore();

  const level = levels.find((l) => l.id === currentLevel);
  if (!level) return null;

  const progress = getLevelProgress(level.id, level.lessons.length);
  const allCompleted = progress === 100;
  const levelColorHex = getLevelColorHex(level.color);

  /* Animated progress ring for each lesson */
  function LessonProgressRing({ completed, color }: { completed: boolean; color: string }) {
    const size = 20;
    const strokeWidth = 2.5;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = completed ? 0 : circumference;

    return (
      <svg width={size} height={size} className="shrink-0">
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
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="progress-ring-circle"
        />
      </svg>
    );
  }

  const handleStartLesson = (lessonId: string) => {
    setCurrentLesson(lessonId);
  };

  const handleFlashcards = () => {
    setCurrentView('flashcards');
  };

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
        onClick={() => setCurrentView('home')}
        className="mb-4"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Tous les niveaux
      </Button>

      {/* Level Header */}
      <div
        className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r shadow-xl dark:shadow-lg/30"
        style={{
          backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
        }}
      >
        <ConfettiBurst show={allCompleted} />
        <div className={`absolute inset-0 bg-gradient-to-r ${level.color}`} />
        {/* Shimmer overlay on header */}
        <div
          className="absolute inset-0 animate-shimmer pointer-events-none"
          style={{
            background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.06) 45%, transparent 60%)',
            backgroundSize: '200% 100%',
          }}
        />
        <div className="moroccan-pattern absolute inset-0 opacity-10" />

        <div className="relative z-10 p-6 md:p-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-4xl md:text-5xl">{level.icon}</span>
            <div>
              <h1 className="text-xl font-extrabold md:text-2xl text-white">
                Niveau {level.id} — {level.title}
              </h1>
              <p className="font-arabic text-sm text-white/80 md:text-base">
                {level.titleAr}
              </p>
            </div>
          </div>
          <p className="mb-4 text-sm text-white/85 md:text-base">
            {level.description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Badge className="border-0 bg-white/20 text-white backdrop-blur-sm">
              {level.cefrLevel}
            </Badge>
            <Badge className="border-0 bg-white/20 text-white backdrop-blur-sm">
              {level.lessons.length} leçons
            </Badge>
            <Badge className="border-0 bg-white/20 text-white backdrop-blur-sm">
              {progress}% complété
            </Badge>
          </div>

          <div className="mt-4">
            <Progress
              value={progress}
              className="h-2 bg-white/20 [&>div]:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={handleFlashcards}
          className="gap-2 transition-all duration-200 hover:shadow-sm"
        >
          <Sparkles className="h-4 w-4" />
          Flashcards
        </Button>
        {allCompleted && (
          <Button
            variant="outline"
            onClick={() => {
              const firstLesson = level.lessons[0];
              if (firstLesson) {
                useProgressStore.getState().setCurrentLesson(firstLesson.id);
                useProgressStore.getState().setCurrentView('quiz');
              }
            }}
            className="gap-2 transition-all duration-200 hover:shadow-sm"
          >
            <RotateCcw className="h-4 w-4" />
            Quiz du niveau
          </Button>
        )}
      </div>

      {/* Lessons List */}
      <div className="space-y-3">
        {level.lessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isNextUncompleted =
            !isCompleted &&
            index ===
              level.lessons.findIndex((l) => !completedLessons.includes(l.id));

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
            >
              <Card
                className={`group gap-0 overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:scale-[1.01] card-glow-border border-l-3 ${
                  isNextUncompleted
                    ? 'ring-2 ring-amber-400 dark:ring-amber-600'
                    : ''
                }`}
                style={{
                  borderLeftColor: isNextUncompleted ? levelColorHex : undefined,
                  borderLeftWidth: '3px',
                }}
              >
                <CardContent
                  className="flex cursor-pointer items-center gap-4 p-4"
                  onClick={() => handleStartLesson(lesson.id)}
                >
                  {/* Lesson number */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 group-hover:scale-105 parallax-icon ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                        : isNextUncompleted
                          ? `bg-gradient-to-br ${level.color} text-white shadow-sm`
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Lesson info */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold transition-colors group-hover:text-amber-700 dark:group-hover:text-amber-300">
                      {lesson.title}
                    </h3>
                    <p className="font-arabic text-xs text-muted-foreground">
                      {lesson.titleAr}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {lesson.description}
                    </p>
                  </div>

                  {/* Progress ring (visible when completed) */}
                  <LessonProgressRing completed={isCompleted} color={levelColorHex} />

                  {/* Right side */}
                  <div className="hidden sm:flex shrink-0 items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{lesson.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      <span>{lesson.vocabulary.length} mots</span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-500" />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
