import React, { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client';

/**
 * PUBLIC_INTERFACE
 * useProgress exposes progress state for UI components.
 */
const ProgressContext = createContext(null);

export function useProgress() {
  /** This is a public function. */
  return useContext(ProgressContext);
}

/**
 * PUBLIC_INTERFACE
 * ProgressProvider manages fetching and posting progress tracking events.
 */
export function ProgressProvider({ children }) {
  /** This is a public function. */
  const [summary, setSummary] = useState({ completed: 0, total: 0, percent: 0 });
  const [moduleProgress, setModuleProgress] = useState({}); // moduleId -> {completed,total,percent}

  const refreshOverall = async () => {
    try {
      const res = await client.get('/api/progress');
      if (res?.data) {
        setSummary({
          completed: res.data.completed ?? 0,
          total: res.data.total ?? 0,
          percent: res.data.percent ?? 0
        });
      }
    } catch {
      // ignore for now
    }
  };

  const refreshModule = async (moduleId) => {
    try {
      const res = await client.get(`/api/progress/module/${moduleId}`);
      if (res?.data) {
        setModuleProgress(prev => ({
          ...prev,
          [moduleId]: {
            completed: res.data.completed ?? 0,
            total: res.data.total ?? 0,
            percent: res.data.percent ?? 0
          }
        }));
      }
    } catch {
      // ignore
    }
  };

  const track = async (payload) => {
    try {
      await client.post('/api/progress/track', payload);
      // optimistically refresh
      await refreshOverall();
      if (payload?.moduleId) await refreshModule(payload.moduleId);
    } catch {
      // ignore errors in optimistic update
    }
  };

  useEffect(() => {
    refreshOverall();
  }, []);

  const value = { summary, moduleProgress, refreshOverall, refreshModule, track };
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
