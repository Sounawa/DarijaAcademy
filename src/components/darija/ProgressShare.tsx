'use client';

import { useMemo, useState } from 'react';
import { levels } from '@/data/curriculum';
import { useProgressStore } from '@/store/progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Share2,
  Copy,
  Check,
  BookOpen,
  Flame,
  Sparkles,
  Award,
  Star,
  Heart,
} from 'lucide-react';
import { toast } from 'sonner';

/* ─── Constants ──────────────────────────────────────────────── */

const TOTAL_LESSONS = levels.reduce((acc, l) => acc + l.lessons.length, 0);
const TOTAL_LEVELS = levels.length;

const motivationalMessages = [
  { darija: 'Bghiti tkellem darija mzyan ?', french: 'Tu veux parler darija couramment ?' },
  { darija: 'Allah y3awnek !', french: 'Que Dieu t\'aide !' },
  { darija: 'Tbarkallah 3lik !', french: 'Quel bon travail !' },
  { darija: 'Ghir s7ab !', french: 'Continue comme ça !' },
  { darija: 'Daba katfhem shwiya shwiya !', french: 'Tu commences à comprendre petit à petit !' },
  { darija: 'Nta nta, khdam m3aya !', french: 'Allez, on bosse ensemble !' },
];

/* ─── Animation Variants ─────────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

/* ─── Helper to get level progress ───────────────────────────── */

function getLessonById(id: string) {
  for (const level of levels) {
    const found = level.lessons.find((l) => l.id === id);
    if (found) return found;
  }
  return undefined;
}

/* ─── Main Component ─────────────────────────────────────────── */

