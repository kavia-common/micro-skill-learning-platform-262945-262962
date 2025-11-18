import React from 'react';

/**
 * PUBLIC_INTERFACE
 * TagList renders a horizontal list of clickable tags (non-controlled).
 */
export default function TagList({ tags = [], onTagClick, ariaLabel = 'Tags' }) {
  /** This is a public function. */
  if (!tags || tags.length === 0) return null;
  return (
    <div role="list" aria-label={ariaLabel} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {tags.map((t, i) => {
        const label = typeof t === 'string' ? t : (t.label || t.name || `Tag ${i + 1}`);
        return (
          <button
            key={`${label}-${i}`}
            className="btn secondary"
            style={{ padding: '6px 10px' }}
            onClick={() => onTagClick?.(t)}
            aria-label={`Tag ${label}`}
            type="button"
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
