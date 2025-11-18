import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext.jsx';

/**
 * PUBLIC_INTERFACE
 * SignupPage provides a registration form using Supabase.
 */
export default function SignupPage() {
  /** This is a public function. */
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setInfo('');
    try {
      await signUp({ email: form.email, password: form.password });
      // Try auto sign-in; may fail if email confirmation required
      try {
        await signIn({ email: form.email, password: form.password });
        navigate('/');
      } catch {
        setInfo('Check your email to confirm your account, then log in.');
      }
    } catch {
      setError('Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="centered">
      <form onSubmit={submit} className="surface" style={{ padding: 20, width: 360 }}>
        <h3 style={{ marginTop: 0 }}>Create Account</h3>
        {error ? <div style={{ color: 'var(--color-error)' }}>{error}</div> : null}
        {info ? <div style={{ color: 'var(--color-success)' }}>{info}</div> : null}
        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 12, color: '#4B5563' }}>Email</label>
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: '#4B5563' }}>Password</label>
          <input
            name="password"
            type="password"
            required
            value={form.password}
            onChange={onChange}
            placeholder="••••••••"
            style={inputStyle}
          />
        </div>
        <button className="btn" disabled={busy} type="submit" aria-label="Create Account">
          {busy ? 'Please wait...' : 'Create Account'}
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
