'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useProgressStore } from '@/store/progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import {
  StickyNote,
  Eye,
  Edit3,
  Save,
  Clock,
  Type,
  FileText,
  Trash2,
} from 'lucide-react';

// ─── Markdown-like formatting helpers ───────────────────────────────────
function renderMarkdown(text: string): React.ReactNode[] {
  if (!text.trim()) return [<span key="empty" className="text-muted-foreground italic">Aucune note pour le moment. Commencez à écrire...</span>];

  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, lineIndex) => {
    if (line.trim() === '') {
      nodes.push(<div key={`br-${lineIndex}`} className="h-3" />);
      return;
    }

    // Bold: **text**
    // Italic: *text* (but not **)
    const parts = line.split(/(\*\*.*?\*\*|\*[^*]+\*)/g);

    const renderedParts = parts.map((part, partIndex) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`${lineIndex}-${partIndex}`} className="font-bold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
        return (
          <em key={`${lineIndex}-${partIndex}`} className="italic text-foreground/90">
            {part.slice(1, -1)}
          </em>
        );
      }
      // Bullet point
      if (part.trimStart().startsWith('- ')) {
        return (
          <span key={`${lineIndex}-${partIndex}`} className="flex gap-2">
            <span className="shrink-0 text-amber-500">•</span>
            <span>{part.trimStart().slice(2)}</span>
          </span>
        );
      }
      return <span key={`${lineIndex}-${partIndex}`}>{part}</span>;
    });

    if (line.trimStart().startsWith('- ')) {
      nodes.push(
        <div key={`li-${lineIndex}`} className="pl-2">
          {renderedParts}
        </div>
      );
    } else {
      nodes.push(
        <p key={`p-${lineIndex}`} className="leading-relaxed">
          {renderedParts}
        </p>
      );
    }
  });

  return nodes;
}

// ─── Component ──────────────────────────────────────────────────────────
interface LessonNotesProps {
  lessonId: string;
}

export function LessonNotes({ lessonId }: LessonNotesProps) {
  const { updateLessonNote } = useProgressStore();

  const [text, setText] = useState(() => {
    // Initialize from store on mount - key prop from parent resets this
    return useProgressStore.getState().lessonNotes[lessonId] ?? '';
  });
  const [isPreview, setIsPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Debounced save
  const saveNote = useCallback((value: string) => {
    updateLessonNote(lessonId, value);
    setLastSaved(new Date());
    setIsSaving(false);
  }, [lessonId, updateLessonNote]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
    setIsSaving(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveNote(value);
    }, 500);
  }, [saveNote]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Manual save (Ctrl+S)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (debounceRef.current) clearTimeout(debounceRef.current);
        saveNote(text);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [text, saveNote]);

  // Character count and stats
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text.trim() ? text.split('\n').length : 0;

  // Format timestamp
  const formattedTime = useMemo(() => {
    if (!lastSaved) return null;
    return lastSaved.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, [lastSaved]);

  // Clear notes
  const handleClear = useCallback(() => {
    setText('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    saveNote('');
  }, [saveNote]);

  // ─── Preview content ─────────────────────────────────────────────────
  const previewContent = useMemo(() => renderMarkdown(text), [text]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Preview toggle */}
        <Button
          variant={isPreview ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
          className={`gap-1.5 ${
            isPreview
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : 'border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30'
          }`}
        >
          {isPreview ? (
            <>
              <Edit3 className="h-3.5 w-3.5" />
              Éditer
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" />
              Aperçu
            </>
          )}
        </Button>

        {/* Save indicator */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {isSaving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Save className="h-3.5 w-3.5 text-amber-500" />
              </motion.div>
              <span>Enregistrement...</span>
            </>
          ) : lastSaved ? (
            <>
              <Save className="h-3.5 w-3.5 text-emerald-500" />
              <span>Sauvegardé à {formattedTime}</span>
            </>
          ) : (
            <>
              <Clock className="h-3.5 w-3.5" />
              <span>Non sauvegardé</span>
            </>
          )}
        </div>

        {/* Clear button */}
        {text.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="ml-auto gap-1.5 text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Effacer
          </Button>
        )}
      </div>

      {/* Textarea or Preview */}
      {isPreview ? (
        <Card className="min-h-[250px] border-amber-200/60 bg-amber-50/30 dark:border-amber-800/30 dark:bg-amber-950/10">
          <CardContent className="p-5">
            {text.trim() === '' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <StickyNote className="mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  Aucune note pour le moment.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Cliquez sur &quot;Éditer&quot; pour commencer à écrire.
                </p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert prose-p:text-foreground/80">
                {previewContent}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            placeholder="Écrivez vos notes personnelles ici...&#10;&#10;Astuce : utilisez **gras** pour le texte en gras et *italique* pour l'italique.&#10;Utilisez - en début de ligne pour les listes à puces.&#10;&#10;Vos notes sont sauvegardées automatiquement."
            className="min-h-[250px] w-full resize-y border-amber-200/60 bg-amber-50/30 font-mono text-sm leading-relaxed transition-colors focus-visible:ring-amber-500/50 dark:border-amber-800/30 dark:bg-amber-950/10 dark:text-foreground/90"
          />

          {/* Floating formatting help */}
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
            <Badge variant="secondary" className="gap-1 text-[10px] font-normal">
              <Type className="h-2.5 w-2.5" />
              **gras**
            </Badge>
            <Badge variant="secondary" className="gap-1 text-[10px] font-normal">
              <Type className="h-2.5 w-2.5" />
              *italique*
            </Badge>
            <Badge variant="secondary" className="gap-1 text-[10px] font-normal">
              <FileText className="h-2.5 w-2.5" />
              - liste
            </Badge>
            <Badge variant="secondary" className="gap-1 text-[10px] font-normal">
              <kbd className="rounded bg-muted px-1 py-0.5 font-mono">Ctrl+S</kbd>
              sauvegarder
            </Badge>
          </div>
        </div>
      )}

      {/* Stats bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Type className="h-3 w-3" />
            {charCount} caractère{charCount !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {wordCount} mot{wordCount !== 1 ? 's' : ''}
          </span>
          <span className="hidden items-center gap-1 sm:flex">
            <FileText className="h-3 w-3" />
            {lineCount} ligne{lineCount !== 1 ? 's' : ''}
          </span>
        </div>
        {text.length > 0 && (
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
            Sauvegarde automatique activée
          </span>
        )}
      </div>
    </motion.div>
  );
}
