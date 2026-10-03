import React from 'react';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher({ className }) {
  const { lang, setLang } = useI18n();
  return (
    <div className={cn('flex items-center text-xs font-medium tracking-wide', className)}>
      <button
        onClick={() => setLang('cz')}
        className={cn(
          'transition-colors',
          lang === 'cz' ? 'text-primary font-semibold' : 'text-foreground/50 hover:text-primary'
        )}
        aria-label="Čeština"
      >
        CZ
      </button>
      <span className="mx-1 text-border">|</span>
      <button
        onClick={() => setLang('en')}
        className={cn(
          'transition-colors',
          lang === 'en' ? 'text-primary font-semibold' : 'text-foreground/50 hover:text-primary'
        )}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}