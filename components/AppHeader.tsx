'use client';

import { useEffect, useState } from 'react';
import i18n from '@/lib/i18n';

const options = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिं' },
  { code: 'te', label: 'తె' },
] as const;

export function AppHeader() {
  const [lang, setLang] = useState<'en' | 'hi' | 'te'>('en');

  useEffect(() => {
    const local = (localStorage.getItem('agrisync_lang') as 'en' | 'hi' | 'te') || 'en';
    setLang(local);
    i18n.changeLanguage(local);
  }, []);

  return (
    <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <p className="font-bold text-primary">AgriSync</p>
        <div className="flex gap-2">
          {options.map((opt) => (
            <button
              key={opt.code}
              className={`rounded-lg px-2 py-1 text-sm ${lang === opt.code ? 'bg-primary text-white' : 'bg-slate-100'}`}
              onClick={() => {
                setLang(opt.code);
                i18n.changeLanguage(opt.code);
                localStorage.setItem('agrisync_lang', opt.code);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
