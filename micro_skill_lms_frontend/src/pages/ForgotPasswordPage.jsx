import React, { useState } from 'react';
import supabase from '../api/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * ForgotPasswordPage allows users to request a password reset email via Supabase.
 */
export default function ForgotPasswordPage() {
  /** This is a public function. */
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    setErr('');
    try {
      const siteUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: siteUrl });
      if (error) throw error;
      setMsg('If the email exists, a reset link has been sent.');
    } catch {
      setErr('Failed to request password reset');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="centered">
      <form onSubmit={submit} className="surface" style={{ padding: 20, width: 360 }}>
        <h3 style={{ marginTop: 0 }}>Forgot Password</h3>
        {msg && <div style={{ color: 'var(--color-success)' }}>{msg}</div>}
        {err && <div style={{ color: 'var(--color-error)' }}>{err}</div>}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: '#4B5563' }}>Email</label>
          <input
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
          />
        </div>
        <button className="btn" disabled={busy} type="submit" aria-label="Send Reset Email">
          {busy ? 'Please wait...' : 'Send Reset Email'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #E5E7EB',
  outline: 'none',
  marginTop: 6,
};
