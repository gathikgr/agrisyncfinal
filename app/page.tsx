'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LanguageCards } from '@/components/LanguageCards';
import i18n from '@/lib/i18n';

const words = ['AgriSync', 'अग्रिसिंक', 'అగ్రిసింక్'];

export default function LandingPage() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => setIndex((old) => (old + 1) % words.length), 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6">
      <h1 className="mb-2 text-5xl font-bold text-primary transition-all">{words[index]}</h1>
      <p className="mb-10 text-slate-600">Predictive insights + pre-harvest coordination.</p>
      <LanguageCards
        onSelect={(lang) => {
          i18n.changeLanguage(lang);
          localStorage.setItem('agrisync_lang', lang);
          router.push('/auth');
        }}
      />
    </main>
  );
}
