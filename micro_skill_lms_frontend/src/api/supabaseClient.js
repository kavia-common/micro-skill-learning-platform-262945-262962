import { createClient } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * getSupabaseClient
 * Returns a singleton Supabase client initialized from env vars.
 *
 * Requires:
 * - REACT_APP_SUPABASE_URL
 * - REACT_APP_SUPABASE_KEY (anon public key)
 */
let supabase = null;

export function getSupabaseClient() {
  if (!supabase) {
    const url = process.env.REACT_APP_SUPABASE_URL;
    const key = process.env.REACT_APP_SUPABASE_KEY;
    if (!url || !key) {
      // Do not throw in production UI; developers must set envs
      // eslint-disable-next-line no-console
      console.warn('Supabase env not configured: REACT_APP_SUPABASE_URL/REACT_APP_SUPABASE_KEY');
    }
    supabase = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabase;
}

export default getSupabaseClient();
