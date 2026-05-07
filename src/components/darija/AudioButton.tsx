'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { cn } from '@/lib/utils';

interface AudioButtonProps {
  text: string;
  lang?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
};

const iconSizes = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export function AudioButton({ text, lang, size = 'sm', className }: AudioButtonProps) {
  const { speak, stop, isSpeaking, isSupported } = useTextToSpeech();

  if (!isSupported) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isSpeaking) {
      stop();
    } else {
      speak(text, lang);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-all duration-200',
        'bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700',
        'dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-950/60 dark:hover:text-amber-300',
        'active:scale-90',
        isSpeaking && 'bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 animate-pulse-soft',
        sizeClasses[size],
        className
      )}
      aria-label={isSpeaking ? 'Arrêter la lecture' : 'Écouter la prononciation'}
      title={isSpeaking ? 'Arrêter' : 'Écouter'}
    >
      {isSpeaking ? (
        <VolumeX className={iconSizes[size]} />
      ) : (
        <Volume2 className={iconSizes[size]} />
      )}
    </button>
  );
}
