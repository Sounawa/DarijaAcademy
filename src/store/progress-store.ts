import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { levels } from '@/data/curriculum';

type ViewType = 'home' | 'level' | 'lesson' | 'quiz' | 'flashcards' | 'stats' | 'search' | 'bookmarks' | 'srs' | 'practice' | 'challenge' | 'settings' | 'culture' | 'pronunciation' | 'streak' | 'conversation' | 'mistakes' | 'share' | 'speedgame' | 'writing' | 'achievements';

interface SpeedGameScore {
  score: number;
  difficulty: string;
  date: number;
  correct: number;
  total: number;
  avgTime: number;
}

interface WrongAnswer {
  questionId: string;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  lessonId: string;
  timestamp: number;
}

interface SrsItem {
  ease: number;
  interval: number;
  repetitions: number;
  nextReview: string;
  lastReview: string;
}

interface ProgressState {
  completedLessons: string[];
  quizScores: Record<string, number>;
  currentLevel: number;
  currentLesson: string | null;
  currentView: ViewType;
  streak: number;
  lastVisit: string | null;
  completionDates: Record<string, string>;
  bookmarkedVocab: string[];
  srsData: Record<string, SrsItem>;
  dailyChallenge: { date: string; completed: boolean; score: number; answers: number[] };
  hasCompletedOnboarding: boolean;
  wrongAnswers: WrongAnswer[];
  speedGameHighScores: SpeedGameScore[];
  lessonNotes: Record<string, string>;
  writingScores: Record<string, number>;
  visitedViews: string[];
  dailyGoal: number;
  todayCompletedLessons: string[];
  todayDate: string;

  completeLesson: (lessonId: string) => void;
  setQuizScore: (lessonId: string, score: number) => void;
  setCurrentLevel: (level: number) => void;
  setCurrentLesson: (lessonId: string | null) => void;
  setCurrentView: (view: ViewType) => void;
  getLevelProgress: (levelId: number, totalLessons: number) => number;
  getTotalProgress: (totalLessons: number) => number;
  updateStreak: () => void;
  toggleBookmark: (key: string) => void;
  isBookmarked: (key: string) => boolean;
  clearBookmarks: () => void;
  updateSrsItem: (key: string, quality: number) => void;
  getSrsDueItems: () => string[];
  getSrsStats: () => { due: number; learning: number; mastered: number; total: number };
  addVocabToSrs: (keys: string[]) => void;
  setDailyChallengeResult: (score: number, answers: number[]) => void;
  getTodayChallengeStatus: () => { completed: boolean; score: number; isToday: boolean };
  completeOnboarding: (selectedLevel?: number) => void;
  addWrongAnswer: (answer: Omit<WrongAnswer, 'timestamp'>) => void;
  clearWrongAnswers: () => void;
  getWrongAnswersByLesson: (lessonId: string) => WrongAnswer[];
  removeWrongAnswer: (questionId: string) => void;
  resetAllProgress: () => void;
  clearSrsData: () => void;
  addSpeedGameScore: (score: SpeedGameScore) => void;
  getSpeedGameHighScores: () => SpeedGameScore[];
  updateLessonNote: (lessonId: string, note: string) => void;
  getLessonNote: (lessonId: string) => string;
  setWritingScore: (sessionId: string, score: number) => void;
  markViewVisited: (view: string) => void;
  setDailyGoal: (goal: number) => void;
  getTodayProgress: () => { completed: number; goal: number; achieved: boolean };
}

function buildVocabLookup() {
  const lookup: Record<string, { french: string; phonetic: string; arabic: string; notes?: string }> = {};
  for (const level of levels) {
    for (const lesson of level.lessons) {
      for (let i = 0; i < lesson.vocabulary.length; i++) {
        const v = lesson.vocabulary[i];
        lookup[`${lesson.id}-${i}`] = {
          french: v.french,
          phonetic: v.phonetic,
          arabic: v.arabic,
          notes: v.notes,
        };
      }
    }
  }
  return lookup;
}

const vocabLookup = buildVocabLookup();

