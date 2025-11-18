import React from 'react';

/**
 * PUBLIC_INTERFACE
 * LeaderboardCard shows a simple leaderboard row list with points and streaks.
 */
export default function LeaderboardCard({ title = 'Leaderboard', items = [] }) {
  /** This is a public function. */
  return (
    <div className="surface" style={{ padding: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
      {items.length === 0 ? (
        <div style={{ color: '#6B7280', fontSize: 14 }}>No leaderboard data</div>
      ) : (
        <div role="list" aria-label="Leaderboard" style={{ display: 'grid', gap: 8 }}>
          {items.map((u, idx) => (
            <div
              key={u.id || u.email || idx}
              role="listitem"
              style={{
                display: 'grid',
                gridTemplateColumns: '24px 1fr auto auto',
                gap: 8,
                alignItems: 'center',
                padding: '8px 10px',
                border: '1px solid var(--border)',
                borderRadius: 8,
              }}
            >
              <div style={{ color: '#4B5563' }}>{idx + 1}</div>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {u.name || u.email || 'Learner'}
              </div>
              <div title="Points" style={{ color: '#1E3A8A', fontWeight: 700 }}>
                {u.points ?? 0} pts
              </div>
              <div title="Streak" style={{ color: '#059669', fontWeight: 700 }}>
                🔥 {u.streak ?? 0}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
