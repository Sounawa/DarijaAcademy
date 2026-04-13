'use client';

import { useSyncExternalStore, useEffect, useRef, useState } from 'react';
import { useProgressStore } from '@/store/progress-store';
import { levels } from '@/data/curriculum';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Sun, Moon, Star, Flame, Home, Search, BarChart3, Heart, Brain, Zap, Settings, Globe, CalendarDays, MessageSquare, Menu, X, AlertTriangle, Share2, Gamepad2, PenLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const totalLessons = levels.reduce((acc, l) => acc + l.lessons.length, 0);

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function Header() {
  const {
    getTotalProgress,
    streak,
    currentView,
    setCurrentView,
    updateStreak,
    bookmarkedVocab,
    getSrsDueItems,
  } = useProgressStore();

  const srsDueCount = getSrsDueItems().length;
  const wrongAnswersCount = useProgressStore((s) => s.wrongAnswers.length);
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const streakUpdated = useRef(false);

  useEffect(() => {
    if (!streakUpdated.current) {
      streakUpdated.current = true;
      updateStreak();
    }
  }, [updateStreak]);

  const totalProgress = getTotalProgress(totalLessons);
  const isHome = currentView === 'home';
  const bookmarkCount = bookmarkedVocab.length;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Track scroll for blur intensity */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { view: 'mistakes' as const, icon: AlertTriangle, label: 'Erreurs', color: 'rose', badge: wrongAnswersCount },
    { view: 'srs' as const, icon: Brain, label: 'Révision', color: 'amber' },
    { view: 'practice' as const, icon: Zap, label: 'Pratique', color: 'orange' },
    { view: 'speedgame' as const, icon: Gamepad2, label: 'Jeu Vitesse', color: 'emerald' },
    { view: 'conversation' as const, icon: MessageSquare, label: 'Dialogue', color: 'teal' },
    { view: 'writing' as const, icon: PenLine, label: 'Écriture', color: 'amber' },
    { view: 'culture' as const, icon: Globe, label: 'Culture', color: 'teal' },
    { view: 'search' as const, icon: Search, label: 'Recherche', color: 'amber' },
    { view: 'bookmarks' as const, icon: Heart, label: 'Favoris', color: 'rose', badge: bookmarkCount },
    { view: 'stats' as const, icon: BarChart3, label: 'Stats', color: 'amber' },
    { view: 'streak' as const, icon: CalendarDays, label: 'Calendrier', color: 'orange' },
    { view: 'share' as const, icon: Share2, label: 'Partager', color: 'amber' },
    { view: 'settings' as const, icon: Settings, label: 'Paramètres', color: 'gray' },
  ];

  const handleNav = (view: string) => {
    setCurrentView(view as any);
    setMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'header-scrolled' : ''}`}>
      <div className={`header-glass transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`} style={scrolled ? { backdropFilter: 'blur(24px) saturate(2)', WebkitBackdropFilter: 'blur(24px) saturate(2)' } : undefined}>
        <div className="container mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
          {/* Logo */}
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 transition-opacity hover:opacity-80 shrink-0"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-sm shadow-amber-500/20">
              <Star className="h-5 w-5 text-white" />
            </div>
            <span className="hidden text-lg font-bold sm:inline">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Darija
              </span>
              <span className="text-foreground">Academy</span>
            </span>
          </button>

          {/* Center progress - hidden on mobile */}
          <div className="mx-2 hidden flex-1 lg:block">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-muted-foreground">
                Progression
              </span>
              <Progress value={totalProgress} className="h-2 flex-1" />
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                {totalProgress}%
              </span>
            </div>
          </div>

          {/* Mobile progress (small) */}
          <div className="flex flex-1 items-center gap-2 lg:hidden">
            <Progress value={totalProgress} className="h-1.5 flex-1" />
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {totalProgress}%
            </span>
          </div>

          {/* Streak pill - always visible */}
          {streak > 0 && (
            <div
              className={`hidden sm:flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 dark:bg-orange-950/50 shrink-0 ${
                streak > 3 ? 'animate-pulse-glow' : ''
              } ${
                streak >= 5 ? 'streak-fire-glow' : ''
              }`}
            >
              <Flame className={`h-3.5 w-3.5 text-orange-500 ${streak > 3 ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                {streak}
              </span>
            </div>
          )}

          {/* Desktop nav buttons */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.view}
                variant="ghost"
                size="icon"
                onClick={() => handleNav(item.view)}
                className={`relative h-9 w-9 ${currentView === item.view ? `bg-${item.color}-100 text-${item.color}-600 dark:bg-${item.color}-950/50 dark:text-${item.color}-400` : ''}`}
                aria-label={item.label}
              >
                <item.icon className="h-4 w-4" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Right actions: theme + home + mobile menu */}
          <div className="flex items-center gap-1">
            {/* Home when not on home */}
            {!isHome && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentView('home')}
                className="h-9 w-9"
                aria-label="Accueil"
              >
                <Home className="h-4 w-4" />
              </Button>
            )}

            {/* Theme toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-9 w-9"
                aria-label="Changer de thème"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden border-b border-amber-200/50 bg-white/95 backdrop-blur-xl dark:border-amber-900/30 dark:bg-gray-950/95 mobile-menu-gradient-top"
          >
            <div className="container mx-auto grid max-w-6xl grid-cols-3 gap-1 px-4 py-3 sm:grid-cols-5">
              {navItems.map((item, idx) => (
                <motion.button
                  key={item.view}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * idx, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => handleNav(item.view)}
                  className={`flex flex-col items-center gap-1 rounded-lg p-2.5 text-center transition-colors ${
                    currentView === item.view
                      ? `bg-${item.color}-100 text-${item.color}-600 dark:bg-${item.color}-950/50 dark:text-${item.color}-400`
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <div className="relative">
                    <item.icon className="h-5 w-5" />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-rose-500 px-0.5 text-[8px] font-bold text-white">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium leading-tight">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
