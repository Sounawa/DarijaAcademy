'use client';

import { useEffect, useState, useRef } from 'react';
import { useProgressStore } from '@/store/progress-store';
import { levels } from '@/data/curriculum';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  Sun,
  Moon,
  Monitor,
  Type,
  GraduationCap,
  BookOpen,
  Languages,
  Download,
  Upload,
  Trash2,
  Trash,
  Bookmark,
  Brain,
  Info,
  Star,
  ExternalLink,
  Heart,
  Sparkles,
  Check,
  AlertTriangle,
} from 'lucide-react';

// ─── Local storage helpers ─────────────────────────────────────────────────
type FontSize = 'small' | 'medium' | 'large';
type DefaultView = 'vocabulary' | 'phrases' | 'grammar';

function getStoredSetting<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setStoredSetting<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Stats computation ─────────────────────────────────────────────────────
function computeStats() {
  const totalLessons = levels.reduce((acc, l) => acc + l.lessons.length, 0);
  const totalVocab = levels.reduce(
    (acc, l) => acc + l.lessons.reduce((a, les) => a + les.vocabulary.length, 0),
    0
  );
  const totalQuiz = levels.reduce(
    (acc, l) => acc + l.lessons.reduce((a, les) => a + les.quiz.length, 0),
    0
  );
  return { totalLessons, totalVocab, totalQuiz, totalLevels: levels.length };
}

// ─── Animation variants ────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

// ─── Font size map ─────────────────────────────────────────────────────────
const fontSizeMap: Record<FontSize, string> = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
};

