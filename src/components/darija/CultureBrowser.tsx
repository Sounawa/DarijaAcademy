'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { levels } from '@/data/curriculum';
import { useProgressStore } from '@/store/progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  X,
  BookOpen,
  ChevronRight,
  Globe,
  Lightbulb,
  Sparkles,
  Filter,
} from 'lucide-react';

// ─── Topic Categories ───────────────────────────────────────────
interface TopicCategory {
  id: string;
  label: string;
  emoji: string;
  keywords: string[];
  color: string;
  bgLight: string;
  bgDark: string;
  textLight: string;
  textDark: string;
}

const TOPICS: TopicCategory[] = [
  {
    id: 'language',
    label: 'Langue & Écriture',
    emoji: '🌐',
    keywords: [
      'alphabet', 'arabe', 'lettres', 'écrit', 'arabizi', 'chat', 'réseaux sociaux',
      'prononciation', 'son', 'guttural', 'majuscules', 'minuscules', 'diacritiques',
      'coran', 'poésie', 'droite à gauche', 'gauche à droite', 'pharaon', 'transcription',
      'phonétique', 'darija', 'voyelles', 'consonnes',
    ],
    color: 'bg-violet-100 dark:bg-violet-950/50',
    bgLight: 'bg-violet-50',
    bgDark: 'dark:bg-violet-950/30',
    textLight: 'text-violet-600',
    textDark: 'dark:text-violet-400',
  },
  {
    id: 'greetings',
    label: 'Salutations & Politesse',
    emoji: '👋',
    keywords: [
      'saluer', 'salue', 'bonjour', 'salam', 'poignée de main', 'bise',
      'cœur', 'merci', 'shukran', 'poli', 'politesse', 'tfaddal', 'hospitalité',
      'invit', 'bienvenue', 'mer7ba', '3afak', 'bismillah', 'hamdullah',
      'inconnu', 'impoli', 'respect', 'formel', 'informel',
    ],
    color: 'bg-amber-100 dark:bg-amber-950/50',
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-amber-950/30',
    textLight: 'text-amber-600',
    textDark: 'dark:text-amber-400',
  },
  {
    id: 'family',
    label: 'Famille & Relations',
    emoji: '👨‍👩‍👧‍👦',
    keywords: [
      'famille', 'sacré', 'parents', 'khu', 'ukht', 'yemma', 'baba',
      'mariage', 'frère', 'sœur', 'aîné', 'respecté', 'parenté', 'cousin',
      'oncle', 'tante', 'grand-père', 'grand-mère', 'weld', '7abib',
    ],
    color: 'bg-rose-100 dark:bg-rose-950/50',
    bgLight: 'bg-rose-50',
    bgDark: 'dark:bg-rose-950/30',
    textLight: 'text-rose-600',
    textDark: 'dark:text-rose-400',
  },
  {
    id: 'food',
    label: 'Nourriture & Cuisine',
    emoji: '🍽️',
    keywords: [
      'manger', 'nourriture', 'pain', 'khobz', 'main droite', 'cuillère',
      'bismillah', 'avant de manger', 'légumes', 'petit-déjeuner', 'thé',
      'menthe', 'huile d\'olive', 'miel', 'goûter', 'déjeuner', 'dîner',
      'tajine', 'couscous', 'souk', 'marocain', 'fraîche', 'saison',
    ],
    color: 'bg-orange-100 dark:bg-orange-950/50',
    bgLight: 'bg-orange-50',
    bgDark: 'dark:bg-orange-950/30',
    textLight: 'text-orange-600',
    textDark: 'dark:text-orange-400',
  },
  {
    id: 'shopping',
    label: 'Commerce & Marché',
    emoji: '🛒',
    keywords: [
      'marchand', 'souk', 'marché', 'prix', 'négoci', 'dirham', 'monnaie',
      'bzzaf', 'fixe', 'étiquette', 'supermarché', 'taxi', 'compteur',
      'gratuit', 'coûte', 'cher', 'pas cher', 'acheter', 'vendeur',
      'chiffres arabes', 'doigts', 'marchander',
    ],
    color: 'bg-emerald-100 dark:bg-emerald-950/50',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-950/30',
    textLight: 'text-emerald-600',
    textDark: 'dark:text-emerald-400',
  },
  {
    id: 'daily',
    label: 'Vie Quotidienne',
    emoji: '🏠',
    keywords: [
      'horaires', 'travail', 'week-end', 'vendredi', 'magasin', 'administration',
      'ferm', 'rendez-vous', 'approximatif', 'pause', 'sieste', 'repos',
      'matin', 'soir', 'nuit', 'journalier', 'routine', 'quotidien',
    ],
    color: 'bg-sky-100 dark:bg-sky-950/50',
    bgLight: 'bg-sky-50',
    bgDark: 'dark:bg-sky-950/30',
    textLight: 'text-sky-600',
    textDark: 'dark:text-sky-400',
  },
  {
    id: 'transport',
    label: 'Transport & Directions',
    emoji: '🚗',
    keywords: [
      'transport', 'taxi', 'bus', 'train', 'tram', 'rue', 'médina', 'labyrinthe',
      'google maps', 'chemin', 'accompagn', 'monument', 'repère', 'mosquée',
      'place', 'ville', 'gare', 'direction', 'perdu',
    ],
    color: 'bg-teal-100 dark:bg-teal-950/50',
    bgLight: 'bg-teal-50',
    bgDark: 'dark:bg-teal-950/30',
    textLight: 'text-teal-600',
    textDark: 'dark:text-teal-400',
  },
  {
    id: 'health',
    label: 'Santé & Bien-être',
    emoji: '💊',
    keywords: [
      'santé', 'malade', 'guérisse', 'protège', 'repos', 'sieste',
      's7a', 'formule', 'prière', 'toast', 'hospitalier', 'fatigué',
    ],
    color: 'bg-pink-100 dark:bg-pink-950/50',
    bgLight: 'bg-pink-50',
    bgDark: 'dark:bg-pink-950/30',
    textLight: 'text-pink-600',
    textDark: 'dark:text-pink-400',
  },
  {
    id: 'culture',
    label: 'Culture & Traditions',
    emoji: '🏺',
    keywords: [
      'culture', 'tradition', 'artisanat', 'zellige', 'tapis', 'berbère',
      'argan', 'henné', 'mariage', 'fête', 'hammam', 'savon noir',
      'cosmétique', 'cuire', 'souvenir', 'investissement', 'fait main',
      'mosaïque', 'bijoux', 'poterie',
    ],
    color: 'bg-yellow-100 dark:bg-yellow-950/50',
    bgLight: 'bg-yellow-50',
    bgDark: 'dark:bg-yellow-950/30',
    textLight: 'text-yellow-600',
    textDark: 'dark:text-yellow-400',
  },
  {
    id: 'communication',
    label: 'Communication',
    emoji: '💬',
    keywords: [
      'débatt', 'discut', 'opinion', 'avis', 'ironie', 'sous-tile',
      'subtile', 'conversation', 'diplomate', 'confiance', 'certitude',
      'incrédulité', 'modér', 'ton de la voix', 'parcimonie', 'contexte',
    ],
    color: 'bg-indigo-100 dark:bg-indigo-950/50',
    bgLight: 'bg-indigo-50',
    bgDark: 'dark:bg-indigo-950/30',
    textLight: 'text-indigo-600',
    textDark: 'dark:text-indigo-400',
  },
  {
    id: 'emergency',
    label: 'Urgence & Sécurité',
    emoji: '🆘',
    keywords: [
      'urgence', 'police', 'samu', 'pompier', 'commissariat', 'perte',
      'solidaires', 'sécurité', 'numéro', 'problème', 'aide', 'retour',
    ],
    color: 'bg-red-100 dark:bg-red-950/50',
    bgLight: 'bg-red-50',
    bgDark: 'dark:bg-red-950/30',
    textLight: 'text-red-600',
    textDark: 'dark:text-red-400',
  },
];

