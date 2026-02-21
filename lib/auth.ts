import { storage } from './localStore';
import { isSupabaseConfigured, supabase } from './supabase';
import { UserRole } from './types';

export async function signUpOrLogin(email: string, password: string, role: UserRole, language: 'en' | 'hi' | 'te') {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const signUp = await supabase.auth.signUp({ email, password });
      if (signUp.error) throw signUp.error;
      storage.setSession({ email, role, language });
      return signUp.data;
    }
    storage.setSession({ email, role, language });
    return data;
  }

  storage.setSession({ email, role, language });
  return { user: { email } };
}
