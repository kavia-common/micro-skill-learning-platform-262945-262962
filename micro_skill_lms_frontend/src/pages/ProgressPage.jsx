import React, { useEffect, useState } from 'react';
import client from '../api/client';
import ProgressBar from '../components/common/ProgressBar';
import LeaderboardCard from '../components/common/LeaderboardCard';
import { useProgress } from '../context/ProgressContext';

/**
 * PUBLIC_INTERFACE
 * ProgressPage shows overall progress, points, streaks, and a simple leaderboard.
 */
export default function ProgressPage() {
  /** This is a public function. */
  const { summary, refreshOverall } = useProgress();
  const [stats, setStats] = useState({ points: 0, streak: 0 });
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    refreshOverall();
    // attempt to fetch user stats and leaderboard if available
    (async () => {
      try {
        const s = await client.get('/api/progress'); // may include points/streak fields
        const points = s?.data?.points ?? 0;
        const streak = s?.data?.streak ?? 0;
        setStats({ points, streak });
      } catch {
        // ignore
      }
      try {
        const lb = await client.get('/api/leaderboard'); // optional endpoint; fallback to empty
        setLeaderboard(lb?.data?.items || lb?.data || []);
      } catch {
        setLeaderboard([]);
      }
    })();
  }, [refreshOverall]);

  return (
    <div className="surface" style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Your Progress</h2>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '2fr 1fr' }}>
        <div className="surface" style={{ padding: 16 }}>
          <ProgressBar percent={summary?.percent ?? 0} label="Overall progress" />
          <div style={{ fontSize: 13, color: '#4B5563', marginTop: 6 }}>
            {summary?.completed ?? 0} of {summary?.total ?? 0} units completed
          </div>
          <div
            style={{
              marginTop: 16,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}
          >
            <StatCard label="Points" value={stats.points} accent="#1E3A8A" />
            <StatCard label="Streak" value={stats.streak} accent="#059669" suffix="🔥" />
          </div>
        </div>
        <LeaderboardCard title="Community Leaderboard" items={leaderboard} />
      </div>
    </div>
  );
}

function StatCard({ label, value, accent = '#1E3A8A', suffix = '' }) {
  return (
    <div className="surface" style={{ padding: 16, borderColor: 'var(--border)' }}>
      <div style={{ fontSize: 12, color: '#4B5563' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent }}>
        {value} {suffix}
      </div>
    </div>
  );
}
