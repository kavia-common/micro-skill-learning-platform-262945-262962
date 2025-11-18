import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext.jsx';

/**
 * PUBLIC_INTERFACE
 * LoginPage provides login form and optional quick register.
 */
export default function LoginPage() {
  /** This is a public function. */
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (mode === 'login') {
        await signIn({ email: form.email, password: form.password });
      } else {
        await signUp({ email: form.email, password: form.password });
        // Some projects require email verification; sign-in may not succeed immediately.
        // Best effort login:
        try { await signIn({ email: form.email, password: form.password }); } catch (_) {}
      }
      navigate('/');
    } catch (err) {
      setError('Authentication failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="centered">
      <form onSubmit={submit} className="surface" style={{ padding: 20, width: 360 }}>
        <h3 style={{ marginTop: 0 }}>{mode === 'login' ? 'Login' : 'Register'}</h3>
        {error && <div style={{ color: '#DC2626', marginBottom: 8 }}>{error}</div>}
        {mode === 'register' && (
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 12, color: '#4B5563' }}>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              placeholder="Your name"
              style={inputStyle}
            />
          </div>
        )}
        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 12, color: '#4B5563' }}>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
            placeholder="you@example.com"
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: '#4B5563' }}>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
            placeholder="••••••••"
            style={inputStyle}
          />
        </div>
        <button className="btn" disabled={busy} type="submit" aria-label={mode === 'login' ? 'Login' : 'Create Account'}>
          {busy ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create Account')}
        </button>
        <div style={{ marginTop: 10, fontSize: 14 }}>
          {mode === 'login' ? (
            <>No account? <button type="button" className="btn secondary" onClick={() => setMode('register')}>Register</button></>
          ) : (
            <>Have an account? <button type="button" className="btn secondary" onClick={() => setMode('login')}>Login</button></>
          )}
        </div>
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
  marginTop: 6
};
