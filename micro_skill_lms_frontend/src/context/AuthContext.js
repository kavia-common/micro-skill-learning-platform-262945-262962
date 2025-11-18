import React, { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client';

/**
 * PUBLIC_INTERFACE
 * useAuth provides access to authentication state and actions.
 */
const AuthContext = createContext(null);

export function useAuth() {
  /** This is a public function. */
  return useContext(AuthContext);
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider wraps children with authentication logic (login, logout, me).
 */
export function AuthProvider({ children }) {
  /** This is a public function. */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current user if token exists
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }
    client.get('/api/auth/me')
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('auth_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await client.post('/api/auth/login', { email, password });
    if (res?.data?.token) {
      localStorage.setItem('auth_token', res.data.token);
      // fetch current user
      const me = await client.get('/api/auth/me');
      setUser(me.data);
    }
    return res?.data;
  };

  const register = async (name, email, password) => {
    const res = await client.post('/api/auth/register', { name, email, password });
    return res?.data;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const value = { user, loading, login, logout, register };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
