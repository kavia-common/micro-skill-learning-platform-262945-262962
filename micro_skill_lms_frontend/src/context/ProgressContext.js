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
        const completed = res.data.completed ?? 0;
        const total = res.data.total ?? 0;
        const percent = res.data.percent ?? (total > 0 ? Math.round((completed / total) * 100) : 0);
        setSummary({ completed, total, percent });
      }
    } catch {
      // ignore for now
    }
  };

  const refreshModule = async (moduleId) => {
    try {
      const res = await client.get(`/api/progress/module/${moduleId}`);
      if (res?.data) {
        const completed = res.data.completed ?? 0;
        const total = res.data.total ?? 0;
        const percent = res.data.percent ?? (total > 0 ? Math.round((completed / total) * 100) : 0);
        setModuleProgress(prev => ({
          ...prev,
          [moduleId]: { completed, total, percent }
        }));
      }
    } catch {
      // ignore
    }
  };

  /**
   * PUBLIC_INTERFACE
   * track
   * Posts a tracking event to backend.
   * Expected payload: { moduleId, videoId, completed: boolean }
   */
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
