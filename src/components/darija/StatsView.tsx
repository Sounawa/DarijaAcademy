'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/store/progress-store';
import { levels, type Lesson } from '@/data/curriculum';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Target,
  Flame,
  Sparkles,
  Trophy,
  Calendar,
  ChevronLeft,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const TOTAL_LESSONS = 38;

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

function getLessonById(id: string): Lesson | undefined {
  for (const level of levels) {
    const found = level.lessons.find((l) => l.id === id);
    if (found) return found;
  }
  return undefined;
}

function getScoreEmoji(score: number): string {
  if (score >= 80) return '🌟';
  if (score >= 60) return '👍';
  if (score >= 40) return '📚';
  return '💪';
}

interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  unlocked: boolean;
}

function getBarColor(percent: number): string {
  if (percent === 100) return '#059669';
  if (percent >= 75) return '#d97706';
  if (percent >= 50) return '#ea580c';
  if (percent > 0) return '#f59e0b';
  return '#d1d5db';
}

// Custom tooltip for the bar chart
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold">{label}</p>
      <p className="text-xs text-muted-foreground">{payload[0].value}% complété</p>
    </div>
  );
}

export function StatsView() {
  const {
    completedLessons,
    quizScores,
    streak,
    completionDates,
    setCurrentLevel,
    setCurrentLesson,
  } = useProgressStore();

  // ─── Computed data ─────────────────────────────────────────────
  const computed = useMemo(() => {
    // Words learned (vocabulary from completed lessons)
    let wordsLearned = 0;
    completedLessons.forEach((lessonId) => {
      const lesson = getLessonById(lessonId);
      if (lesson) wordsLearned += lesson.vocabulary.length;
    });

    // Average quiz score
    const scoreValues = Object.values(quizScores);
    const avgScore =
      scoreValues.length > 0
        ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
        : 0;

    // Perfect scores count
    const perfectCount = scoreValues.filter((s) => s === 100).length;

    // Level progress data for chart
    const levelChartData = levels.map((level) => {
      const total = level.lessons.length;
      const prefix = `${level.id}-`;
      const completed = completedLessons.filter((id) => id.startsWith(prefix)).length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        name: `L${level.id} ${level.cefrLevel}`,
        fullName: level.title,
        percent,
        completed,
        total,
      };
    });

    // Quiz score history (sorted by completion date)
    const quizHistory = Object.entries(quizScores)
      .map(([lessonId, score]) => {
        const lesson = getLessonById(lessonId);
        return {
          lessonId,
          title: lesson?.title ?? lessonId,
          score,
          date: completionDates[lessonId] ?? null,
          emoji: getScoreEmoji(score),
        };
      })
      .sort((a, b) => {
        if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (a.date) return -1;
        if (b.date) return 1;
        return 0;
      });

    // Weekly activity (last 7 days)
    const today = new Date();
    const weekDays: Array<{ date: string; label: string; count: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('fr-FR', { weekday: 'short' });
      const count = Object.values(completionDates).filter(
        (iso) => iso.split('T')[0] === dateStr
      ).length;
      weekDays.push({ date: dateStr, label: dayLabel, count });
    }

    // Achievements
    const achievements: Achievement[] = [
      {
        id: 'debutant',
        emoji: '🌱',
        title: 'Débutant',
        description: 'Complétez votre première leçon',
        unlocked: completedLessons.length >= 1,
      },
      {
        id: 'apprenant',
        emoji: '📚',
        title: 'Apprenant',
        description: 'Complétez 10 leçons',
        unlocked: completedLessons.length >= 10,
      },
      {
        id: 'etudiant',
        emoji: '🎓',
        title: 'Étudiant',
        description: 'Complétez 25 leçons',
        unlocked: completedLessons.length >= 25,
      },
      {
        id: 'expert',
        emoji: '🏆',
        title: 'Expert',
        description: `Complétez les ${TOTAL_LESSONS} leçons`,
        unlocked: completedLessons.length >= TOTAL_LESSONS,
      },
      {
        id: 'streak3',
        emoji: '🔥',
        title: 'Série de 3 jours',
        description: 'Maintenez une série de 3 jours',
        unlocked: streak >= 3,
      },
      {
        id: 'perfect',
        emoji: '⭐',
        title: 'Score parfait',
        description: 'Obtenez 100% à un quiz',
        unlocked: perfectCount >= 1,
      },
      {
        id: 'threePerfect',
        emoji: '💯',
        title: 'Trois parfaits',
        description: 'Obtenez 100% à 3 quiz',
        unlocked: perfectCount >= 3,
      },
      {
        id: 'dedicated',
        emoji: '🗓️',
        title: 'Dédié',
        description: 'Maintenez une série de 7 jours',
        unlocked: streak >= 7,
      },
    ];

    // Level breakdown
    const levelBreakdown = levels.map((level) => {
      const prefix = `${level.id}-`;
      const completedIds = completedLessons.filter((id) => id.startsWith(prefix));
      const lessonDetails = level.lessons.map((lesson) => ({
        ...lesson,
        isCompleted: completedLessons.includes(lesson.id),
        score: quizScores[lesson.id] ?? null,
        completionDate: completionDates[lesson.id] ?? null,
      }));
      const scores = lessonDetails
        .map((l) => l.score)
        .filter((s): s is number => s !== null);
      const bestScore = scores.length > 0 ? Math.max(...scores) : null;
      return {
        id: level.id,
        title: level.title,
        titleAr: level.titleAr,
        icon: level.icon,
        cefrLevel: level.cefrLevel,
        completedCount: completedIds.length,
        totalCount: level.lessons.length,
        percent: level.lessons.length > 0 ? Math.round((completedIds.length / level.lessons.length) * 100) : 0,
        lessons: lessonDetails,
        bestScore,
      };
    });

    return {
      wordsLearned,
      avgScore,
      perfectCount,
      levelChartData,
      quizHistory,
      weekDays,
      achievements,
      levelBreakdown,
    };
  }, [completedLessons, quizScores, streak, completionDates]);

  const hasSomeProgress =
    completedLessons.length > 0 || Object.keys(quizScores).length > 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Statistiques
            </span>{' '}
            & Progression
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Suivez votre apprentissage du darija marocain
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentLevel(1)}
          className="hidden sm:flex"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Retour aux cours
        </Button>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          Section A – Overview Cards
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <OverviewCard
          icon={<BookOpen className="h-5 w-5" />}
          iconBg="bg-amber-100 dark:bg-amber-950/60"
          iconColor="text-amber-600 dark:text-amber-400"
          label="Leçons complétées"
          value={`${completedLessons.length}`}
          subtitle={`sur ${TOTAL_LESSONS}`}
          progress={(completedLessons.length / TOTAL_LESSONS) * 100}
        />
        <OverviewCard
          icon={<Target className="h-5 w-5" />}
          iconBg="bg-emerald-100 dark:bg-emerald-950/60"
          iconColor="text-emerald-600 dark:text-emerald-400"
          label="Score moyen"
          value={`${computed.avgScore}%`}
          subtitle={Object.keys(quizScores).length > 0 ? `${Object.keys(quizScores).length} quiz${Object.keys(quizScores).length > 1 ? 'z' : ''}` : 'Aucun quiz'}
          progress={computed.avgScore}
        />
        <OverviewCard
          icon={<Flame className="h-5 w-5" />}
          iconBg="bg-orange-100 dark:bg-orange-950/60"
          iconColor="text-orange-600 dark:text-orange-400"
          label="Série actuelle"
          value={`${streak}`}
          subtitle={streak === 1 ? 'jour' : 'jours'}
          progress={Math.min((streak / 7) * 100, 100)}
        />
        <OverviewCard
          icon={<Sparkles className="h-5 w-5" />}
          iconBg="bg-rose-100 dark:bg-rose-950/60"
          iconColor="text-rose-600 dark:text-rose-400"
          label="Mots appris"
          value={`${computed.wordsLearned}`}
          subtitle={`vocabulaires`}
          progress={Math.min((computed.wordsLearned / 600) * 100, 100)}
        />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          Section B – Progress by Level (Bar Chart)
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-5 w-5 text-amber-500" />
              Progression par niveau
            </CardTitle>
            <CardDescription>
              Pourcentage de complétion pour chaque niveau CEFR
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[500px]">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={computed.levelChartData}
                    margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => `${v}%`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                    <Bar dataKey="percent" radius={[6, 6, 0, 0]} maxBarSize={42}>
                      {computed.levelChartData.map((entry, index) => (
                        <Cell key={index} fill={getBarColor(entry.percent)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Level legend */}
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {computed.levelChartData.map((level) => (
                <div
                  key={level.name}
                  className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2"
                >
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: getBarColor(level.percent) }}
                  />
                  <span className="text-xs font-medium">{level.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {level.completed}/{level.total}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Two-column layout for Quiz Scores + Weekly Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ═══════════════════════════════════════════════════════════
            Section C – Quiz Scores History
            ═══════════════════════════════════════════════════════════ */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-emerald-500" />
                Historique des quiz
              </CardTitle>
              <CardDescription>
                {computed.quizHistory.length > 0
                  ? `${computed.quizHistory.length} quiz complété${computed.quizHistory.length > 1 ? 's' : ''}`
                  : 'Passez des quiz pour voir vos résultats'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {computed.quizHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-3 text-4xl opacity-40 empty-state-float">📝</div>
                  <p className="text-sm text-muted-foreground">
                    Aucun quiz complété pour le moment.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Complétez des leçons et passez les quiz !
                  </p>
                </div>
              ) : (
                <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                  {computed.quizHistory.map((entry) => (
                    <div
                      key={entry.lessonId}
                      className="flex items-center justify-between rounded-lg border px-3 py-2.5 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-lg shrink-0">{entry.emoji}</span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{entry.title}</p>
                          {entry.date && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(entry.date).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-16">
                          <Progress value={entry.score} className="h-1.5" />
                        </div>
                        <Badge
                          variant={entry.score >= 80 ? 'default' : 'secondary'}
                          className={
                            entry.score >= 80
                              ? 'bg-emerald-600 hover:bg-emerald-700'
                              : entry.score >= 60
                                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                : ''
                          }
                        >
                          {entry.score}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            Section D – Weekly Activity
            ═══════════════════════════════════════════════════════════ */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5 text-orange-500" />
                Activité hebdomadaire
              </CardTitle>
              <CardDescription>Leçons complétées au cours des 7 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(completionDates).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-3 text-4xl opacity-40 empty-state-float">📊</div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pas encore d&apos;activité enregistrée
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Commencez votre première leçon pour suivre votre progression quotidienne !
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {computed.weekDays.map((day) => {
                    const isToday = day.date === new Date().toISOString().split('T')[0];
                    const maxCount = Math.max(...computed.weekDays.map((d) => d.count), 1);
                    return (
                      <div key={day.date} className="flex items-center gap-3">
                        <span
                          className={`w-10 shrink-0 text-xs font-medium capitalize ${
                            isToday
                              ? 'text-amber-600 dark:text-amber-400 font-bold'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {day.label}
                        </span>
                        <div className="relative h-7 flex-1 rounded-md bg-muted/50">
                          <div
                            className={`absolute inset-y-0 left-0 rounded-md transition-all duration-500 ${
                              day.count > 0
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                : ''
                            }`}
                            style={{
                              width: day.count > 0 ? `${Math.max((day.count / maxCount) * 100, 15)}%` : '0%',
                            }}
                          />
                          <span className="absolute inset-0 flex items-center px-2 text-xs font-semibold">
                            {day.count > 0 ? `${day.count} leçon${day.count > 1 ? 's' : ''}` : '—'}
                          </span>
                        </div>
                        {isToday && (
                          <Badge variant="outline" className="shrink-0 text-[10px]">
                            Aujourd&apos;hui
                          </Badge>
                        )}
                      </div>
                    );
                  })}

                  {/* Total this week */}
                  <div className="mt-4 flex items-center justify-between rounded-lg bg-amber-50 px-4 py-3 dark:bg-amber-950/30">
                    <span className="text-sm font-medium">Total cette semaine</span>
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      {computed.weekDays.reduce((acc, d) => acc + d.count, 0)} leçons
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          Section E – Achievements
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-5 w-5 text-amber-500" />
              Succès
            </CardTitle>
            <CardDescription>
              {computed.achievements.filter((a) => a.unlocked).length} /{' '}
              {computed.achievements.length} succès débloqués
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {computed.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`relative flex flex-col items-center gap-2 rounded-xl border px-4 py-5 text-center transition-all ${
                    achievement.unlocked
                      ? 'border-amber-200 bg-amber-50/80 shadow-sm dark:border-amber-800 dark:bg-amber-950/30 achievement-shimmer'
                      : 'border-dashed border-muted-foreground/20 opacity-60 grayscale'
                  }`}
                >
                  <span className="text-3xl">{achievement.emoji}</span>
                  <span className="text-xs font-semibold">{achievement.title}</span>
                  <span className="text-[10px] leading-tight text-muted-foreground">
                    {achievement.description}
                  </span>
                  {achievement.unlocked && (
                    <div className="absolute -right-1 -top-1 rounded-full bg-amber-500 p-0.5">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          Section F – Level Breakdown
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-5 w-5 text-amber-500" />
              Détail par niveau
            </CardTitle>
            <CardDescription>
              Visualisez la progression et les scores de chaque niveau
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {computed.levelBreakdown.map((level) => (
                <AccordionItem key={level.id} value={`level-${level.id}`}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{level.icon}</span>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{level.title}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {level.cefrLevel}
                          </Badge>
                        </div>
                        <div className="mt-0.5 flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            {level.completedCount}/{level.totalCount} leçons
                          </span>
                          {level.bestScore !== null && (
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                              ⭐ Meilleur : {level.bestScore}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mr-2 hidden w-20 sm:block">
                      <Progress value={level.percent} className="h-2" />
                      <p className="mt-0.5 text-center text-[10px] text-muted-foreground">
                        {level.percent}%
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {level.lessons.length === 0 ? (
                      <p className="py-2 text-sm text-muted-foreground">Aucune leçon.</p>
                    ) : (
                      <div className="space-y-2">
                        {level.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className={`flex items-center justify-between rounded-lg border px-3 py-2.5 transition-colors ${
                              lesson.isCompleted
                                ? 'border-amber-200 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/20'
                                : 'border-border'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                  lesson.isCompleted
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {lesson.isCompleted ? '✓' : '–'}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{lesson.title}</p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {lesson.titleAr}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {lesson.score !== null && (
                                <Badge
                                  variant={
                                    lesson.score >= 80
                                      ? 'default'
                                      : lesson.score >= 60
                                        ? 'secondary'
                                        : 'outline'
                                  }
                                  className={
                                    lesson.score >= 80
                                      ? 'bg-emerald-600 hover:bg-emerald-700'
                                      : lesson.score >= 60
                                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                        : ''
                                  }
                                >
                                  {getScoreEmoji(lesson.score)} {lesson.score}%
                                </Badge>
                              )}
                              {lesson.isCompleted && lesson.score === null && (
                                <Badge variant="secondary">Complétée</Badge>
                              )}
                              {!lesson.isCompleted && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => setCurrentLesson(lesson.id)}
                                >
                                  Commencer
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          Motivational footer
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <div className="rounded-xl border bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5 text-center dark:from-amber-950/30 dark:to-orange-950/30">
          {!hasSomeProgress ? (
            <>
              <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                🚀 Prêt à commencer votre voyage ?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Le darija marocain vous attend ! Commencez votre première leçon et suivez votre
                progression ici.
              </p>
              <Button
                className="mt-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 animate-button-pulse"
                onClick={() => setCurrentLevel(1)}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Commencer l&apos;apprentissage
              </Button>
            </>
          ) : completedLessons.length >= TOTAL_LESSONS ? (
            <>
              <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                🎉 Félicitations ! Vous avez complété tout le programme !
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Vous maîtrisez les bases du darija marocain. Continuez à pratiquer !
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                💪 Continuez votre apprentissage !
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Vous avez complété {completedLessons.length} leçons sur {TOTAL_LESSONS}.{' '}
                {streak > 0 && (
                  <>
                    Série actuelle : <strong className="text-orange-600 dark:text-orange-400">{streak} jours</strong>.
                  </>
                )}
              </p>
              <Button
                className="mt-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 btn-primary-glow"
                onClick={() => setCurrentLevel(1)}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Continuer
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Overview Card sub-component ─────────────────────────────────
function OverviewCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  subtitle,
  progress,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  subtitle: string;
  progress: number;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
            <div className={iconColor}>{icon}</div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-xl font-bold leading-tight">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
            <Progress value={progress} className="mt-2 h-1.5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
