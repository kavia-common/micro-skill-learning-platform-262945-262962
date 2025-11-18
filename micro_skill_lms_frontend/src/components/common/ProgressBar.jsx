import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ProgressBar shows a linear progress bar with given percent.
 */
export default function ProgressBar({ percent = 0, label }) {
  /** This is a public function. */
  const pct = Math.min(100, Math.max(0, percent));
  return (
    <div>
      {label && <div style={{ marginBottom: 6, fontSize: 13, color: '#4B5563' }}>{label}</div>}
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <div className="bar" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
