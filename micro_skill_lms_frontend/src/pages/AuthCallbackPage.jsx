import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getSupabaseClient } from '../api/supabaseClient';
import { useAuth } from '../api/AuthContext.jsx';

/**
 * PUBLIC_INTERFACE
 * AuthCallbackPage finalizes Supabase auth after redirect.
 *
 * Behavior:
 * - Detects Supabase redirect parameters (hash fragments or query params)
 * - Uses supabase-js to establish a session (setSession or exchangeCodeForSession)
 * - Relies on AuthContext's onAuthStateChange to wire the Axios Authorization header
 * - Shows a short "Signing you in..." loading state
 * - Redirects to "/" on success
 * - On failure, shows a friendly error and a link back to "/login"
 */
export default function AuthCallbackPage() {
  /** This is a public function component. */
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function finalizeAuth() {
      setBusy(true);
      setError('');

      try {
        const supabase = getSupabaseClient();

        // Strategy:
        // 1) If the URL contains a 'code' param (PKCE/Magic Link), use exchangeCodeForSession.
        // 2) Else if hash has access_token/refresh_token, use setSession.
        // 3) Else rely on detectSessionInUrl (already true in client) and simply fetch session.

        const url = new URL(window.location.href);
        const hash = url.hash || '';
        const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
        const qpCode = searchParams.get('code');

        if (qpCode) {
          // PKCE / Magic Link flow: exchange the code for a session
          const { error: exErr } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if (exErr) throw exErr;
        } else if (hashParams.get('access_token') && hashParams.get('refresh_token')) {
          const access_token = hashParams.get('access_token');
          const refresh_token = hashParams.get('refresh_token');
          const { error: setErr } = await supabase.auth.setSession({ access_token, refresh_token });
          if (setErr) throw setErr;
        } else {
          // Fallback: Supabase will try detectSessionInUrl true, so just ensure we have a session
          const { data, error: sessErr } = await supabase.auth.getSession();
          if (sessErr) throw sessErr;
          if (!data?.session) {
            throw new Error('No session found in redirect response');
          }
        }

        // At this point, onAuthStateChange in AuthContext will update axios token getter.
        if (cancelled) return;

        // Clear hash/query parameters from URL to keep it clean
        window.history.replaceState({}, document.title, window.location.pathname);

        // Navigate to home/feed
        navigate('/', { replace: true });
      } catch (e) {
        if (cancelled) return;
        // Keep error user-friendly; do not leak token or sensitive info
        setError('We could not complete sign-in. Please try again.');
      } finally {
        if (!cancelled) setBusy(false);
      }
    }

    // If user is already present (e.g., back button), skip processing
    if (user) {
      navigate('/', { replace: true });
      return () => { /* no-op */ };
    }

    finalizeAuth();
    return () => { cancelled = true; };
  }, [navigate, searchParams, user]);

  if (busy) {
    return (
      <div className="centered" role="status" aria-live="polite">
        <div className="surface" style={{ padding: 20, width: 360, textAlign: 'center' }}>
          <h3 style={{ marginTop: 0 }}>Signing you in…</h3>
          <div className="loading" aria-label="Please wait">Please wait while we complete your sign-in.</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="centered" role="alert" aria-live="assertive">
        <div className="surface" style={{ padding: 20, width: 420 }}>
          <h3 style={{ marginTop: 0, color: 'var(--color-error)' }}>Sign-in problem</h3>
          <p style={{ color: '#4B5563' }}>{error}</p>
          <a className="btn" href="/login" aria-label="Back to Login">
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  // Non-busy, no error usually means we already navigated; render minimal placeholder
  return null;
}
