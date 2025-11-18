import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';
import { useProgress } from '../context/ProgressContext';
import ProgressBar from '../components/common/ProgressBar';

/**
 * PUBLIC_INTERFACE
 * ModulePage displays a single module and its progress.
 */
export default function ModulePage() {
  /** This is a public function. */
  const { moduleId } = useParams();
  const [module, setModule] = useState(null);
  const { moduleProgress, refreshModule } = useProgress();

  useEffect(() => {
    let mounted = true;
    client.get(`/api/modules/${moduleId}`)
      .then(res => { if (mounted) setModule(res.data); })
      .catch(() => { /* ignore */ });
    refreshModule(moduleId);
    return () => { mounted = false; };
  }, [moduleId, refreshModule]);

  const prog = moduleProgress[moduleId]?.percent ?? 0;

  return (
    <div className="surface" style={{ padding: 20 }}>
      {!module ? (
        <div className="loading">Loading module...</div>
      ) : (
        <>
          <h2 style={{ marginTop: 0 }}>{module.title || module.name || 'Module'}</h2>
          <p style={{ color: '#4B5563' }}>{module.description || 'Module details'}</p>
          <div style={{ maxWidth: 420 }}>
            <ProgressBar percent={prog} label="Module progress" />
          </div>
        </>
      )}
    </div>
  );
}
