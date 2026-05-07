'use client';

import { useProgressStore } from '@/store/progress-store';
import { Star, Home, BookOpen, Search, Globe } from 'lucide-react';

export function Footer() {
  const setCurrentView = useProgressStore((s) => s.setCurrentView);

  const navLinks = [
    { label: 'Accueil', view: 'home' as const, icon: Home },
    { label: 'Niveaux', view: 'home' as const, icon: BookOpen },
    { label: 'Recherche', view: 'search' as const, icon: Search },
    { label: 'Culture', view: 'culture' as const, icon: Globe },
  ];

  return (
    <footer className="footer-zellige-top footer-gradient-line mt-auto pt-6 pb-4">
      <div className="mx-auto max-w-4xl px-4">
        {/* Logo & nav */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Logo */}
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-sm">
              <Star className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Darija
              </span>
              <span className="text-foreground">Academy</span>
            </span>
          </button>

          {/* Navigation links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {navLinks.map((link) => (
              <button
                key={`${link.view}-${link.label}`}
                onClick={() => setCurrentView(link.view)}
                className="footer-link flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-amber-600 dark:hover:text-amber-400"
              >
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="mx-auto mt-4 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-amber-300/40 dark:via-amber-700/30 to-transparent" />

        {/* Copyright & love */}
        <div className="mt-3 text-center">
          <p className="text-[11px] text-muted-foreground">
            © 2025 DarijaAcademy — Apprendre le darija marocain
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground/70">
            Fait avec ❤️ pour les passionnés du darija
          </p>
        </div>
      </div>
    </footer>
  );
}
