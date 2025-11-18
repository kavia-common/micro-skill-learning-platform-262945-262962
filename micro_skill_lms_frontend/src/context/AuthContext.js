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

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    /** Login with backend, store token, and load current user. */
    const res = await client.post('/api/auth/login', { email, password });
    const token = res?.data?.token;
    const userFromLogin = res?.data?.user;
    if (token) {
      localStorage.setItem('auth_token', token);
      if (userFromLogin) {
        setUser(userFromLogin);
      } else {
        // fetch current user
        const me = await client.get('/api/auth/me');
        setUser(me.data);
      }
    }
    return res?.data;
  };

  // PUBLIC_INTERFACE
  const register = async (name, email, password) => {
    /** Register a new user. */
    const res = await client.post('/api/auth/register', { name, email, password });
    return res?.data;
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    /** Clear token and reset user. */
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const value = { user, loading, login, logout, register };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
