import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ProfileCard displays basic user info and a list of saved lessons with optional actions.
 */
export default function ProfileCard({ user, savedLessons = [], onOpenLesson, onLogout }) {
  /** This is a public function. */
  return (
    <div className="surface" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          aria-hidden
          style={{
            width: 48,
            height: 48,
            borderRadius: '999px',
            background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            fontWeight: 800,
          }}
        >
          {user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <div style={{ fontWeight: 700 }}>{user?.name || 'Learner'}</div>
          <div style={{ color: '#4B5563', fontSize: 13 }}>{user?.email || ''}</div>
        </div>
        {onLogout && (
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn" onClick={onLogout} aria-label="Logout">
              Logout
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Saved lessons</div>
        {savedLessons.length === 0 ? (
          <div style={{ color: '#6B7280', fontSize: 14 }}>No saved lessons yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {savedLessons.map((l, idx) => (
              <button
                key={l.id || idx}
                className="btn secondary"
                onClick={() => onOpenLesson?.(l)}
                aria-label={`Open lesson ${l.title || l.id}`}
                type="button"
              >
                {l.title || `Lesson ${idx + 1}`}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
