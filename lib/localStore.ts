import { Profile } from './types';

const KEYS = {
  session: 'agrisync_session',
  profile: 'agrisync_profile',
  cache: 'agrisync_dashboard_cache',
};

export const storage = {
  setSession: (payload: { email: string; role: 'farmer' | 'buyer'; language: 'en' | 'hi' | 'te' }) => {
    localStorage.setItem(KEYS.session, JSON.stringify(payload));
  },
  getSession: () => {
    const raw = localStorage.getItem(KEYS.session);
    return raw ? JSON.parse(raw) : null;
  },
  setProfile: (profile: Profile) => localStorage.setItem(KEYS.profile, JSON.stringify(profile)),
  getProfile: (): Profile | null => {
    const raw = localStorage.getItem(KEYS.profile);
    return raw ? (JSON.parse(raw) as Profile) : null;
  },
  setCache: (data: unknown) => localStorage.setItem(KEYS.cache, JSON.stringify(data)),
  getCache: <T,>() => {
    const raw = localStorage.getItem(KEYS.cache);
    return raw ? (JSON.parse(raw) as T) : null;
  },
};
