'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpOrLogin } from '@/lib/auth';
import i18n from '@/lib/i18n';
import { useTranslation } from 'react-i18next';

export default function AuthPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'farmer' | 'buyer'>('farmer');

  async function submit(e: FormEvent) {
    e.preventDefault();
    const language = (localStorage.getItem('agrisync_lang') as 'en' | 'hi' | 'te') || 'en';
    i18n.changeLanguage(language);
    await signUpOrLogin(email, password, role, language);
    router.push('/profile-setup');
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <form className="card space-y-4" onSubmit={submit}>
        <h2 className="text-2xl font-bold">{t('authTitle')}</h2>
        <input className="w-full rounded-xl border p-3" placeholder={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded-xl border p-3" type="password" placeholder={t('password')} value={password} onChange={(e) => setPassword(e.target.value)} required />
        <select className="w-full rounded-xl border p-3" value={role} onChange={(e) => setRole(e.target.value as 'farmer' | 'buyer')}>
          <option value="farmer">{t('farmer')}</option>
          <option value="buyer">{t('buyer')}</option>
        </select>
        <button className="w-full rounded-xl bg-primary p-3 font-semibold text-white">{t('continue')}</button>
      </form>
    </main>
  );
}