export { vocabLookup };
export type { WrongAnswer, SpeedGameScore };

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      quizScores: {},
      currentLevel: 1,
      currentLesson: null,
      currentView: 'home' as ViewType,
      streak: 0,
      lastVisit: null,
      completionDates: {},
      bookmarkedVocab: [],
      srsData: {},
      dailyChallenge: { date: '', completed: false, score: 0, answers: [] },
      hasCompletedOnboarding: false,
      wrongAnswers: [],
      speedGameHighScores: [],
      lessonNotes: {},
      writingScores: {},
      visitedViews: [],
      dailyGoal: 3,
      todayCompletedLessons: [],
      todayDate: '',

      completeLesson: (lessonId: string) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          completedLessons: state.completedLessons.includes(lessonId)
            ? state.completedLessons
            : [...state.completedLessons, lessonId],
          completionDates: state.completedLessons.includes(lessonId)
            ? state.completionDates
            : { ...state.completionDates, [lessonId]: new Date().toISOString() },
          // Track daily progress
          ...(state.todayDate === today
            ? {
                todayCompletedLessons: state.todayCompletedLessons.includes(lessonId)
                  ? state.todayCompletedLessons
                  : [...state.todayCompletedLessons, lessonId],
              }
            : { todayDate: today, todayCompletedLessons: [lessonId] }),
        }));
      },

      setQuizScore: (lessonId: string, score: number) => {
        set((state) => {
          const currentBest = state.quizScores[lessonId] ?? 0;
          return {
            quizScores: {
              ...state.quizScores,
              [lessonId]: Math.max(currentBest, score),
            },
          };
        });
      },

      setCurrentLevel: (level: number) => {
        set({ currentLevel: level, currentView: 'level' });
      },

      setCurrentLesson: (lessonId: string | null) => {
        set({ currentLesson: lessonId, currentView: lessonId ? 'lesson' : 'home' });
      },

      setCurrentView: (view: ViewType) => {
        const today = new Date().toISOString().split('T')[0];
        // Reset daily counter if new day
        const currentState = get();
        const needsReset = currentState.todayDate !== today;
        set({
          currentView: view,
          visitedViews: currentState.visitedViews.includes(view) ? currentState.visitedViews : [...currentState.visitedViews, view],
          ...(needsReset ? { todayDate: today, todayCompletedLessons: [] } : {}),
        });
      },

      getLevelProgress: (levelId: number, totalLessons: number) => {
        const state = get();
        const prefix = `${levelId}-`;
        const completedInLevel = state.completedLessons.filter((id) =>
          id.startsWith(prefix)
        ).length;
        return totalLessons > 0 ? Math.round((completedInLevel / totalLessons) * 100) : 0;
      },

      getTotalProgress: (totalLessons: number) => {
        const state = get();
        return totalLessons > 0
          ? Math.round((state.completedLessons.length / totalLessons) * 100)
          : 0;
      },

      updateStreak: () => {
        const state = get();
        const today = new Date().toDateString();
        const lastVisit = state.lastVisit;

        if (lastVisit) {
          const lastDate = new Date(lastVisit);
          const todayDate = new Date(today);
          const diffDays = Math.floor(
            (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (diffDays === 1) {
            set({ streak: state.streak + 1, lastVisit: today });
          } else if (diffDays > 1) {
            set({ streak: 1, lastVisit: today });
          }
        } else {
          set({ streak: 1, lastVisit: today });
        }
      },

      toggleBookmark: (key: string) => {
        set((state) => ({
          bookmarkedVocab: state.bookmarkedVocab.includes(key)
            ? state.bookmarkedVocab.filter((k) => k !== key)
            : [...state.bookmarkedVocab, key],
        }));
      },

      isBookmarked: (key: string) => {
        return get().bookmarkedVocab.includes(key);
      },

      clearBookmarks: () => {
        set({ bookmarkedVocab: [] });
      },

      // ─── SRS (Spaced Repetition) ────────────────────────────────────
      updateSrsItem: (key: string, quality: number) => {
        set((state) => {
          const existing = state.srsData[key];
          const now = new Date().toISOString();
          let ease: number;
          let interval: number;
          let repetitions: number;

          if (!existing) {
            // First review
            ease = 2.5;
            repetitions = quality >= 3 ? 1 : 0;
            interval = quality >= 3 ? 1 : 0; // review again tomorrow if failed
          } else {
            ease = existing.ease;
            repetitions = existing.repetitions;

            if (quality >= 3) {
              // Success
              if (repetitions === 0) {
                interval = 1;
              } else if (repetitions === 1) {
                interval = 6;
              } else {
                interval = Math.round(existing.interval * ease);
              }
              repetitions += 1;
            } else {
              // Fail — reset
              repetitions = 0;
              interval = 0; // due immediately
            }

            // Adjust ease factor
            ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
            ease = Math.max(1.3, ease); // minimum ease
          }

          // Calculate next review date
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + interval);

          return {
            srsData: {
              ...state.srsData,
              [key]: {
                ease,
                interval,
                repetitions,
                nextReview: nextDate.toISOString(),
                lastReview: now,
              },
            },
          };
        });
      },

      getSrsDueItems: () => {
        const state = get();
        const now = new Date();
        return Object.keys(state.srsData).filter((key) => {
          const item = state.srsData[key];
          if (!item) return false;
          const nextReview = new Date(item.nextReview);
          return nextReview <= now;
        });
      },

      getSrsStats: () => {
        const state = get();
        const keys = Object.keys(state.srsData);
        const now = new Date();
        let due = 0;
        let learning = 0;
        let mastered = 0;

        for (const key of keys) {
          const item = state.srsData[key];
          if (!item) continue;
          const nextReview = new Date(item.nextReview);
          if (nextReview <= now) {
            due++;
          } else if (item.repetitions >= 3) {
            mastered++;
          } else {
            learning++;
          }
        }

        return { due, learning, mastered, total: keys.length };
      },

      addVocabToSrs: (keys: string[]) => {
        set((state) => {
          const newSrsData = { ...state.srsData };
          const now = new Date();
          // Items are due immediately (interval=0 means today)
          const nextReview = now.toISOString();

          for (const key of keys) {
            if (!newSrsData[key]) {
              newSrsData[key] = {
                ease: 2.5,
                interval: 0,
                repetitions: 0,
                nextReview,
                lastReview: now.toISOString(),
              };
            }
          }

          return { srsData: newSrsData };
        });
      },

      // ─── Daily Challenge ────────────────────────────────────────────
      setDailyChallengeResult: (score: number, answers: number[]) => {
        const today = new Date().toISOString().split('T')[0];
        set({
          dailyChallenge: {
            date: today,
            completed: true,
            score,
            answers,
          },
        });
      },

      getTodayChallengeStatus: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        return {
          completed: state.dailyChallenge.date === today && state.dailyChallenge.completed,
          score: state.dailyChallenge.score,
          isToday: state.dailyChallenge.date === today,
        };
      },

      // ─── Wrong Answers ───────────────────────────────────────────
      addWrongAnswer: (answer) => {
        set((state) => {
          // Avoid duplicate question entries — replace if same questionId already exists
          const filtered = state.wrongAnswers.filter((w) => w.questionId !== answer.questionId);
          return {
            wrongAnswers: [
              ...filtered,
              { ...answer, timestamp: Date.now() },
            ],
          };
        });
      },

      clearWrongAnswers: () => {
        set({ wrongAnswers: [] });
      },

      getWrongAnswersByLesson: (lessonId: string) => {
        return get().wrongAnswers.filter((w) => w.lessonId === lessonId);
      },

      removeWrongAnswer: (questionId: string) => {
        set((state) => ({
          wrongAnswers: state.wrongAnswers.filter((w) => w.questionId !== questionId),
        }));
      },

      // ─── Onboarding ────────────────────────────────────────────────
      completeOnboarding: (selectedLevel?: number) => {
        set({
          hasCompletedOnboarding: true,
          ...(selectedLevel !== undefined ? { currentLevel: selectedLevel } : {}),
        });
      },

      // ─── Data Management ──────────────────────────────────────────
      resetAllProgress: () => {
        set({
          completedLessons: [],
          quizScores: {},
          streak: 0,
          lastVisit: null,
          completionDates: {},
          bookmarkedVocab: [],
          srsData: {},
          dailyChallenge: { date: '', completed: false, score: 0, answers: [] },
          hasCompletedOnboarding: false,
          currentLevel: 1,
          currentLesson: null,
          wrongAnswers: [],
          speedGameHighScores: [],
          lessonNotes: {},
        });
      },

      clearSrsData: () => {
        set({ srsData: {} });
      },

      // ─── Speed Game ────────────────────────────────────────────────
      addSpeedGameScore: (score: SpeedGameScore) => {
        set((state) => ({
          speedGameHighScores: [...state.speedGameHighScores, score]
            .sort((a, b) => b.score - a.score)
            .slice(0, 50),
        }));
      },

      getSpeedGameHighScores: () => {
        return get().speedGameHighScores;
      },

      // ─── Lesson Notes ───────────────────────────────────────────────
      updateLessonNote: (lessonId: string, note: string) => {
        set((state) => ({
          lessonNotes: {
            ...state.lessonNotes,
            [lessonId]: note,
          },
        }));
      },

      getLessonNote: (lessonId: string) => {
        return get().lessonNotes[lessonId] ?? '';
      },

      // ─── Writing Practice ─────────────────────────────────────────
      setWritingScore: (sessionId: string, score: number) => {
        set((state) => {
          const currentBest = state.writingScores[sessionId] ?? 0;
          return {
            writingScores: {
              ...state.writingScores,
              [sessionId]: Math.max(currentBest, score),
            },
          };
        });
      },

      // ─── View Tracking (for achievements) ─────────────────────────
      markViewVisited: (view: string) => {
        set((state) => {
          if (state.visitedViews.includes(view)) return state;
          return { visitedViews: [...state.visitedViews, view] };
        });
      },

      // ─── Daily Goal ────────────────────────────────────────────────
      setDailyGoal: (goal: number) => {
        set({ dailyGoal: Math.max(1, Math.min(20, goal)) });
      },

      getTodayProgress: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        if (state.todayDate !== today) {
          return { completed: 0, goal: state.dailyGoal, achieved: false };
        }
        const completed = state.todayCompletedLessons.length;
        return {
          completed,
          goal: state.dailyGoal,
          achieved: completed >= state.dailyGoal,
        };
      },
    }),
    {
      name: 'darija-progress',
    }
  )
);
