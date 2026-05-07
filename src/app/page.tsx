'use client';

import { useProgressStore } from '@/store/progress-store';
import { HomePage } from '@/components/darija/HomePage';
import { LevelView } from '@/components/darija/LevelView';
import { LessonView } from '@/components/darija/LessonView';
import { QuizView } from '@/components/darija/QuizView';
import { FlashcardsView } from '@/components/darija/FlashcardsView';
import { SearchView } from '@/components/darija/SearchView';
import { StatsView } from '@/components/darija/StatsView';
import { BookmarksView } from '@/components/darija/BookmarksView';
import { SrsView } from '@/components/darija/SrsView';
import { PracticeView } from '@/components/darija/PracticeView';
import { DailyChallengeView } from '@/components/darija/DailyChallengeView';
import { OnboardingModal } from '@/components/darija/OnboardingModal';
import { CultureBrowser } from '@/components/darija/CultureBrowser';
import { SettingsView } from '@/components/darija/SettingsView';
import { PronunciationGuide } from '@/components/darija/PronunciationGuide';
import { StreakCalendar } from '@/components/darija/StreakCalendar';
import { ConversationPractice } from '@/components/darija/ConversationPractice';
import { MistakeReview } from '@/components/darija/MistakeReview';
import { ProgressShare } from '@/components/darija/ProgressShare';
import { SpeedGame } from '@/components/darija/SpeedGame';
import { WritingPractice } from '@/components/darija/WritingPractice';
import { AchievementView } from '@/components/darija/AchievementView';
import { Header } from '@/components/darija/Header';
import { Footer } from '@/components/darija/Footer';
import { AnimatePresence, motion } from 'framer-motion';

export default function DarijaPage() {
  const { currentView, hasCompletedOnboarding } = useProgressStore();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-950 dark:to-gray-900 relative vignette grain-overlay">
      {/* Fixed background pattern overlay */}
      <div className="fixed inset-0 moroccan-pattern-animated pointer-events-none z-0" />

      {/* Floating decorative orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Orb 1 - Amber */}
        <div
          className="animate-float-slow absolute -top-20 -right-20 h-72 w-72 rounded-full opacity-[0.04] dark:opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.6) 0%, transparent 70%)',
          }}
        />
        {/* Orb 2 - Terracotta */}
        <div
          className="animate-float-slow-2 absolute top-1/3 -left-32 h-96 w-96 rounded-full opacity-[0.03] dark:opacity-[0.02]"
          style={{
            background: 'radial-gradient(circle, rgba(196, 113, 59, 0.5) 0%, transparent 70%)',
          }}
        />
        {/* Orb 3 - Gold */}
        <div
          className="animate-float-slow-3 absolute -bottom-24 right-1/4 h-80 w-80 rounded-full opacity-[0.035] dark:opacity-[0.02]"
          style={{
            background: 'radial-gradient(circle, rgba(218, 165, 32, 0.5) 0%, transparent 70%)',
          }}
        />
        {/* Orb 4 - Teal (subtle) */}
        <div
          className="animate-float-slow absolute top-2/3 -right-16 h-56 w-56 rounded-full opacity-[0.025] dark:opacity-[0.015]"
          style={{
            background: 'radial-gradient(circle, rgba(27, 154, 170, 0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      <Header />
      {!hasCompletedOnboarding && <OnboardingModal />}
      <main className="relative z-10 flex-1 container mx-auto px-4 py-6 max-w-6xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {currentView === 'home' && <HomePage />}
            {currentView === 'level' && <LevelView />}
            {currentView === 'lesson' && <LessonView />}
            {currentView === 'quiz' && <QuizView />}
            {currentView === 'flashcards' && <FlashcardsView />}
            {currentView === 'stats' && <StatsView />}
            {currentView === 'search' && <SearchView />}
            {currentView === 'bookmarks' && <BookmarksView />}
            {currentView === 'srs' && <SrsView />}
            {currentView === 'practice' && <PracticeView />}
            {currentView === 'challenge' && <DailyChallengeView />}
            {currentView === 'culture' && <CultureBrowser />}
            {currentView === 'settings' && <SettingsView />}
            {currentView === 'pronunciation' && <PronunciationGuide />}
            {currentView === 'streak' && <StreakCalendar />}
            {currentView === 'conversation' && <ConversationPractice />}
            {currentView === 'mistakes' && <MistakeReview />}
            {currentView === 'share' && <ProgressShare />}
            {currentView === 'speedgame' && <SpeedGame />}
            {currentView === 'writing' && <WritingPractice />}
            {currentView === 'achievements' && <AchievementView />}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
