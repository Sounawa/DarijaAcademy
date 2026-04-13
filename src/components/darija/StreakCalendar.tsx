'use client';

import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/store/progress-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import {
  ArrowLeft,
  Flame,
  Target,
  Trophy,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  PartyPopper,
  CheckCircle2,
  Circle,
  ChevronRight,
} from 'lucide-react';

// ─── Animation Variants ───────────────────────────────────────────
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

const milestoneVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, type: 'spring' } },
};

// ─── Constants ────────────────────────────────────────────────────
const WEEKS_TO_SHOW = 12;
const TOTAL_DAYS = WEEKS_TO_SHOW * 7; // 84

const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const MILESTONES = [7, 14, 30, 60, 90, 180, 365] as const;

const DEFAULT_WEEKLY_GOAL = 5;

// Color scale: amber tones (lightest to darkest)
function getHeatmapColor(count: number): string {
  if (count === 0) return 'bg-muted/60 dark:bg-muted/30';
  if (count === 1) return 'bg-amber-200 dark:bg-amber-900/70';
  if (count <= 3) return 'bg-amber-400 dark:bg-amber-700';
  return 'bg-amber-600 dark:bg-amber-500';
}

function getHeatmapBorder(count: number): string {
  if (count === 0) return 'border-muted-foreground/10';
  if (count === 1) return 'border-amber-300/50 dark:border-amber-800/50';
  if (count <= 3) return 'border-amber-500/50 dark:border-amber-600/50';
  return 'border-amber-700/50 dark:border-amber-400/50';
}

function formatDateFR(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
}

function getEncouragingMessage(percentage: number): { emoji: string; text: string } {
  if (percentage >= 100) return { emoji: '🏆', text: 'Objectif atteint ! Bravo !' };
  if (percentage >= 80) return { emoji: '🔥', text: 'Presque là ! Continue !' };
  if (percentage >= 60) return { emoji: '💪', text: 'Bon rythme, continue ainsi !' };
  if (percentage >= 40) return { emoji: '⭐', text: 'Bien parti, continue !' };
  if (percentage >= 20) return { emoji: '🌱', text: 'Bonne intention, continue !' };
  return { emoji: '💡', text: 'Commencez votre semaine !' };
}

// ─── Weekly Goal Hook (localStorage) ─────────────────────────────
function useWeeklyGoal() {
  const [goal, setGoalState] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_WEEKLY_GOAL;
    const stored = localStorage.getItem('darija-weekly-goal');
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 50) {
        return parsed;
      }
    }
    return DEFAULT_WEEKLY_GOAL;
  });

  const setGoal = useCallback((newGoal: number) => {
    const clamped = Math.max(1, Math.min(50, newGoal));
    setGoalState(clamped);
    localStorage.setItem('darija-weekly-goal', String(clamped));
  }, []);

  return { goal, setGoal };
}