// ─── Component ─────────────────────────────────────────────────────────────
export function SettingsView() {
  const store = useProgressStore();
  const { theme, setTheme } = useTheme();

  // Local preferences (localStorage)
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [defaultView, setDefaultView] = useState<DefaultView>('vocabulary');
  const [autoPlayFlip, setAutoPlayFlip] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = computeStats();

  // Hydrate local preferences from localStorage on mount
  useEffect(() => {
    setFontSize(getStoredSetting<FontSize>('darija-settings-fontSize', 'medium'));
    setDefaultView(getStoredSetting<DefaultView>('darija-settings-defaultView', 'vocabulary'));
    setAutoPlayFlip(getStoredSetting<boolean>('darija-settings-autoPlayFlip', false));
    setMounted(true);
  }, []);

  // Persist preferences
  const updateFontSize = (v: FontSize) => {
    setFontSize(v);
    setStoredSetting('darija-settings-fontSize', v);
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    document.documentElement.classList.add(fontSizeMap[v]);
  };

  const updateDefaultView = (v: DefaultView) => {
    setDefaultView(v);
    setStoredSetting('darija-settings-defaultView', v);
  };

  const updateAutoPlayFlip = (v: boolean) => {
    setAutoPlayFlip(v);
    setStoredSetting('darija-settings-autoPlayFlip', v);
  };

  // ─── Export / Import ────────────────────────────────────────────────────
  const handleExport = () => {
    try {
      const data = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        progress: {
          completedLessons: store.completedLessons,
          quizScores: store.quizScores,
          streak: store.streak,
          lastVisit: store.lastVisit,
          completionDates: store.completionDates,
          bookmarkedVocab: store.bookmarkedVocab,
          srsData: store.srsData,
          dailyChallenge: store.dailyChallenge,
        },
        settings: {
          fontSize,
          defaultView,
          autoPlayFlip,
          theme,
        },
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `darija-progress-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2500);
    } catch {
      // silently fail
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError('');

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const raw = ev.target?.result as string;
        const data = JSON.parse(raw);

        if (!data.progress) throw new Error('Invalid file: missing progress data');

        const p = data.progress;

        // Apply progress data
        if (Array.isArray(p.completedLessons)) {
          store.completedLessons.slice().forEach((id) => store.completeLesson(id));
          p.completedLessons.forEach((id: string) => {
            if (!store.completedLessons.includes(id)) {
              store.completeLesson(id);
            }
          });
        }
        if (p.quizScores && typeof p.quizScores === 'object') {
          Object.entries(p.quizScores).forEach(([lessonId, score]: [string, unknown]) => {
            store.setQuizScore(lessonId, score as number);
          });
        }

        // Apply settings if present
        if (data.settings) {
          if (data.settings.fontSize) updateFontSize(data.settings.fontSize as FontSize);
          if (data.settings.defaultView) updateDefaultView(data.settings.defaultView as DefaultView);
          if (typeof data.settings.autoPlayFlip === 'boolean') updateAutoPlayFlip(data.settings.autoPlayFlip);
        }

        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 3000);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'Fichier invalide');
        setTimeout(() => setImportError(''), 4000);
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-2xl space-y-6 pb-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => store.setCurrentView('home')}
          className="shrink-0 hover:bg-amber-100 dark:hover:bg-amber-950/50"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Paramètres
            </span>
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Personnalisez votre expérience d&apos;apprentissage
          </p>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 1. Appearance Section                                            */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <Card className="border-amber-200/60 dark:border-amber-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
                <Sun className="h-4 w-4 text-white" />
              </div>
              Apparence
            </CardTitle>
            <CardDescription>Thème et affichage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Theme toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {mounted && theme === 'dark' ? (
                  <Moon className="h-4 w-4 text-amber-500" />
                ) : (
                  <Sun className="h-4 w-4 text-orange-500" />
                )}
                <div>
                  <p className="text-sm font-medium">Thème</p>
                  <p className="text-xs text-muted-foreground">
                    {mounted ? (theme === 'dark' ? 'Mode sombre' : 'Mode clair') : '...'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full border p-0.5">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    mounted && theme !== 'dark'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                  Clair
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    mounted && theme === 'dark'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                  Sombre
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    mounted && theme === 'system'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  Auto
                </button>
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Font size */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Type className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Taille du texte</p>
                  <p className="text-xs text-muted-foreground">Ajuster la taille de la police</p>
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full border p-0.5">
                {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateFontSize(size)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      fontSize === size
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {size === 'small' ? 'Aa' : size === 'medium' ? 'Aa' : 'Aa'}
                    <span className="ml-1 hidden sm:inline">
                      {size === 'small' ? 'Petit' : size === 'medium' ? 'Moyen' : 'Grand'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font size preview */}
            <div className="rounded-lg border border-dashed p-3">
              <p className="text-xs text-muted-foreground mb-1">Aperçu :</p>
              <p className={`${fontSizeMap[fontSize]} text-foreground transition-all`}>
                &#x0645;&#x0631;&#x062D;&#x0628;&#x0627; &#x0628;&#x0644;&#x062F;&#x0627;&#x0631;&#x064A;&#x062C;&#x0629;
                &mdash; Bienvenue en darija
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 2. Learning Preferences                                          */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <Card className="border-orange-200/60 dark:border-orange-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-rose-500">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              Préférences d&apos;apprentissage
            </CardTitle>
            <CardDescription>Configurez votre parcours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Default lesson view */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <BookOpen className="h-4 w-4 text-orange-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">Onglet par défaut</p>
                  <p className="text-xs text-muted-foreground">Onglet affiché en premier dans les leçons</p>
                </div>
              </div>
              <Select value={defaultView} onValueChange={(v) => updateDefaultView(v as DefaultView)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vocabulary">
                    <span className="flex items-center gap-1.5">
                      <Languages className="h-3 w-3" /> Vocabulaire
                    </span>
                  </SelectItem>
                  <SelectItem value="phrases">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-3 w-3" /> Phrases
                    </span>
                  </SelectItem>
                  <SelectItem value="grammar">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="h-3 w-3" /> Grammaire
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="opacity-50" />

            {/* Auto-play flashcard flip */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Retour automatique des cartes</p>
                  <p className="text-xs text-muted-foreground">Retourner automatiquement après 3 secondes</p>
                </div>
              </div>
              <Switch
                checked={autoPlayFlip}
                onCheckedChange={updateAutoPlayFlip}
                className="data-[state=checked]:bg-amber-500"
              />
            </div>

            <Separator className="opacity-50" />

          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 3. Data Management                                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <Card className="border-rose-200/60 dark:border-rose-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-red-500">
                <Trash2 className="h-4 w-4 text-white" />
              </div>
              Gestion des données
            </CardTitle>
            <CardDescription>Exporter, importer ou réinitialiser</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Export */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Download className="h-4 w-4 text-emerald-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">Exporter la progression</p>
                  <p className="text-xs text-muted-foreground">Télécharger un fichier JSON de sauvegarde</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="shrink-0 border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
              >
                {exportSuccess ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span className="ml-1.5">{exportSuccess ? 'Exporté !' : 'Exporter'}</span>
              </Button>
            </div>

            <Separator className="opacity-50" />

            {/* Import */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Upload className="h-4 w-4 text-blue-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">Importer la progression</p>
                  <p className="text-xs text-muted-foreground">Restaurer depuis un fichier JSON</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/50"
              >
                {importSuccess ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span className="ml-1.5">{importSuccess ? 'Importé !' : 'Importer'}</span>
              </Button>
            </div>

            {importError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400"
              >
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                {importError}
              </motion.div>
            )}

            <Separator className="opacity-50" />

            {/* Clear bookmarks */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Bookmark className="h-4 w-4 text-rose-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">Supprimer les favoris</p>
                  <p className="text-xs text-muted-foreground">
                    {store.bookmarkedVocab.length} mot(s) enregistré(s)
                  </p>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={store.bookmarkedVocab.length === 0}
                    className="shrink-0 border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50 disabled:opacity-40"
                  >
                    <Trash className="h-4 w-4" />
                    <span className="ml-1.5">Vider</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer tous les favoris ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action supprimera les {store.bookmarkedVocab.length} mot(s) favori(s). 
                      Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        store.clearBookmarks();
                      }}
                      className="bg-rose-600 text-white hover:bg-rose-700"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <Separator className="opacity-50" />

            {/* Clear SRS data */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Brain className="h-4 w-4 text-purple-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">Réinitialiser SRS</p>
                  <p className="text-xs text-muted-foreground">
                    {Object.keys(store.srsData).length} carte(s) dans le système
                  </p>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={Object.keys(store.srsData).length === 0}
                    className="shrink-0 border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-950/50 disabled:opacity-40"
                  >
                    <Trash className="h-4 w-4" />
                    <span className="ml-1.5">Vider</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Réinitialiser le système SRS ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Toutes vos cartes de révision espacée ({Object.keys(store.srsData).length}) seront supprimées. 
                      Vous devrez reprendre les révisions depuis le début.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        store.clearSrsData();
                      }}
                      className="bg-purple-600 text-white hover:bg-purple-700"
                    >
                      Réinitialiser
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <Separator className="opacity-50" />

            {/* Reset all progress */}
            <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-800/50 dark:bg-red-950/20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400 truncate">
                    Réinitialiser toute la progression
                  </p>
                  <p className="text-xs text-red-500/80 dark:text-red-400/70">
                    Supprimer toute votre progression, scores et favoris
                  </p>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="ml-1.5">Réinitialiser</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600 dark:text-red-400">
                      ⚠️ Réinitialiser toute la progression ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <strong>Cette action est irréversible.</strong> Toutes vos données seront supprimées :
                      <ul className="mt-2 list-inside list-disc space-y-1 text-left">
                        <li>{store.completedLessons.length} leçon(s) complétée(s)</li>
                        <li>{Object.keys(store.quizScores).length} score(s) de quiz</li>
                        <li>{store.bookmarkedVocab.length} favori(s)</li>
                        <li>{Object.keys(store.srsData).length} carte(s) SRS</li>
                        <li>Série de {store.streak} jour(s)</li>
                      </ul>
                      <p className="mt-2 font-semibold">
                        Pensez à exporter vos données avant de continuer !
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        store.resetAllProgress();
                        setFontSize('medium');
                        setDefaultView('vocabulary');
                        setAutoPlayFlip(false);
                        
                        setStoredSetting('darija-settings-fontSize', 'medium');
                        setStoredSetting('darija-settings-defaultView', 'vocabulary');
                        setStoredSetting('darija-settings-autoPlayFlip', false);
                      }}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Oui, tout supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 4. About Section                                                  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <Card className="border-amber-200/60 dark:border-amber-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500">
                <Info className="h-4 w-4 text-white" />
              </div>
              À propos
            </CardTitle>
            <CardDescription>Informations sur l&apos;application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Version */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Version</p>
                  <p className="text-xs text-muted-foreground">DarijaAcademy v1.0.0</p>
                </div>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">
                v1.0.0
              </span>
            </div>

            <Separator className="opacity-50" />

            {/* Content stats */}
            <div>
              <p className="text-sm font-medium mb-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-orange-500" />
                Contenu de l&apos;application
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-amber-50 p-3 text-center dark:bg-amber-950/30">
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.totalLevels}</p>
                  <p className="text-xs text-muted-foreground">Niveaux</p>
                </div>
                <div className="rounded-lg bg-orange-50 p-3 text-center dark:bg-orange-950/30">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.totalLessons}</p>
                  <p className="text-xs text-muted-foreground">Leçons</p>
                </div>
                <div className="rounded-lg bg-rose-50 p-3 text-center dark:bg-rose-950/30">
                  <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.totalVocab}</p>
                  <p className="text-xs text-muted-foreground">Mots</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-3 text-center dark:bg-emerald-950/30">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.totalQuiz}</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Credits */}
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-500" />
                Crédits
              </p>
              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1.5">
                <p>
                  <span className="font-medium text-foreground">Contenu :</span> Créé avec soin en utilisant
                  des ressources de référence du darija marocain authentique.
                </p>
                <p>
                  <span className="font-medium text-foreground">Références :</span> DailyDarija, DarijaSchool,
                  Peace Corps Moroccan Arabic, SpeakMoroccan.
                </p>
                <p>
                  <span className="font-medium text-foreground">Technologie :</span> Next.js, TypeScript, Tailwind CSS, shadcn/ui
                </p>
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Links */}
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-amber-500" />
                Liens utiles
              </p>
              <div className="space-y-2">
                <a
                  href="https://www.dailydarija.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border p-2.5 text-sm transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-amber-100 dark:bg-amber-900/50">
                    <Globe className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="flex-1">DailyDarija</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </a>
                <a
                  href="https://www.darijaschool.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border p-2.5 text-sm transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-orange-100 dark:bg-orange-900/50">
                    <Globe className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="flex-1">DarijaSchool</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </a>
                <a
                  href="https://www.speakmoroccan.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border p-2.5 text-sm transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-rose-100 dark:bg-rose-900/50">
                    <Globe className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <span className="flex-1">SpeakMoroccan</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer attribution */}
      <motion.div variants={itemVariants} className="text-center pb-4">
        <p className="text-xs text-muted-foreground">
          Fait avec <Heart className="inline h-3 w-3 text-rose-500" /> pour les amoureux du darija marocain
        </p>
      </motion.div>
    </motion.div>
  );
}

// Globe icon for links (not in lucide standard set, use simple approach)
function Globe({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
