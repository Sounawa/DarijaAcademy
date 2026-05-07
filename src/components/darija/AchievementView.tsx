'use client';

import { useProgressStore } from '@/store/progress-store';
import { levels } from '@/data/curriculum';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Trophy, Flame, BookOpen, Brain, Zap, Target, Star, Crown,
  GraduationCap, Heart, Calendar, MessageSquare, PenLine,
  ChevronRight, Lock, CheckCircle2, Sparkles, Gift, Swords,
  Globe2
} from 'lucide-react';
import { useMemo } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'progress' | 'streak' | 'quiz' | 'practice' | 'social' | 'special';
  color: string;
  requirement: () => boolean;
}

export function AchievementView() {
  const { setCurrentView } = useProgressStore();

  const achievements = useMemo(() => {
    const store = useProgressStore.getState();
    const completedCount = store.completedLessons.length;
    const totalLessons = levels.reduce((acc, l) => acc + l.lessons.length, 0);
    const streak = store.streak;
    const quizScores = Object.values(store.quizScores);
    const bookmarkCount = store.bookmarkedVocab.length;
    const wrongAnswersCount = store.wrongAnswers.length;
    const srsKeys = Object.keys(store.srsData);
    const masteredSrs = srsKeys.filter((k) => (store.srsData[k]?.repetitions ?? 0) >= 3).length;
    const writingScores = Object.values(store.writingScores);
    const speedScores = store.speedGameHighScores;
    const perfectQuizzes = quizScores.filter((s) => s === 100).length;
    const avgQuizScore = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0;

    const defs: Achievement[] = [
      // Progress
      {
        id: 'first-lesson',
        title: 'Premier pas',
        description: 'Complétez votre première leçon',
        icon: <BookOpen className="h-6 w-6" />,
        category: 'progress',
        color: 'from-emerald-400 to-emerald-600',
        requirement: () => completedCount >= 1,
      },
      {
        id: 'five-lessons',
        title: 'Apprenti',
        description: 'Complétez 5 leçons',
        icon: <GraduationCap className="h-6 w-6" />,
        category: 'progress',
        color: 'from-blue-400 to-blue-600',
        requirement: () => completedCount >= 5,
      },
      {
        id: 'ten-lessons',
        title: 'Étudiant',
        description: 'Complétez 10 leçons',
        icon: <Star className="h-6 w-6" />,
        category: 'progress',
        color: 'from-amber-400 to-amber-600',
        requirement: () => completedCount >= 10,
      },
      {
        id: 'half-done',
        title: 'À mi-chemin',
        description: 'Complétez 50% des leçons',
        icon: <Target className="h-6 w-6" />,
        category: 'progress',
        color: 'from-purple-400 to-purple-600',
        requirement: () => completedCount >= Math.floor(totalLessons / 2),
      },
      {
        id: 'master',
        title: 'Maître du Darija',
        description: 'Complétez toutes les leçons',
        icon: <Crown className="h-6 w-6" />,
        category: 'progress',
        color: 'from-yellow-400 to-orange-500',
        requirement: () => completedCount >= totalLessons,
      },

      // Streak
      {
        id: 'streak-3',
        title: 'Trois jours',
        description: 'Maintenez un streak de 3 jours',
        icon: <Flame className="h-6 w-6" />,
        category: 'streak',
        color: 'from-orange-400 to-red-500',
        requirement: () => streak >= 3,
      },
      {
        id: 'streak-7',
        title: 'Semaine parfaite',
        description: 'Streak de 7 jours consécutifs',
        icon: <Flame className="h-6 w-6" />,
        category: 'streak',
        color: 'from-red-400 to-rose-600',
        requirement: () => streak >= 7,
      },
      {
        id: 'streak-30',
        title: 'Mois ininterrompu',
        description: 'Streak de 30 jours consécutifs',
        icon: <Flame className="h-6 w-6" />,
        category: 'streak',
        color: 'from-rose-500 to-pink-700',
        requirement: () => streak >= 30,
      },

      // Quiz
      {
        id: 'first-quiz',
        title: 'Premier quiz',
        description: 'Réussissez votre premier quiz (50%+)',
        icon: <Zap className="h-6 w-6" />,
        category: 'quiz',
        color: 'from-amber-400 to-orange-500',
        requirement: () => quizScores.some((s) => s >= 50),
      },
      {
        id: 'perfect-quiz',
        title: 'Perfection',
        description: 'Obtenez 100% à un quiz',
        icon: <Sparkles className="h-6 w-6" />,
        category: 'quiz',
        color: 'from-yellow-300 to-amber-500',
        requirement: () => perfectQuizzes >= 1,
      },
      {
        id: 'three-perfect',
        title: 'Triple parfait',
        description: 'Obtenez 100% à 3 quiz différents',
        icon: <Trophy className="h-6 w-6" />,
        category: 'quiz',
        color: 'from-yellow-400 to-orange-600',
        requirement: () => perfectQuizzes >= 3,
      },
      {
        id: 'quiz-master',
        title: 'As du quiz',
        description: 'Score moyen de 80%+ sur tous les quiz',
        icon: <Brain className="h-6 w-6" />,
        category: 'quiz',
        color: 'from-indigo-400 to-purple-600',
        requirement: () => avgQuizScore >= 80 && quizScores.length >= 3,
      },

      // Practice
      {
        id: 'bookmark-5',
        title: 'Collectionneur',
        description: 'Ajoutez 5 mots en favoris',
        icon: <Heart className="h-6 w-6" />,
        category: 'practice',
        color: 'from-pink-400 to-rose-500',
        requirement: () => bookmarkCount >= 5,
      },
      {
        id: 'bookmark-25',
        title: 'Bibliothécaire',
        description: 'Ajoutez 25 mots en favoris',
        icon: <Heart className="h-6 w-6" />,
        category: 'practice',
        color: 'from-rose-400 to-red-600',
        requirement: () => bookmarkCount >= 25,
      },
      {
        id: 'srs-10',
        title: 'Mémorisation',
        description: 'Maîtrisez 10 mots en répétition espacée',
        icon: <Brain className="h-6 w-6" />,
        category: 'practice',
        color: 'from-teal-400 to-cyan-600',
        requirement: () => masteredSrs >= 10,
      },
      {
        id: 'srs-50',
        title: 'Mémoire d\'éléphant',
        description: 'Maîtrisez 50 mots en répétition espacée',
        icon: <Brain className="h-6 w-6" />,
        category: 'practice',
        color: 'from-cyan-400 to-blue-600',
        requirement: () => masteredSrs >= 50,
      },
      {
        id: 'writing-1',
        title: 'Scribe',
        description: 'Complétez une session d\'écriture',
        icon: <PenLine className="h-6 w-6" />,
        category: 'practice',
        color: 'from-violet-400 to-purple-600',
        requirement: () => writingScores.length >= 1,
      },
      {
        id: 'speed-game',
        title: 'Éclair',
        description: 'Jouez au Jeu de Vitesse',
        icon: <Swords className="h-6 w-6" />,
        category: 'practice',
        color: 'from-green-400 to-emerald-600',
        requirement: () => speedScores.length >= 1,
      },

      // Social / Special
      {
        id: 'explorer',
        title: 'Explorateur',
        description: 'Visitez la section Culture',
        icon: <Globe2 className="h-6 w-6" />,
        category: 'social',
        color: 'from-teal-400 to-emerald-600',
        requirement: () => false, // Will be tracked separately
      },
      {
        id: 'conversationalist',
        title: 'Conversationaliste',
        description: 'Pratiquez un dialogue',
        icon: <MessageSquare className="h-6 w-6" />,
        category: 'social',
        color: 'from-sky-400 to-blue-600',
        requirement: () => false, // Will be tracked separately
      },
      {
        id: 'dedicated',
        title: 'Dévoué',
        description: 'Corrigez 5 erreurs dans MistakeReview',
        icon: <Target className="h-6 w-6" />,
        category: 'special',
        color: 'from-orange-400 to-amber-600',
        requirement: () => wrongAnswersCount === 0 && completedCount >= 5,
      },
      {
        id: 'gifted',
        title: 'Polyglotte en herbe',
        description: 'Complétez le premier niveau (A1.1)',
        icon: <Gift className="h-6 w-6" />,
        category: 'special',
        color: 'from-pink-400 to-fuchsia-600',
        requirement: () => {
          const level1 = levels.find((l) => l.id === 1);
          if (!level1) return false;
          const completedInLevel = store.completedLessons.filter((id) => id.startsWith('1-')).length;
          return completedInLevel >= level1.lessons.length;
        },
      },
    ];

    return defs;
  }, []);

  const unlockedCount = achievements.filter((a) => a.requirement()).length;
  const totalCount = achievements.length;
  const progress = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const categories = [
    { key: 'progress', label: 'Progression', icon: <BookOpen className="h-4 w-4" /> },
    { key: 'streak', label: 'Streaks', icon: <Flame className="h-4 w-4" /> },
    { key: 'quiz', label: 'Quiz', icon: <Zap className="h-4 w-4" /> },
    { key: 'practice', label: 'Pratique', icon: <Target className="h-4 w-4" /> },
    { key: 'social', label: 'Découverte', icon: <Globe2 className="h-4 w-4" /> },
    { key: 'special', label: 'Spécial', icon: <Sparkles className="h-4 w-4" /> },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20">
          <Trophy className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Succès</h1>
          <p className="text-sm text-muted-foreground">
            {unlockedCount} / {totalCount} débloqués — {progress}%
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8 overflow-hidden rounded-full bg-muted/50 h-3">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Categories */}
      {categories.map((cat) => {
        const catAchievements = achievements.filter((a) => a.category === cat.key);
        const catUnlocked = catAchievements.filter((a) => a.requirement()).length;

        return (
          <div key={cat.key} className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
                {cat.icon}
              </div>
              <h2 className="text-base font-semibold">{cat.label}</h2>
              <span className="text-xs text-muted-foreground">
                {catUnlocked}/{catAchievements.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {catAchievements.map((achievement, idx) => {
                const unlocked = achievement.requirement();
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.35 }}
                  >
                    <Card
                      className={`gap-0 overflow-hidden border-0 p-0 transition-all duration-300 ${
                        unlocked
                          ? 'card-glass-hover border border-amber-200/40 dark:border-amber-800/30'
                          : 'opacity-60 grayscale-[60%]'
                      }`}
                    >
                      <CardContent className="flex items-center gap-3 p-4">
                        {/* Icon */}
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${
                            unlocked ? achievement.color : 'from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800'
                          } text-white shadow-sm`}
                        >
                          {unlocked ? (
                            achievement.icon
                          ) : (
                            <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>

                        {/* Text */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-semibold truncate">{achievement.title}</h3>
                            {unlocked && (
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Back button */}
      <div className="mt-8 text-center">
        <Button
          variant="outline"
          onClick={() => setCurrentView('home')}
          className="gap-2"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          Retour à l'accueil
        </Button>
      </div>
    </motion.div>
  );
}