// ─── Progress Ring SVG ────────────────────────────────────────────
function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
  children,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/50"
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export function StreakCalendar() {
  const { completionDates, streak, setCurrentView } = useProgressStore();
  const { goal: weeklyGoal, setGoal: setWeeklyGoal } = useWeeklyGoal();
  const [showMilestoneCelebration, setShowMilestoneCelebration] = useState(false);
  const [reachedMilestone, setReachedMilestone] = useState<number | null>(null);
  const celebrationShownRef = useRef<string | null>(null);

  // ─── Computed Data ─────────────────────────────────────────────
  const computed = useMemo(() => {
    // Build daily lesson counts from completionDates
    const dailyCounts: Record<string, number> = {};
    for (const iso of Object.values(completionDates)) {
      const dateKey = iso.split('T')[0];
      dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
    }

    // Total lessons completed
    const totalLessons = Object.keys(completionDates).length;

    // Total active days
    const activeDays = Object.keys(dailyCounts).length;

    // Average lessons per active day
    const avgPerDay = activeDays > 0 ? (totalLessons / activeDays).toFixed(1) : '0';

    // Longest streak calculation
    const sortedDates = Object.keys(dailyCounts).sort();
    let longestStreak = 0;
    let currentStreakCalc = 0;
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        currentStreakCalc = 1;
      } else {
        const prev = new Date(sortedDates[i - 1]);
        const curr = new Date(sortedDates[i]);
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        currentStreakCalc = diffDays === 1 ? currentStreakCalc + 1 : 1;
      }
      longestStreak = Math.max(longestStreak, currentStreakCalc);
    }

    // Build heatmap grid (last 84 days, organized by weeks/columns)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the start date (go back TOTAL_DAYS from today, land on a Sunday)
    // In our grid, row 0 = Monday, row 6 = Sunday
    // The last cell should be today's day-of-week position
    const todayDow = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    // Map to our grid: Mon=0, Tue=1, ..., Sun=6
    const todayGridRow = todayDow === 0 ? 6 : todayDow - 1;

    // The grid has WEEKS_TO_SHOW columns (oldest to newest)
    // We want today to be in the last column, at row todayGridRow
    // Go back to fill TOTAL_DAYS cells
    const grid: Array<{
      date: Date;
      dateKey: string;
      count: number;
      isToday: boolean;
      isFuture: boolean;
    }> = [];

    // Start from the bottom-right and go backwards
    for (let dayOffset = TOTAL_DAYS - 1; dayOffset >= 0; dayOffset--) {
      const d = new Date(today);
      d.setDate(d.getDate() - dayOffset);
      const dateKey = d.toISOString().split('T')[0];
      grid.push({
        date: new Date(d),
        dateKey,
        count: dailyCounts[dateKey] || 0,
        isToday: dateKey === today.toISOString().split('T')[0],
        isFuture: d > today,
      });
    }

    // Organize into weeks (columns)
    const weeks: typeof grid[] = [];
    for (let w = 0; w < WEEKS_TO_SHOW; w++) {
      weeks.push(grid.slice(w * 7, (w + 1) * 7));
    }

    // Month labels: find which months appear and their column positions
    const monthLabels: Array<{ label: string; col: number }> = [];
    let lastMonth = -1;
    for (let w = 0; w < WEEKS_TO_SHOW; w++) {
      if (weeks[w].length > 0) {
        const month = weeks[w][0].date.getMonth();
        if (month !== lastMonth) {
          monthLabels.push({
            label: getMonthLabel(weeks[w][0].date),
            col: w,
          });
          lastMonth = month;
        }
      }
    }

    // This week vs last week
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(thisWeekStart.getDate() - todayGridRow);
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    let thisWeekCount = 0;
    let lastWeekCount = 0;
    for (let i = 0; i < 7; i++) {
      const thisD = new Date(thisWeekStart);
      thisD.setDate(thisD.getDate() + i);
      const thisKey = thisD.toISOString().split('T')[0];
      thisWeekCount += dailyCounts[thisKey] || 0;

      const lastD = new Date(lastWeekStart);
      lastD.setDate(lastD.getDate() + i);
      const lastKey = lastD.toISOString().split('T')[0];
      lastWeekCount += dailyCounts[lastKey] || 0;
    }

    const weekDiff = thisWeekCount - lastWeekCount;
    const weekComparisonText =
      weekDiff > 0
        ? `+${weekDiff} de plus`
        : weekDiff < 0
          ? `${weekDiff} de moins`
          : 'Même rythme';

    // Next milestone
    let nextMilestone = MILESTONES[0];
    let milestoneProgress = 0;
    let prevMilestone = 0;
    for (const m of MILESTONES) {
      if (longestStreak < m) {
        nextMilestone = m;
        const prevM = prevMilestone;
        milestoneProgress = ((longestStreak - prevM) / (m - prevM)) * 100;
        break;
      }
      prevMilestone = m;
    }
    // If all milestones exceeded
    if (longestStreak >= MILESTONES[MILESTONES.length - 1]) {
      nextMilestone = MILESTONES[MILESTONES.length - 1];
      milestoneProgress = 100;
    }

    // Weekly goal progress
    const weeklyGoalProgress = weeklyGoal > 0 ? Math.min((thisWeekCount / weeklyGoal) * 100, 100) : 0;
    const weeklyGoalRemaining = Math.max(0, weeklyGoal - thisWeekCount);
    const encouragingMsg = getEncouragingMessage(weeklyGoalProgress);

    return {
      dailyCounts,
      totalLessons,
      activeDays,
      avgPerDay,
      longestStreak,
      weeks,
      monthLabels,
      thisWeekCount,
      lastWeekCount,
      weekDiff,
      weekComparisonText,
      nextMilestone,
      milestoneProgress,
      weeklyGoalProgress,
      weeklyGoalRemaining,
      encouragingMsg,
    };
  }, [completionDates, streak, weeklyGoal]);

  // ─── Milestone celebration effect ──────────────────────────────
  useEffect(() => {
    const streakKey = `milestone-${computed.longestStreak}`;
    if (MILESTONES.includes(computed.longestStreak as typeof MILESTONES[number]) && celebrationShownRef.current !== streakKey) {
      celebrationShownRef.current = streakKey;
      setReachedMilestone(computed.longestStreak);
      setShowMilestoneCelebration(true);
      const timer = setTimeout(() => setShowMilestoneCelebration(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [computed.longestStreak]);

  // ─── Confetti particles ────────────────────────────────────────
  const confettiParticles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 4,
      color: ['#f59e0b', '#ea580c', '#d97706', '#dc2626', '#16a34a', '#2563eb'][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.5,
      duration: Math.random() * 2 + 1.5,
    }));
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Milestone celebration overlay */}
      <AnimatePresence>
        {showMilestoneCelebration && reachedMilestone !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="absolute inset-0 bg-black/30" />
            {/* Confetti */}
            {confettiParticles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, y: -20, x: p.x + 'vw' }}
                animate={{
                  opacity: 0,
                  y: '110vh',
                  x: `${p.x + (Math.random() * 20 - 10)}vw`,
                  rotate: Math.random() * 720,
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: 'easeOut',
                }}
                className="absolute rounded-sm"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  left: `${p.x}%`,
                }}
              />
            ))}
            {/* Milestone card */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative z-10 rounded-2xl border border-amber-200 bg-white px-8 py-6 text-center shadow-2xl dark:border-amber-700 dark:bg-gray-900"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                <PartyPopper className="mx-auto h-12 w-12 text-amber-500" />
              </motion.div>
              <h2 className="mt-3 text-2xl font-bold text-amber-600 dark:text-amber-400">
                🎉 Jalon atteint !
              </h2>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {reachedMilestone} jours consécutifs !
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Votre détermination est impressionnante. Continuez !
              </p>
              <div className="mt-3 flex items-center justify-center gap-1">
                {Array.from({ length: Math.min(5, Math.ceil(reachedMilestone / 7)) }).map((_, i) => (
                  <Flame key={i} className="h-5 w-5 text-orange-500" />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════
          Header
          ═══════════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Calendrier
            </span>{' '}
            d&apos;Activité
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Suivez votre série d&apos;apprentissage quotidienne
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentView('home')}
          className="hidden sm:flex"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour
        </Button>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          Section A – Calendar Heatmap
          ═══════════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-5 w-5 text-amber-500" />
              Carte de chaleur
            </CardTitle>
            <CardDescription>
              Activité des {TOTAL_DAYS} derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto pb-2">
              <div className="inline-block min-w-[420px]">
                {/* Month labels */}
                <div className="mb-1 flex" style={{ paddingLeft: '28px' }}>
                  {computed.monthLabels.map((ml) => (
                    <div
                      key={`${ml.label}-${ml.col}`}
                      className="text-[10px] font-medium text-muted-foreground"
                      style={{
                        width: '14px',
                        marginLeft: ml.col > 0 ? '2px' : '0',
                        position: 'absolute',
                        left: `${28 + ml.col * 16}px`,
                      }}
                    >
                      {ml.label}
                    </div>
                  ))}
                </div>

                {/* Grid: day labels + heatmap cells */}
                <div className="flex gap-0.5">
                  {/* Day labels column */}
                  <div className="flex flex-col gap-0.5 pr-1.5" style={{ width: '24px' }}>
                    {DAY_LABELS.map((label, i) => (
                      <div
                        key={label + i}
                        className="flex items-center justify-end text-[10px] font-medium text-muted-foreground"
                        style={{ height: '14px', lineHeight: '14px' }}
                      >
                        {i % 2 === 0 ? label : ''}
                      </div>
                    ))}
                  </div>

                  {/* Week columns */}
                  {computed.weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-0.5">
                      {week.map((day, dayIdx) => (
                        <Tooltip key={day.dateKey}>
                          <TooltipTrigger asChild>
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: (weekIdx * 7 + dayIdx) * 0.003, duration: 0.2 }}
                              className={`h-[14px] w-[14px] rounded-sm border transition-colors cursor-default ${getHeatmapColor(day.count)} ${getHeatmapBorder(day.count)} ${
                                day.isToday
                                  ? 'ring-1 ring-amber-500 ring-offset-1 dark:ring-offset-background'
                                  : ''
                              } ${day.isFuture ? 'opacity-30' : ''}`}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            <p className="font-medium">{formatDateFR(day.dateKey)}</p>
                            <p>
                              {day.count === 0
                                ? 'Aucune leçon'
                                : `${day.count} leçon${day.count > 1 ? 's' : ''} complétée${day.count > 1 ? 's' : ''}`}
                            </p>
                            {day.isToday && (
                              <p className="text-amber-500 font-semibold">Aujourd&apos;hui</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="mt-3 flex items-center justify-end gap-1.5">
                  <span className="text-[10px] text-muted-foreground">Moins</span>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-[12px] w-[12px] rounded-sm border ${getHeatmapColor(level)} ${getHeatmapBorder(level)}`}
                    />
                  ))}
                  <span className="text-[10px] text-muted-foreground">Plus</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          Section B – Statistics Grid
          ═══════════════════════════════════════════════════════════ */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
      >
        {/* Current streak */}
        <Card className="border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-orange-50/50 dark:border-amber-800/40 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardContent className="p-4 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/60">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-orange-600 dark:text-orange-400">
              {streak}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">
              Série actuelle
            </p>
            <p className="text-[10px] text-muted-foreground">
              {streak === 0 ? 'jours' : streak === 1 ? 'jour' : 'jours'}
            </p>
          </CardContent>
        </Card>

        {/* Longest streak */}
        <Card>
          <CardContent className="p-4 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/60">
              <Trophy className="h-5 w-5 text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
              {computed.longestStreak}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">
              Plus longue série
            </p>
            <p className="text-[10px] text-muted-foreground">jours</p>
          </CardContent>
        </Card>

        {/* Active days */}
        <Card>
          <CardContent className="p-4 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60">
              <CalendarDays className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {computed.activeDays}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">
              Jours actifs
            </p>
            <p className="text-[10px] text-muted-foreground">total</p>
          </CardContent>
        </Card>

        {/* Total lessons */}
        <Card>
          <CardContent className="p-4 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/60">
              <Sparkles className="h-5 w-5 text-rose-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">
              {computed.totalLessons}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">
              Leçons terminées
            </p>
            <p className="text-[10px] text-muted-foreground">total</p>
          </CardContent>
        </Card>

        {/* Average per day */}
        <Card>
          <CardContent className="p-4 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-950/60">
              <Target className="h-5 w-5 text-violet-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-violet-600 dark:text-violet-400">
              {computed.avgPerDay}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">
              Moy. / jour actif
            </p>
            <p className="text-[10px] text-muted-foreground">leçons</p>
          </CardContent>
        </Card>

        {/* Week comparison */}
        <Card>
          <CardContent className="p-4 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-950/60">
              {computed.weekDiff > 0 ? (
                <TrendingUp className="h-5 w-5 text-sky-500" />
              ) : computed.weekDiff < 0 ? (
                <TrendingDown className="h-5 w-5 text-red-500" />
              ) : (
                <Minus className="h-5 w-5 text-sky-500" />
              )}
            </div>
            <p className={`mt-2 text-2xl font-bold ${
              computed.weekDiff > 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : computed.weekDiff < 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-sky-600 dark:text-sky-400'
            }`}>
              {computed.thisWeekCount}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">
              Cette semaine
            </p>
            <p className={`text-[10px] flex items-center justify-center gap-0.5 ${
              computed.weekDiff > 0
                ? 'text-emerald-500'
                : computed.weekDiff < 0
                  ? 'text-red-500'
                  : 'text-muted-foreground'
            }`}>
              {computed.weekComparisonText}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          Section C – Milestones
          ═══════════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-5 w-5 text-amber-500" />
              Jalons de série
            </CardTitle>
            <CardDescription>
              Prochain objectif : <strong>{computed.nextMilestone} jours</strong> consécutifs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress bar to next milestone */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {computed.longestStreak < MILESTONES[MILESTONES.length - 1]
                    ? `Progression vers ${computed.nextMilestone} jours`
                    : 'Tous les jalons atteints !'}
                </span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {Math.round(computed.milestoneProgress)}%
                </span>
              </div>
              <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${computed.milestoneProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                />
                {/* Milestone markers */}
                {MILESTONES.map((m) => {
                  const prevM = MILESTONES[MILESTONES.indexOf(m) - 1] || 0;
                  const pos = (m / MILESTONES[MILESTONES.length - 1]) * 100;
                  const isReached = computed.longestStreak >= m;
                  return (
                    <div
                      key={m}
                      className="absolute top-0 h-full w-0.5 z-10"
                      style={{ left: `${pos}%` }}
                    >
                      <div
                        className={`h-2.5 w-2.5 rounded-full border-2 border-background mx-auto ${
                          isReached
                            ? 'bg-emerald-500 border-emerald-200 dark:border-emerald-800'
                            : 'bg-muted-foreground/30 border-background'
                        }`}
                      />
                      <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[9px] font-medium text-muted-foreground whitespace-nowrap">
                        {m}j
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Milestone badges */}
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {MILESTONES.map((m) => {
                const isReached = computed.longestStreak >= m;
                const isNext = m === computed.nextMilestone;
                return (
                  <motion.div
                    key={m}
                    variants={milestoneVariants}
                    className={`relative flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-center transition-all ${
                      isReached
                        ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm dark:border-amber-800 dark:from-amber-950/30 dark:to-orange-950/30'
                        : isNext
                          ? 'border-amber-300 border-dashed bg-amber-50/50 dark:border-amber-700 dark:bg-amber-950/20'
                          : 'border-muted-foreground/15 opacity-50'
                    }`}
                  >
                    {isReached ? (
                      <CheckCircle2 className="h-5 w-5 text-amber-500" />
                    ) : isNext ? (
                      <Circle className="h-5 w-5 text-amber-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground/40" />
                    )}
                    <span className="text-lg font-bold text-foreground">
                      {m}
                    </span>
                    <span className="text-[10px] text-muted-foreground">jours</span>
                    {isReached && (
                      <Badge className="absolute -right-1 -top-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[8px] px-1.5 py-0">
                        ✓
                      </Badge>
                    )}
                    {isNext && !isReached && (
                      <Badge variant="outline" className="absolute -right-1 -top-1 text-[8px] px-1.5 py-0 text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700">
                        Prochain
                      </Badge>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          Section D – Weekly Goal
          ═══════════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-5 w-5 text-orange-500" />
                  Objectif hebdomadaire
                </CardTitle>
                <CardDescription className="mt-1">
                  Définissez votre nombre de leçons par semaine
                </CardDescription>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setWeeklyGoal(weeklyGoal - 1)}
                  disabled={weeklyGoal <= 1}
                  aria-label="Diminuer l'objectif"
                >
                  <span className="text-sm font-bold">−</span>
                </Button>
                <span className="w-10 text-center text-sm font-bold text-amber-600 dark:text-amber-400">
                  {weeklyGoal}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setWeeklyGoal(weeklyGoal + 1)}
                  disabled={weeklyGoal >= 50}
                  aria-label="Augmenter l'objectif"
                >
                  <span className="text-sm font-bold">+</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
              {/* Progress ring */}
              <div className="flex flex-col items-center">
                <ProgressRing progress={computed.weeklyGoalProgress} size={120} strokeWidth={8}>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {computed.thisWeekCount}
                    </p>
                    <p className="text-[10px] font-medium text-muted-foreground">
                      / {weeklyGoal}
                    </p>
                  </div>
                </ProgressRing>
                <p className="mt-2 text-center text-sm font-semibold">
                  {computed.encouragingMsg.emoji}{' '}
                  <span className="text-amber-600 dark:text-amber-400">
                    {computed.encouragingMsg.text}
                  </span>
                </p>
              </div>

              {/* Week details */}
              <div className="flex-1 space-y-4 w-full">
                {/* Weekly breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Cette semaine</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={computed.weeklyGoalProgress >= 100 ? 'default' : 'secondary'}
                        className={
                          computed.weeklyGoalProgress >= 100
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : ''
                        }
                      >
                        {computed.thisWeekCount} / {weeklyGoal} leçons
                      </Badge>
                    </div>
                  </div>
                  <Progress
                    value={computed.weeklyGoalProgress}
                    className="h-3"
                  />
                </div>

                {/* Remaining / Achieved */}
                <div className={`rounded-lg border px-4 py-3 ${
                  computed.weeklyGoalProgress >= 100
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30'
                    : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30'
                }`}>
                  {computed.weeklyGoalProgress >= 100 ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                          Objectif atteint ! 🎉
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                          {computed.thisWeekCount - weeklyGoal} leçon(s) supplémentaire(s)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-5 w-5 text-amber-500 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                          Encore {computed.weeklyGoalRemaining} leçon{computed.weeklyGoalRemaining > 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          pour atteindre votre objectif hebdomadaire
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Week comparison */}
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Sem. passée</span>
                      <span className="text-sm font-semibold">{computed.lastWeekCount}</span>
                    </div>
                    <span className="text-muted-foreground">→</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Sem. actuelle</span>
                      <span className="text-sm font-semibold">{computed.thisWeekCount}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    computed.weekDiff > 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : computed.weekDiff < 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-muted-foreground'
                  }`}>
                    {computed.weekDiff > 0 && <TrendingUp className="h-4 w-4" />}
                    {computed.weekDiff < 0 && <TrendingDown className="h-4 w-4" />}
                    {computed.weekDiff === 0 && <Minus className="h-4 w-4" />}
                    {computed.weekComparisonText}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          Motivational Footer
          ═══════════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <div className="rounded-xl border bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5 text-center dark:from-amber-950/30 dark:to-orange-950/30">
          {streak === 0 && computed.totalLessons === 0 ? (
            <>
              <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                🔥 Commencez votre première série !
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Complétez une leçon chaque jour pour construire votre série. La régularité est la clé !
              </p>
              <Button
                className="mt-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
                onClick={() => setCurrentView('home')}
              >
                <Flame className="mr-2 h-4 w-4" />
                Commencer maintenant
              </Button>
            </>
          ) : computed.longestStreak >= 30 ? (
            <>
              <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                🏆 {computed.longestStreak} jours — Maîtrise de la régularité !
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Votre constance est remarquable. Le darija marocain n&apos;a plus de secrets pour vous !
              </p>
            </>
          ) : streak >= 7 ? (
            <>
              <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                🔥 {streak} jours — Continuez sur cette lancée !
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Série actuelle : <strong>{streak} jours</strong> · Record : <strong>{computed.longestStreak} jours</strong>
              </p>
            </>
          ) : streak > 0 ? (
            <>
              <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                💪 Série de {streak} jour{streak > 1 ? 's' : ''} — Ne lâchez rien !
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Le premier palier est à 7 jours. Vous êtes à {Math.round((streak / 7) * 100)}% du premier jalon !
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                🌱 Reprenez votre série aujourd&apos;hui !
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Complétez une leçon pour relancer votre série d&apos;apprentissage.
              </p>
              <Button
                className="mt-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
                onClick={() => setCurrentView('home')}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Continuer l&apos;apprentissage
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