// ─── Tip Data Interface ─────────────────────────────────────────
interface CulturalTip {
  id: string;
  text: string;
  topicId: string;
  topicEmoji: string;
  lessonId: string;
  lessonTitle: string;
  lessonTitleAr: string;
  levelId: number;
  levelTitle: string;
  levelCefr: string;
  levelColor: string;
  levelIcon: string;
}

// ─── Helper: Classify tip into a topic ──────────────────────────
function classifyTip(tipText: string): TopicCategory {
  const lower = tipText.toLowerCase();
  let bestMatch: TopicCategory = TOPICS[0];
  let bestScore = 0;

  for (const topic of TOPICS) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = topic;
    }
  }

  return bestMatch;
}

// ─── Helper: Get a relevant emoji from tip content ─────────────
function getTipEmoji(tipText: string, topicEmoji: string): string {
  const lower = tipText.toLowerCase();

  const emojiMap: Array<{ keywords: string[]; emoji: string }> = [
    { keywords: ['alphabet', 'lettre', 'arabe', 'écri'], emoji: '🔤' },
    { keywords: ['pronon', 'son', 'guttural', 'bouche', 'gorge'], emoji: '🗣️' },
    { keywords: ['manger', 'pain', 'khobz', 'cuisine', 'nourriture', 'thé', 'menthe'], emoji: '🍽️' },
    { keywords: ['souk', 'marchand', 'marché', 'prix', 'acheter', 'négoci'], emoji: '🛍️' },
    { keywords: ['taxi', 'bus', 'train', 'tram', 'transport', 'route'], emoji: '🚕' },
    { keywords: ['famille', 'mère', 'père', 'frère', 'sœur', 'enfant'], emoji: '👨‍👩‍👧‍👦' },
    { keywords: ['salam', 'bonjour', 'merci', 'poli', 'main'], emoji: '🤝' },
    { keywords: ['mosquée', 'prière', 'vendredi', 'dieu', 'relig'], emoji: '🕌' },
    { keywords: ['médina', 'rue', 'ville', 'chemin', 'perdu'], emoji: '🗺️' },
    { keywords: ['santé', 'malade', 'médecin', 'guéris'], emoji: '🏥' },
    { keywords: ['tapis', 'zellige', 'artisanat', 'henné', 'argan'], emoji: '🎨' },
    { keywords: ['hammam', 'savon', 'gommage', 'bain'], emoji: '🧖' },
    { keywords: ['argent', 'dirham', 'monnaie', 'compter', 'chiffre'], emoji: '💰' },
    { keywords: ['école', 'travail', 'emploi', 'bureau', 'étud'], emoji: '💼' },
    { keywords: ['temps', 'heure', 'matin', 'soir', 'nuit', 'semaine', 'mois'], emoji: '⏰' },
    { keywords: ['maison', 'habiter', 'logement'], emoji: '🏡' },
    { keywords: ['fête', 'mariage', 'célébr', 'musique'], emoji: '🎉' },
    { keywords: ['opinion', 'débat', 'discuss', 'avis'], emoji: '💭' },
    { keywords: ['urgence', 'police', 'pompier', 'danger'], emoji: '🚨' },
    { keywords: ['darija', 'langue', 'mot', 'vocabulaire'], emoji: '📚' },
  ];

  for (const entry of emojiMap) {
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) {
        return entry.emoji;
      }
    }
  }

  return topicEmoji;
}

