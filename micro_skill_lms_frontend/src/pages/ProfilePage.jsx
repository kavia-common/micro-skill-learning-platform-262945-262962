import React, { useEffect, useState } from 'react';
import { useAuth } from '../api/AuthContext.jsx';
import { useProgress } from '../context/ProgressContext';
import ProgressBar from '../components/common/ProgressBar';
import ProfileCard from '../components/common/ProfileCard';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

/**
 * PUBLIC_INTERFACE
 * ProfilePage shows current user information and overall progress.
 */
export default function ProfilePage() {
  /** This is a public function. */
  const { user, signOut } = useAuth();
  const { summary } = useProgress();
  const [saved, setSaved] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // try fetch saved lessons if available
    (async () => {
      try {
        const res = await client.get('/api/saved'); // optional endpoint
        setSaved(res?.data?.items || res?.data || []);
      } catch {
        setSaved([]);
      }
    })();
  }, []);

  return (
    <div className="surface" style={{ padding: 20 }}>
      <h2 style={{ marginTop: 0 }}>Your Profile</h2>
      {!user ? (
        <div>No user loaded.</div>
      ) : (
        <>
          <ProfileCard
            user={user}
            savedLessons={saved}
            onOpenLesson={(l) => navigate(`/lesson/${l.id || l._id || l.videoId}`)}
            onLogout={signOut}
          />
          <div className="surface" style={{ padding: 16, marginTop: 16, maxWidth: 480 }}>
            <ProgressBar percent={summary?.percent ?? 0} label="Overall progress" />
            <div style={{ fontSize: 12, color: '#4B5563', marginTop: 6 }}>
              {summary.completed ?? 0} of {summary.total ?? 0} units completed
            </div>
            <div style={{ marginTop: 10 }}>
              <button className="btn secondary" onClick={() => navigate('/progress')} aria-label="Open Progress Page">
                View Progress
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
