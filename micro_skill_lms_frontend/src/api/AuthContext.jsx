import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { setTokenGetter } from './client';
import supabaseClient, { getSupabaseClient } from './supabaseClient';

/**
 * PUBLIC_INTERFACE
 * AuthContext using Supabase for authentication.
 * - Initializes Supabase client and subscribes to onAuthStateChange
 * - Persists session automatically via supabase-js
 * - Wires axios token getter to use session.access_token
 * - Provides signIn, signUp, signOut functions
 * - Migration: still supports setting legacy token via loginSuccess for older flows
 */
const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** This is a public function component that provides authentication state and token wiring. */
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  // On mount, fetch current session and wire token getter
  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      const sess = data?.session || null;
      setSession(sess);
      setUser(sess?.user ? { id: sess.user.id, email: sess.user.email } : null);
      setTokenGetter(() => (sess ? sess.access_token : null));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ? { id: sess.user.id, email: sess.user.email } : null);
      setTokenGetter(() => (sess ? sess.access_token : null));
    });

    return () => {
      isMounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  // For migration: allow legacy loginSuccess to manually inject token/user (used nowhere once Supabase is wired)
  const loginSuccess = useCallback(({ user: u, token: t }) => {
    if (t) {
      setTokenGetter(() => t);
    }
    if (u) {
      setUser(u);
    }
  }, []);

  // Supabase actions
  // PUBLIC_INTERFACE
  const signIn = useCallback(async ({ email, password }) => {
    /** Sign in via Supabase with email/password and update session. */
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // session listener will update token getter
    return data;
  }, []);

  // PUBLIC_INTERFACE
  const signUp = useCallback(async ({ email, password }) => {
    /** Sign up via Supabase with email/password. */
    const siteUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: siteUrl,
      },
    });
    if (error) throw error;
    return data;
  }, []);

  // PUBLIC_INTERFACE
  const signOut = useCallback(async () => {
    /** Sign out via Supabase and clear axios token. */
    await supabaseClient.auth.signOut();
    setTokenGetter(() => null);
    setUser(null);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      token: session?.access_token || null,
      user,
      signIn,
      signUp,
      signOut,
      // migration helpers
      loginSuccess,
    }),
    [session, user, signIn, signUp, signOut, loginSuccess]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** This is a public function to access auth state and helpers. */
  return useContext(AuthContext);
}
