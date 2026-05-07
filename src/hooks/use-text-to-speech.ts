'use client';

import { useState, useCallback, useRef } from 'react';

interface UseTTSOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
}

export function useTextToSpeech(options: UseTTSOptions = {}) {
  const { rate = 0.8, pitch = 1, lang = 'ar-MA' } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check support
  if (typeof window !== 'undefined' && !window.speechSynthesis) {
    setIsSupported(false);
  }

  const speak = useCallback(
    (text: string, overrideLang?: string) => {
      if (!window.speechSynthesis) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = overrideLang || lang;
      utterance.rate = rate;
      utterance.pitch = pitch;

      // Try to find an Arabic voice
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(
        (v) => v.lang.startsWith('ar') && (v.lang === 'ar-MA' || v.lang === 'ar')
      ) || voices.find(
        (v) => v.lang.startsWith('ar')
      ) || voices.find(
        (v) => v.lang.startsWith('fr')
      );

      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [rate, pitch, lang]
  );

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking, isSupported };
}
