'use client';

import { levels } from '@/data/curriculum';
import { useProgressStore } from '@/store/progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { motion, useInView } from 'framer-motion';
import {
  Clock,
  BookOpen,
  Globe,
  ChevronRight,
  CheckCircle2,
  BookMarked,
  Heart,
  Github,
  Zap,
  Calendar,
  Trophy,
  Waves,
  GraduationCap,
  BarChart3,
  Mic,
  Sparkles,
  Play,
  Star,
} from 'lucide-react';
import { WordOfDay } from './WordOfDay';
import { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform } from 'framer-motion';

/* Scroll-reveal wrapper using Framer Motion */
function ScrollRevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Count-up animation for stats */
function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

/* Tiny progress ring component for level cards */
function MiniProgressRing({
  progress,
  size = 36,
  strokeWidth = 3,
  color = '#F59E0B',
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="shrink-0">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted/40"
      />
      {/* Progress circle */}
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
      {/* Percentage text */}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground"
        fontSize={size * 0.26}
        fontWeight={600}
      >
        {progress}%
      </text>
    </svg>
  );
}

/* Map level color class to hex for progress ring */
function getLevelColorHex(colorClass: string): string {
  if (colorClass.includes('amber')) return '#F59E0B';
  if (colorClass.includes('orange')) return '#F97316';
  if (colorClass.includes('emerald')) return '#10B981';
  if (colorClass.includes('rose')) return '#F43F5E';
  if (colorClass.includes('red')) return '#EF4444';
  if (colorClass.includes('cyan') || colorClass.includes('teal')) return '#1B9AAA';
  if (colorClass.includes('yellow')) return '#EAB308';
  if (colorClass.includes('violet')) return '#8B5CF6';
  return '#F59E0B';
}

/* Daily Challenge card for the home page */
function DailyChallengeCard() {
  const { setCurrentView, getTodayChallengeStatus } = useProgressStore();
  const challenge = getTodayChallengeStatus();

  const handleClick = () => {
    setCurrentView('challenge');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.42, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mb-12"
    >
      <Card
        className="group cursor-pointer overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
        onClick={handleClick}
      >
        <div className="relative">
          {/* Background gradient */}
          <div className={`absolute inset-0 ${
            challenge.completed
              ? 'bg-gradient-to-br from-emerald-500/5 via-amber-500/5 to-orange-500/5 dark:from-emerald-500/10 dark:via-amber-500/10 dark:to-orange-500/10'
              : 'bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-rose-500/5 dark:from-amber-500/10 dark:via-orange-500/10 dark:to-rose-500/10'
          }`} />
          {/* Shimmer for incomplete */}
          {!challenge.completed && (
            <div
              className="absolute inset-0 animate-shimmer pointer-events-none"
              style={{
                background: 'linear-gradient(110deg, transparent 25%, rgba(245, 158, 11, 0.06) 37%, transparent 63%)',
                backgroundSize: '200% 100%',
              }}
            />
          )}

          <CardContent className="relative z-10 flex items-center gap-4 p-4 md:p-5">
            {/* Icon */}
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm ${
              challenge.completed
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                : 'bg-gradient-to-br from-amber-500 to-orange-600'
            }`}>
              {challenge.completed ? (
                <Trophy className="h-6 w-6 text-white" />
              ) : (
                <Calendar className="h-6 w-6 text-white" />
              )}
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">
                  {challenge.completed ? '✅ Score: ' + challenge.score + '/10' : '🌟 Défi du jour disponible !'}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                {challenge.completed
                  ? 'Revenez demain pour un nouveau défi'
                  : '10 questions • 5 minutes • Testez votre darija'}
              </p>
            </div>

            {/* Arrow */}
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 ${
              challenge.completed
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
            }`}>
              <ChevronRight className="h-4 w-4" />
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}

