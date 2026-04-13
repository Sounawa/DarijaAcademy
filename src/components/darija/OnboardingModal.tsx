'use client';

import { useState } from 'react';
import { useProgressStore } from '@/store/progress-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Languages, Target, TrendingUp, Keyboard } from 'lucide-react';

const TOTAL_STEPS = 4;

/* Slide animation variants */
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export function OnboardingModal() {
  const { completeOnboarding } = useProgressStore();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState(1);

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const goPrev = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    completeOnboarding(selectedLevel);
  };

  const handleClose = () => {
    completeOnboarding();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-background shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-muted/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Progress bar at top */}
        <div className="flex gap-1 px-6 pt-6 pb-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= step
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="relative overflow-hidden px-6 pb-6 pt-2" style={{ minHeight: '380px' }}>
          <AnimatePresence mode="wait" custom={direction}>
            {step === 0 && (
              <motion.div
                key="welcome"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center"
              >
                {/* Moroccan pattern background */}
                <div className="moroccan-pattern absolute inset-0 opacity-[0.03] pointer-events-none" />
                {/* Decorative circles */}
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-amber-400/10 to-orange-400/10" />
                <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-gradient-to-br from-rose-400/10 to-amber-400/10" />

                {/* Arabic greeting */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                >
                  <p className="mb-2 font-arabic text-5xl font-bold text-amber-600 dark:text-amber-400 md:text-6xl">
                    أهلاً وسهلاً
                  </p>
                </motion.div>

                {/* App name */}
                <h2 className="mb-2 text-3xl font-extrabold">
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Darija
                  </span>
                  <span className="text-foreground">Academy</span>
                </h2>

                {/* Moroccan decoration line */}
                <div className="my-3 flex items-center gap-2">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
                  <span className="text-lg text-amber-500">✦</span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
                </div>

                {/* Description */}
                <p className="mb-2 max-w-sm text-base text-muted-foreground">
                  Apprenez le darija marocain à votre rythme
                </p>
                <p className="mb-8 text-sm text-muted-foreground/70">
                  12 niveaux progressifs • 38 leçons • Vocabulaire authentique
                </p>

                {/* Start button */}
                <Button
                  onClick={goNext}
                  className="w-full max-w-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-600"
                  size="lg"
                >
                  Commencer
                </Button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="how-it-works"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                <h2 className="mb-1 text-xl font-bold">Comment ça marche ?</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Apprenez en 4 étapes simples
                </p>

                <div className="w-full space-y-3">
                  {[
                    {
                      icon: BookOpen,
                      emoji: '📚',
                      title: '12 niveaux progressifs',
                      desc: 'De A1 à B1, pas à pas',
                      color: 'bg-amber-50 dark:bg-amber-950/30',
                      iconColor: 'text-amber-600 dark:text-amber-400',
                    },
                    {
                      icon: Languages,
                      emoji: '🗣️',
                      title: 'Vocabulaire authentique',
                      desc: 'Arabe avec voyelles et français',
                      color: 'bg-emerald-50 dark:bg-emerald-950/30',
                      iconColor: 'text-emerald-600 dark:text-emerald-400',
                    },
                    {
                      icon: Target,
                      emoji: '🎯',
                      title: 'Quiz interactifs',
                      desc: 'Testez vos connaissances',
                      color: 'bg-rose-50 dark:bg-rose-950/30',
                      iconColor: 'text-rose-600 dark:text-rose-400',
                    },
                    {
                      icon: TrendingUp,
                      emoji: '📈',
                      title: 'Suivi de progression',
                      desc: 'Suivez votre avancement',
                      color: 'bg-orange-50 dark:bg-orange-950/30',
                      iconColor: 'text-orange-600 dark:text-orange-400',
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
                    >
                      <Card className="border-0 shadow-sm">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                            <span className="text-xl">{item.emoji}</span>
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold">{item.title}</h3>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Next button */}
                <Button
                  onClick={goNext}
                  className="mt-6 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-600"
                  size="lg"
                >
                  Suivant
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="choose-level"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                <h2 className="mb-1 text-xl font-bold">Choisissez votre niveau</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Vous pouvez toujours changer plus tard
                </p>

                <div className="w-full space-y-3">
                  {[
                    {
                      id: 1,
                      emoji: '🌱',
                      title: 'Débutant complet',
                      desc: "Je n'ai aucune connaissance",
                      color: 'border-emerald-400 dark:border-emerald-600',
                      activeBg: 'bg-emerald-50 dark:bg-emerald-950/30',
                    },
                    {
                      id: 3,
                      emoji: '📖',
                      title: "J'ai quelques bases",
                      desc: 'Je connais les salutations',
                      color: 'border-amber-400 dark:border-amber-600',
                      activeBg: 'bg-amber-50 dark:bg-amber-950/30',
                    },
                    {
                      id: 6,
                      emoji: '🏆',
                      title: "J'ai déjà étudié",
                      desc: 'Je veux réviser',
                      color: 'border-rose-400 dark:border-rose-600',
                      activeBg: 'bg-rose-50 dark:bg-rose-950/30',
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
                    >
                      <Card
                        className={`cursor-pointer border-2 transition-all duration-200 ${
                          selectedLevel === item.id
                            ? `${item.color} ${item.activeBg} shadow-md`
                            : 'border-transparent hover:border-muted-foreground/20'
                        }`}
                        onClick={() => setSelectedLevel(item.id)}
                      >
                        <CardContent className="flex items-center gap-4 p-4">
                          <span className="text-2xl">{item.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold">{item.title}</h3>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                          {/* Selection indicator */}
                          <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                              selectedLevel === item.id
                                ? 'border-amber-500 bg-amber-500'
                                : 'border-muted-foreground/30'
                            }`}
                          >
                            {selectedLevel === item.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="h-2 w-2 rounded-full bg-white"
                              />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Back + Next buttons */}
                <div className="mt-6 flex w-full gap-3">
                  <Button
                    variant="outline"
                    onClick={goPrev}
                    className="flex-1"
                  >
                    Retour
                  </Button>
                  <Button
                    onClick={goNext}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-600"
                  >
                    Suivant
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="shortcuts"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                <h2 className="mb-1 text-xl font-bold">Raccourcis clavier</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Gagnez du temps avec ces raccourcis
                </p>

                <div className="w-full space-y-3">
                  {[
                    {
                      keys: ['Ctrl', 'K'],
                      action: 'Recherche',
                      icon: '🔍',
                    },
                    {
                      keys: ['←', '→'],
                      action: 'Navigation leçons',
                      icon: '📖',
                    },
                    {
                      keys: ['Espace'],
                      action: 'Retourner flashcard',
                      icon: '🃏',
                    },
                  ].map((shortcut, i) => (
                    <motion.div
                      key={shortcut.action}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
                    >
                      <Card className="border-0 shadow-sm">
                        <CardContent className="flex items-center gap-4 p-4">
                          <span className="text-xl">{shortcut.icon}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{shortcut.action}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {shortcut.keys.map((key) => (
                              <kbd
                                key={key}
                                className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-border bg-muted px-2 text-xs font-mono font-medium text-muted-foreground"
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Back + Complete buttons */}
                <div className="mt-6 flex w-full gap-3">
                  <Button
                    variant="outline"
                    onClick={goPrev}
                    className="flex-1"
                  >
                    Retour
                  </Button>
                  <Button
                    onClick={handleComplete}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-600"
                  >
                    C&apos;est parti !
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 pb-6">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (i !== step) {
                  setDirection(i > step ? 1 : -1);
                  setStep(i);
                }
              }}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-6 bg-gradient-to-r from-amber-500 to-orange-500'
                  : i < step
                    ? 'bg-amber-300 dark:bg-amber-700'
                    : 'bg-muted-foreground/20'
              }`}
              aria-label={`Étape ${i + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
