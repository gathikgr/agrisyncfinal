import { Profile } from './types';
import { isSupabaseConfigured, supabase } from './supabase';

export async function saveProfileRecord(email: string, profile: Profile) {
  if (!isSupabaseConfigured || !supabase) return;

  await supabase.from('profiles').upsert({
    email,
    role: profile.role,
    language: profile.language,
    payload: profile,
  }, { onConflict: 'email' });
}

export async function saveCommitmentRecord(payload: {
  buyer_email: string;
  crop: string;
  quantity_kg: number;
  harvest_window?: string;
}) {
  if (!isSupabaseConfigured || !supabase) return;

  await supabase.from('commitments').insert(payload);
}