export function HomePage() {
  const { setCurrentLevel, getLevelProgress, completedLessons, setCurrentView, getTodayChallengeStatus } =
    useProgressStore();

  const totalLessons = levels.reduce((acc, l) => acc + l.lessons.length, 0);
  const totalCompleted = completedLessons.length;

  /* Parallax scroll for decorative orbs */
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const orbY1 = useTransform(scrollY, [0, 300], [0, -40]);
  const orbY2 = useTransform(scrollY, [0, 300], [0, -25]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Hero Section */}
      <section ref={heroRef} className="hero-gradient-border mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-8 text-white shadow-xl dark:from-amber-700 dark:via-orange-700 dark:to-rose-700 md:p-12 zellige-hero-border">
        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 animate-shimmer pointer-events-none"
          style={{
            background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.08) 37%, transparent 63%)',
            backgroundSize: '200% 100%',
          }}
        />

        {/* Decorative elements */}
        <div className="moroccan-pattern absolute inset-0 opacity-10" />
        <motion.div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 animate-float-slow" style={{ y: orbY1 }} />
        <motion.div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/10 animate-float-slow-2" style={{ y: orbY2 }} />

        {/* Sparkles near title */}
        <div className="absolute top-6 right-8 md:top-8 md:right-16">
          <div className="animate-sparkle text-yellow-200/60 text-lg">✦</div>
        </div>
        <div className="absolute top-12 right-24 md:top-14 md:right-36">
          <div className="animate-sparkle-delayed text-yellow-100/40 text-sm">✦</div>
        </div>

        <div className="relative z-10">
          <motion.h1
            className="mb-3 text-3xl font-extrabold leading-tight md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Apprendre le{' '}
            <span
              className="font-arabic inline-block text-4xl md:text-6xl text-shadow-glow"
              style={{
                textShadow: '0 0 30px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.1)',
              }}
            >
              الدّارِجَة
            </span>
          </motion.h1>
          <motion.p
            className="mb-2 text-lg font-medium text-white/90 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Darija Marocain
          </motion.p>
          <motion.p
            className="mb-6 text-base text-white/75 md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            12 niveaux progressifs pour atteindre le niveau B1
          </motion.p>
          <motion.div
            className="flex items-center gap-3 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span><CountUp target={totalCompleted} /> / <CountUp target={totalLessons} /> leçons complétées</span>
            </div>
            {totalCompleted > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <Star className="h-4 w-4" />
                <span><CountUp target={Math.round((totalCompleted / totalLessons) * 100)} />% maîtrise</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Word of the Day */}
      <WordOfDay />

      {/* Daily Challenge Card */}
      <DailyChallengeCard />

      {/* Quick Access Cards: Practice + Alphabet Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <ScrollRevealSection delay={0.05}>
          <Card className="group gap-0 p-0 overflow-hidden border-amber-200/50 bg-gradient-to-r from-amber-50/50 via-orange-50/30 to-amber-50/50 dark:border-amber-800/30 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-amber-950/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                <Zap className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold">Pratique rapide</h3>
                <p className="text-xs text-muted-foreground">Quiz chronométré pour tester vos connaissances</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/40"
                onClick={(e) => { e.preventDefault(); useProgressStore.getState().setCurrentView('practice'); }}
              >
                <Zap className="h-3.5 w-3.5" />
                Jouer
              </Button>
            </CardContent>
          </Card>
        </ScrollRevealSection>
        <ScrollRevealSection delay={0.1}>
          <Card className="group gap-0 p-0 overflow-hidden border-amber-200/50 bg-gradient-to-r from-teal-50/50 via-emerald-50/30 to-amber-50/50 dark:border-teal-800/30 dark:from-teal-950/20 dark:via-emerald-950/10 dark:to-amber-950/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                <Waves className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold">Guide de l&apos;alphabet</h3>
                <p className="text-xs text-muted-foreground">Apprenez les lettres et les sons du darija</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5 border-teal-300 text-teal-700 hover:bg-teal-100 dark:border-teal-700 dark:text-teal-400 dark:hover:bg-teal-950/40"
                onClick={(e) => { e.preventDefault(); useProgressStore.getState().setCurrentView('pronunciation'); }}
              >
                <Waves className="h-3.5 w-3.5" />
                Voir
              </Button>
            </CardContent>
          </Card>
        </ScrollRevealSection>
      </div>

      {/* Features Section — Clickable Cards */}
      <ScrollRevealSection className="mb-12">
        <h2 className="mb-4 text-lg font-bold md:text-xl">
          ✨ Fonctionnalités
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: 12 niveaux → scroll to levels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ delay: 0.05, duration: 0.4 }}
          >
            <Card
              className="group cursor-pointer gap-0 overflow-hidden border-0 py-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 hover:scale-[1.02]"
              onClick={() => {
                const el = document.getElementById('levels-grid');
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <CardContent className="flex gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 transition-transform duration-300 group-hover:scale-110 dark:bg-amber-950/30">
                  <GraduationCap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-sm font-semibold">12 niveaux progressifs</h3>
                  <p className="text-xs text-muted-foreground">De A1 à B1, pas à pas</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-500" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 2: Vocabulaire authentique → alphabet guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Card
              className="group cursor-pointer gap-0 overflow-hidden border-0 py-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 hover:scale-[1.02]"
              onClick={() => setCurrentView('pronunciation')}
            >
              <CardContent className="flex gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 transition-transform duration-300 group-hover:scale-110 dark:bg-emerald-950/30">
                  <Mic className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-sm font-semibold">Vocabulaire authentique</h3>
                  <p className="text-xs text-muted-foreground">Arabe avec voyelles et français</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-500" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 3: Quiz interactifs → practice view */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <Card
              className="group cursor-pointer gap-0 overflow-hidden border-0 py-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 hover:scale-[1.02]"
              onClick={() => setCurrentView('practice')}
            >
              <CardContent className="flex gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 transition-transform duration-300 group-hover:scale-110 dark:bg-rose-950/30">
                  <Play className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-sm font-semibold">Quiz interactifs</h3>
                  <p className="text-xs text-muted-foreground">Testez vos connaissances</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-rose-500" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 4: Suivi de progression → stats view */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Card
              className="group cursor-pointer gap-0 overflow-hidden border-0 py-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 hover:scale-[1.02]"
              onClick={() => setCurrentView('stats')}
            >
              <CardContent className="flex gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 transition-transform duration-300 group-hover:scale-110 dark:bg-orange-950/30">
                  <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-sm font-semibold">Suivi de progression</h3>
                  <p className="text-xs text-muted-foreground">Suivez votre avancement</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-orange-500" />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </ScrollRevealSection>

      {/* Levels Grid */}
      <ScrollRevealSection>
        <section id="levels-grid">
          <h2 className="mb-6 text-xl font-bold md:text-2xl">
            📚 Les 12 niveaux
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {levels.map((level, index) => {
              const progress = getLevelProgress(level.id, level.lessons.length);
              const levelColorHex = getLevelColorHex(level.color);
              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{
                    delay: index * 0.04,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Card
                    className="group cursor-pointer gap-0 overflow-hidden p-0 level-card-hover card-glow-border border-l-4"
                    style={{
                      borderLeftColor: levelColorHex,
                    }}
                    onClick={() => setCurrentLevel(level.id)}
                  >
                  {/* Level gradient header */}
                  <div
                    className={`bg-gradient-to-r ${level.color} px-4 py-3 text-white`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl parallax-icon">{level.icon}</span>
                        <div className="parallax-text">
                          <h3 className="text-sm font-bold leading-tight">
                            {level.title}
                          </h3>
                          <p className="font-arabic text-xs text-white/80">
                            {level.titleAr}
                          </p>
                        </div>
                      </div>
                      <Badge className="border-0 bg-white/20 text-[10px] text-white backdrop-blur-sm">
                        {level.cefrLevel}
                      </Badge>
                    </div>
                  </div>

                  {/* Level body */}
                  <CardContent className="p-4">
                    <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                      {level.description}
                    </p>

                    {/* Progress with ring + lesson count */}
                    <div className="mb-3 flex items-center gap-3">
                      <MiniProgressRing
                        progress={progress}
                        color={levelColorHex}
                        size={38}
                        strokeWidth={3}
                      />
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <BookMarked className="h-3 w-3" />
                        <span>{level.lessons.length} leçons</span>
                      </div>
                    </div>

                    {/* Action */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs transition-colors duration-200 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                      onClick={(e) => { e.stopPropagation(); setCurrentLevel(level.id); }}
                    >
                      {progress === 0
                        ? 'Commencer'
                        : progress === 100
                          ? 'Réviser'
                          : 'Continuer'}
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
      </ScrollRevealSection>

      {/* Footer */}
      <footer className="footer-zellige-top footer-gradient-line mt-16 pb-8 pt-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* App info */}
          <div className="mb-5 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-sm">
              <Star className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Darija</span>
              <span className="text-foreground">Academy</span>
            </span>
          </div>

          {/* Navigation links */}
          <nav className="mb-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {[
              { label: 'Niveaux', view: 'home' as const },
              { label: 'Alphabet', view: 'pronunciation' as const },
              { label: 'Dialogues', view: 'conversation' as const },
              { label: 'Quiz', view: 'practice' as const },
              { label: 'Statistiques', view: 'stats' as const },
              { label: 'Calendrier', view: 'streak' as const },
              { label: 'Culture', view: 'culture' as const },
              { label: 'Paramètres', view: 'settings' as const },
            ].map((link) => (
              <button
                key={link.view}
                onClick={() => setCurrentView(link.view)}
                className="footer-link text-xs text-muted-foreground transition-colors hover:text-amber-600 dark:hover:text-amber-400"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <p className="text-xs text-muted-foreground">
            Apprendre le darija marocain de manière progressive et ludique.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Contenu authentique basé sur le darija tel qu&apos;il est parlé au Maroc 🇲🇦
          </p>

          {/* Links row */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <a
              href="#"
              className="footer-link flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-amber-600 dark:hover:text-amber-400"
              onClick={(e) => e.preventDefault()}
            >
              <Github className="h-3.5 w-3.5" />
              Code source
            </a>
            <span className="text-muted-foreground/30">|</span>
            <a
              href="#"
              className="footer-link flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-amber-600 dark:hover:text-amber-400"
              onClick={(e) => e.preventDefault()}
            >
              <Heart className="h-3.5 w-3.5" />
              Faire un don
            </a>
          </div>

          <p className="mt-4 text-[10px] text-muted-foreground/50">
            © {new Date().getFullYear()} DarijaAcademy — Conçu avec ❤️ au Maroc 🇲🇦
          </p>
        </div>
      </footer>
    </motion.div>
  );
}