// ─── Animation variants ─────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.15 } },
};

// ─── Level color map for CEFR badges ───────────────────────────
const CEFR_COLORS: Record<string, string> = {
  'A1.1': 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
  'A1.2': 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  'A2.1': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  'A2.2': 'bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300',
  'B1.1': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/50 dark:text-fuchsia-300',
  'B1.2': 'bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300',
};

// ═════════════════════════════════════════════════════════════════
// Main Component
// ═════════════════════════════════════════════════════════════════
export function CultureBrowser() {
  const { setCurrentView, setCurrentLevel, setCurrentLesson } = useProgressStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(timer);
  }, []);

  // ─── Extract all tips from curriculum ────────────────────────
  const allTips = useMemo<CulturalTip[]>(() => {
    const tips: CulturalTip[] = [];
    for (const level of levels) {
      for (const lesson of level.lessons) {
        if (!lesson.tips) continue;
        for (let i = 0; i < lesson.tips.length; i++) {
          const tipText = lesson.tips[i];
          const topic = classifyTip(tipText);
          tips.push({
            id: `${lesson.id}-tip-${i}`,
            text: tipText,
            topicId: topic.id,
            topicEmoji: getTipEmoji(tipText, topic.emoji),
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            lessonTitleAr: lesson.titleAr,
            levelId: level.id,
            levelTitle: level.title,
            levelCefr: level.cefrLevel,
            levelColor: level.color,
            levelIcon: level.icon,
          });
        }
      }
    }
    return tips;
  }, []);

  // ─── Unique CEFR levels ──────────────────────────────────────
  const cefrLevels = useMemo(() => {
    const seen = new Set<string>();
    return levels
      .filter((l) => {
        if (seen.has(l.cefrLevel)) return false;
        seen.add(l.cefrLevel);
        return true;
      })
      .map((l) => l.cefrLevel);
  }, []);

  // ─── Statistics ──────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = allTips.length;
    const perLevel: Record<string, number> = {};
    const perTopic: Record<string, number> = {};
    for (const tip of allTips) {
      perLevel[tip.levelCefr] = (perLevel[tip.levelCefr] || 0) + 1;
      perTopic[tip.topicId] = (perTopic[tip.topicId] || 0) + 1;
    }
    return { total, perLevel, perTopic };
  }, [allTips]);

  // ─── Filtered tips ───────────────────────────────────────────
  const filteredTips = useMemo(() => {
    let result = allTips;

    if (selectedLevel !== 'all') {
      result = result.filter((t) => t.levelCefr === selectedLevel);
    }

    if (selectedTopic !== 'all') {
      result = result.filter((t) => t.topicId === selectedTopic);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.text.toLowerCase().includes(q) ||
          t.lessonTitle.toLowerCase().includes(q) ||
          t.levelTitle.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allTips, selectedLevel, selectedTopic, searchQuery]);

  // ─── Active topic counts (for badges) ───────────────────────
  const topicCounts = useMemo(() => {
    const base = selectedLevel !== 'all'
      ? allTips.filter((t) => t.levelCefr === selectedLevel)
      : allTips;
    const counts: Record<string, number> = {};
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const searchFiltered = base.filter(
        (t) =>
          t.text.toLowerCase().includes(q) ||
          t.lessonTitle.toLowerCase().includes(q) ||
          t.levelTitle.toLowerCase().includes(q)
      );
      for (const t of searchFiltered) {
        counts[t.topicId] = (counts[t.topicId] || 0) + 1;
      }
    } else {
      for (const t of base) {
        counts[t.topicId] = (counts[t.topicId] || 0) + 1;
      }
    }
    return counts;
  }, [allTips, selectedLevel, searchQuery]);

  // ─── Handlers ────────────────────────────────────────────────
  const handleTipClick = useCallback(
    (tip: CulturalTip) => {
      setCurrentLevel(tip.levelId);
      setCurrentLesson(tip.lessonId);
    },
    [setCurrentLevel, setCurrentLesson]
  );

  const handleBack = useCallback(() => {
    setCurrentView('home');
  }, [setCurrentView]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    inputRef.current?.focus();
  }, []);

  const hasActiveFilters = selectedLevel !== 'all' || selectedTopic !== 'all' || searchQuery.trim().length > 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-4xl space-y-6"
    >
      {/* ─── Header ──────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Notes Culturelles
            </span>{' '}
            Marocaines
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Découvrez les coutumes, traditions et astuces du Maroc à travers les leçons
          </p>
        </div>
      </motion.div>

      {/* ─── Statistics Cards ────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50">
                <Globe className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-300">{stats.total}</p>
                <p className="text-xs text-muted-foreground">notes culturelles au total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-900/50">
                <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-teal-700 dark:text-teal-300">{cefrLevels.length}</p>
                <p className="text-xs text-muted-foreground">niveaux CEFR</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/50">
                <Sparkles className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-rose-700 dark:text-rose-300">{TOPICS.length}</p>
                <p className="text-xs text-muted-foreground">catégories thématiques</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Tips per Level breakdown ────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <BookOpen className="h-4 w-4 text-amber-500" />
              Répartition par niveau
            </h3>
            <div className="flex flex-wrap gap-2">
              {cefrLevels.map((cefr) => {
                const count = stats.perLevel[cefr] || 0;
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <button
                    key={cefr}
                    onClick={() => setSelectedLevel(selectedLevel === cefr ? 'all' : cefr)}
                    className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-all ${
                      selectedLevel === cefr
                        ? 'border-amber-300 bg-amber-50 shadow-sm dark:border-amber-700 dark:bg-amber-950/30'
                        : 'hover:border-amber-200 hover:bg-amber-50/50 dark:hover:border-amber-800 dark:hover:bg-amber-950/20'
                    }`}
                  >
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-bold ${CEFR_COLORS[cefr] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {cefr}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{count}</span>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Search & Filters ────────────────────────────────── */}
      <motion.div variants={itemVariants} className="space-y-3">
        {/* Search Input */}
        <div className="relative rounded-lg">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une note culturelle..."
            className="h-12 pl-11 pr-10 text-base shadow-sm transition-all duration-300"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearSearch}
              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
              aria-label="Effacer"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter toggle + active filters */}
        <div className="flex items-center gap-2">
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-1.5"
          >
            <Filter className="h-3.5 w-3.5" />
            Catégories
            {selectedTopic !== 'all' && (
              <Badge variant="secondary" className="ml-1 text-[10px]">
                1
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedLevel('all');
                setSelectedTopic('all');
                setSearchQuery('');
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="mr-1 h-3 w-3" />
              Réinitialiser
            </Button>
          )}
          {selectedLevel !== 'all' && (
            <Badge
              variant="outline"
              className="gap-1 cursor-pointer"
              onClick={() => setSelectedLevel('all')}
            >
              {selectedLevel}
              <X className="h-3 w-3" />
            </Badge>
          )}
          <span className="ml-auto text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredTips.length}</span>{' '}
            note{filteredTips.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Topic filter chips */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 rounded-lg border bg-muted/30 p-3">
                <button
                  onClick={() => setSelectedTopic('all')}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedTopic === 'all'
                      ? 'border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                      : 'border-transparent bg-background hover:bg-muted'
                  }`}
                >
                  Toutes
                </button>
                {TOPICS.map((topic) => {
                  const count = topicCounts[topic.id] || 0;
                  if (count === 0) return null;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(selectedTopic === topic.id ? 'all' : topic.id)}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        selectedTopic === topic.id
                          ? 'border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'border-transparent bg-background hover:bg-muted'
                      }`}
                    >
                      <span>{topic.emoji}</span>
                      <span>{topic.label}</span>
                      <span className="text-[10px] text-muted-foreground">({count})</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ─── Tips Grid ───────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {filteredTips.length > 0 ? (
          <motion.div
            key={`${selectedLevel}-${selectedTopic}-${searchQuery}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {filteredTips.map((tip) => (
              <motion.div key={tip.id} variants={cardVariants} layout>
                <Card
                  className="group cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-700 overflow-hidden"
                  onClick={() => handleTipClick(tip)}
                >
                  <CardContent className="p-0">
                    {/* Top gradient accent */}
                    <div className={`h-1 w-full bg-gradient-to-r ${tip.levelColor}`} />

                    <div className="p-4">
                      {/* Header: emoji + topic + level */}
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl" role="img" aria-label={tip.topicId}>
                            {tip.topicEmoji}
                          </span>
                          <Badge variant="secondary" className="text-[10px]">
                            {TOPICS.find((t) => t.id === tip.topicId)?.label}
                          </Badge>
                        </div>
                        <Badge
                          className={`text-[10px] font-bold ${CEFR_COLORS[tip.levelCefr] || 'bg-gray-100 text-gray-600'}`}
                        >
                          {tip.levelIcon} {tip.levelCefr}
                        </Badge>
                      </div>

                      {/* Tip text */}
                      <p className="mb-3 text-sm leading-relaxed text-foreground/90">
                        <Lightbulb className="mr-1.5 inline h-3.5 w-3.5 text-amber-500" />
                        {tip.text}
                      </p>

                      {/* Lesson link */}
                      <div className="flex items-center gap-1.5 rounded-md bg-muted/50 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors group-hover:bg-amber-50 group-hover:text-amber-600 dark:group-hover:bg-amber-950/30 dark:group-hover:text-amber-400">
                        <BookOpen className="h-3 w-3 shrink-0" />
                        <span className="truncate font-medium">
                          Leçon {tip.lessonId} — {tip.lessonTitle}
                        </span>
                        <ChevronRight className="ml-auto h-3 w-3 shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* ─── Empty State ──────────────────────────────────── */
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center rounded-2xl py-16 text-center"
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950/50 dark:to-orange-950/50">
              <Globe className="h-8 w-8 text-amber-500 dark:text-amber-400" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">
              Aucune note trouvée
            </h3>
            <p className="mb-4 max-w-sm text-sm text-muted-foreground">
              {hasActiveFilters
                ? 'Essayez de modifier vos filtres ou votre recherche.'
                : 'Explorez les notes culturelles à travers les différentes catégories.'}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedLevel('all');
                  setSelectedTopic('all');
                  setSearchQuery('');
                }}
              >
                Effacer tous les filtres
              </Button>
            )}
            {!hasActiveFilters && (
              <div className="flex flex-wrap justify-center gap-2">
                {TOPICS.slice(0, 5).map((topic) => (
                  <Button
                    key={topic.id}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setSelectedTopic(topic.id);
                      setShowFilters(true);
                    }}
                  >
                    {topic.emoji} {topic.label}
                  </Button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Back Button ────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="pb-4">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour à l&apos;accueil
        </Button>
      </motion.div>
    </motion.div>
  );
}
