import { Profile, UserRole } from './types';

export interface SessionData {
  email: string;
  role: UserRole;
  language: 'en' | 'hi' | 'te';
}

const KEYS = {
  session: 'agrisync_session',
  profile: 'agrisync_profile',
  cache: 'agrisync_dashboard_cache',
};

export const storage = {
  setSession: (payload: SessionData) => {
    localStorage.setItem(KEYS.session, JSON.stringify(payload));
  },
  getSession: (): SessionData | null => {
    const raw = localStorage.getItem(KEYS.session);
    return raw ? (JSON.parse(raw) as SessionData) : null;
  },
  clearSession: () => localStorage.removeItem(KEYS.session),
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