export function ProgressShare() {
  const {
    completedLessons,
    quizScores,
    streak,
    currentLevel,
    setCurrentView,
  } = useProgressStore();

  const [copied, setCopied] = useState(false);

  // ─── Computed Data ────────────────────────────────────────────
  const computed = useMemo(() => {
    // Words learned
    let wordsLearned = 0;
    completedLessons.forEach((lessonId) => {
      const lesson = getLessonById(lessonId);
      if (lesson) wordsLearned += lesson.vocabulary.length;
    });

    // Level progress data for bar chart
    const levelProgress = levels.map((level) => {
      const total = level.lessons.length;
      const prefix = `${level.id}-`;
      const completed = completedLessons.filter((id) => id.startsWith(prefix)).length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { ...level, completed, percent };
    });

    // Quiz score average
    const scoreValues = Object.values(quizScores);
    const avgScore =
      scoreValues.length > 0
        ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
        : 0;

    // Motivational message based on progress
    const progressPercent = TOTAL_LESSONS > 0 ? Math.round((completedLessons.length / TOTAL_LESSONS) * 100) : 0;
    const messageIdx = Math.min(
      Math.floor((progressPercent / 100) * motivationalMessages.length),
      motivationalMessages.length - 1
    );
    const motivational = motivationalMessages[messageIdx];

    // Total quiz taken
    const totalQuizzes = scoreValues.length;

    // Perfect scores
    const perfectScores = scoreValues.filter((s) => s === 100).length;

    return {
      wordsLearned,
      levelProgress,
      avgScore,
      motivational,
      progressPercent,
      totalQuizzes,
      perfectScores,
    };
  }, [completedLessons, quizScores]);

  // ─── Generate share text ──────────────────────────────────────
  const shareText = useMemo(() => {
    const stars = computed.progressPercent >= 100 ? '🏆' : computed.progressPercent >= 75 ? '🌟' : computed.progressPercent >= 50 ? '⭐' : '🌱';
    const border = '═══════════════════════════════';
    const borderEnd = '═══════════════════════════════';

    return [
      border,
      `  🇲🇦  DARIJA ACADEMY  🇲🇦`,
      `     Mon Progrès`,
      border,
      ``,
      `  ${stars}  Niveau ${currentLevel} / ${TOTAL_LEVELS}`,
      `  📚  ${completedLessons.length} leçon${completedLessons.length > 1 ? 's' : ''} complétée${completedLessons.length > 1 ? 's' : ''} sur ${TOTAL_LESSONS}`,
      `  🔥  Série : ${streak} jour${streak > 1 ? 's' : ''}`,
      `  💬  ${computed.wordsLearned} mots appris`,
      ``,
      `  📊  Score moyen : ${computed.avgScore}%`,
      `  🎯  Quiz parfaits : ${computed.perfectScores}`,
      ``,
      `  ─────────────────────────────`,
      `  🗣️  "${computed.motivational.darija}"`,
      `      ${computed.motivational.french}`,
      `  ─────────────────────────────`,
      ``,
      `  ${'█'.repeat(Math.round(computed.progressPercent / 5))}${'░'.repeat(20 - Math.round(computed.progressPercent / 5))}  ${computed.progressPercent}%`,
      ``,
      borderEnd,
      `  Apprenez le darija marocain !`,
      borderEnd,
    ].join('\n');
  }, [completedLessons.length, currentLevel, streak, computed]);

  // ─── Copy to clipboard ────────────────────────────────────────
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success('Texte copié dans le presse-papiers !');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Impossible de copier le texte.');
    }
  };

  // ─── Web Share API ────────────────────────────────────────────
  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Mon progrès - Darija Academy',
          text: shareText,
        });
      } catch (err) {
        // User cancelled or share failed — fallback to copy
        if (err instanceof Error && err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  // ─── Get progress color ───────────────────────────────────────
  const getProgressColor = (percent: number) => {
    if (percent === 100) return 'from-emerald-500 to-teal-500';
    if (percent >= 75) return 'from-amber-500 to-orange-500';
    if (percent >= 50) return 'from-orange-500 to-rose-500';
    if (percent > 0) return 'from-amber-400 to-amber-600';
    return 'from-gray-300 to-gray-400';
  };

  // ─── Render ───────────────────────────────────────────────────
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
          <div className="mb-1">
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
            <Share2 className="mb-1 mr-2 inline-block h-6 w-6 text-amber-500" />
            Partager mon progr&egrave;s
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Montrez &agrave; vos amis votre progression en darija !
          </p>
        </div>
      </motion.div>

      {/* ─── Share Card Preview ─────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Card Header with Moroccan themed gradient */}
            <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-6 text-white">
              {/* Decorative Moroccan pattern overlay */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
              }} />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      <span className="text-sm font-bold tracking-wide uppercase opacity-90">
                        Darija Academy
                      </span>
                    </div>
                    <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
                      Mon Progr&egrave;s
                    </h2>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <span className="text-3xl">
                      {computed.progressPercent >= 100 ? '🏆' : computed.progressPercent >= 75 ? '🌟' : computed.progressPercent >= 50 ? '⭐' : '🌱'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-5">
              {/* Main stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-amber-50 p-3 text-center dark:bg-amber-950/30">
                  <BookOpen className="mx-auto mb-1 h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-300">
                    {completedLessons.length}
                  </p>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Le&ccedil;ons
                  </p>
                </div>
                <div className="rounded-xl bg-orange-50 p-3 text-center dark:bg-orange-950/30">
                  <Flame className="mx-auto mb-1 h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <p className="text-2xl font-extrabold text-orange-700 dark:text-orange-300">
                    {streak}
                  </p>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    S&eacute;rie
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3 text-center dark:bg-emerald-950/30">
                  <Sparkles className="mx-auto mb-1 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
                    {computed.wordsLearned}
                  </p>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Mots
                  </p>
                </div>
                <div className="rounded-xl bg-rose-50 p-3 text-center dark:bg-rose-950/30">
                  <Award className="mx-auto mb-1 h-5 w-5 text-rose-600 dark:text-rose-400" />
                  <p className="text-2xl font-extrabold text-rose-700 dark:text-rose-300">
                    {computed.perfectScores}
                  </p>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Parfaits
                  </p>
                </div>
              </div>

              {/* Level progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Niveau {currentLevel} / {TOTAL_LEVELS}
                  </span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    {computed.progressPercent}%
                  </span>
                </div>
                <div className="relative h-4 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getProgressColor(computed.progressPercent)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${computed.progressPercent}%` }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  />
                </div>
              </div>

              {/* Level progress chart (CSS bars) */}
              <div>
                <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Progression par niveau
                </p>
                <div className="flex items-end gap-1.5 h-24">
                  {computed.levelProgress.map((level) => (
                    <div key={level.id} className="flex flex-1 flex-col items-center gap-1">
                      <motion.div
                        className={`w-full rounded-t-md bg-gradient-to-t ${getProgressColor(level.percent)}`}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(level.percent, 4)}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 * level.id }}
                        style={{ minHeight: level.percent > 0 ? undefined : 4 }}
                      />
                      <span className="text-[9px] font-medium text-muted-foreground">
                        L{level.id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Motivational message */}
              <div className="rounded-xl border border-amber-200/50 bg-gradient-to-r from-amber-50 to-orange-50 p-4 text-center dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-800/50">
                <Heart className="mx-auto mb-2 h-5 w-5 text-rose-400" />
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                  &laquo; {computed.motivational.darija} &raquo;
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {computed.motivational.french}
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="border-t bg-muted/30 px-6 py-3">
              <p className="text-center text-[10px] text-muted-foreground">
                🇲🇦 Apprenez le darija marocain avec Darija Academy
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Share Actions ─────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={handleCopy}
          variant="outline"
          className="flex-1 gap-2"
          disabled={copied}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-500" />
              Copi&eacute; !
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copier le texte
            </>
          )}
        </Button>
        <Button
          onClick={handleShare}
          className="flex-1 gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 btn-primary-glow"
        >
          <Share2 className="h-4 w-4" />
          Partager
        </Button>
      </motion.div>

      {/* ─── Text Preview ──────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Aper&ccedil;u du texte partag&eacute;
              </p>
              <Badge variant="outline" className="text-[10px]">Texte</Badge>
            </div>
            <pre className="max-h-64 overflow-y-auto rounded-lg bg-muted/50 p-3 text-[11px] leading-relaxed text-foreground/80 font-mono whitespace-pre">
              {shareText}
            </pre>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Quick Stats Summary ───────────────────────────── */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border p-4 text-center">
            <p className="text-xs text-muted-foreground">Score moyen</p>
            <p className="mt-1 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {computed.avgScore}%
            </p>
            <Progress value={computed.avgScore} className="mt-2 h-1.5" />
          </div>
          <div className="rounded-xl border p-4 text-center">
            <p className="text-xs text-muted-foreground">Quiz compl&eacute;t&eacute;s</p>
            <p className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {computed.totalQuizzes}
            </p>
            <Progress
              value={Math.min((computed.totalQuizzes / TOTAL_LESSONS) * 100, 100)}
              className="mt-2 h-1.5"
            />
          </div>
          <div className="rounded-xl border p-4 text-center">
            <p className="text-xs text-muted-foreground">Meilleur niveau</p>
            <p className="mt-1 text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              N{currentLevel}
            </p>
            <Progress
              value={(currentLevel / TOTAL_LEVELS) * 100}
              className="mt-2 h-1.5"
            />
          </div>
        </div>
      </motion.div>

      {/* ─── Fun Facts ─────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-4">
            <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Le saviez-vous ?
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="shrink-0 text-sm">🇲🇦</span>
                <p className="text-xs text-muted-foreground">
                  Le darija marocain est parl&eacute; par plus de 32 millions de personnes au Maroc
                  et dans la diaspora.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="shrink-0 text-sm">🗣️</span>
                <p className="text-xs text-muted-foreground">
                  Le darija emprunte des mots &agrave; l&apos;arabe, au berb&egrave;re, au fran&ccedil;ais et &agrave; l&apos;espagnol.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="shrink-0 text-sm">✨</span>
                <p className="text-xs text-muted-foreground">
                  {completedLessons.length >= 5
                    ? `Vous connaissez déjà ${computed.wordsLearned} mots en darija — c'est impressionnant !`
                    : `Chaque mot appris vous rapproche de la maîtrise du darija. Continuez !`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
