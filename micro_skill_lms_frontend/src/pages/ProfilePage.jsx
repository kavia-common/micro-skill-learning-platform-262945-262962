import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import ProgressBar from '../components/common/ProgressBar';

/**
 * PUBLIC_INTERFACE
 * ProfilePage shows current user information and overall progress.
 */
export default function ProfilePage() {
  /** This is a public function. */
  const { user } = useAuth();
  const { summary } = useProgress();

  return (
    <div className="surface" style={{ padding: 20 }}>
      <h2 style={{ marginTop: 0 }}>Your Profile</h2>
      {!user ? (
        <div>No user loaded.</div>
      ) : (
        <>
          <div style={{ marginBottom: 10 }}><strong>Name:</strong> {user.name || 'Learner'}</div>
          <div style={{ marginBottom: 20 }}><strong>Email:</strong> {user.email || '-'}</div>
          <div style={{ maxWidth: 420 }}>
            <ProgressBar percent={summary?.percent ?? 0} label="Overall progress" />
            <div style={{ fontSize: 12, color: '#4B5563', marginTop: 6 }}>
              {summary.completed ?? 0} of {summary.total ?? 0} units completed
            </div>
          </div>
        </>
      )}
    </div>
  );
}
