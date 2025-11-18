import React from 'react';
import ProgressBar from '../common/ProgressBar';

/**
 * PUBLIC_INTERFACE
 * SummaryPanel shows contextual info about the selected video and progress.
 */
export default function SummaryPanel({ selected, percent = 0, onOpenQuiz }) {
  /** This is a public function. */
  return (
    <aside className="surface summary-panel" aria-label="Summary">
      <h3 style={{ marginTop: 0 }}>{selected?.title || 'Summary'}</h3>
      <p style={{ color: '#4B5563', lineHeight: 1.5 }}>
        {selected?.description || 'Watch the lesson and then try the quick quiz to reinforce learning.'}
      </p>
      <div style={{ margin: '16px 0' }}>
        <ProgressBar percent={percent} label="Module progress" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn" onClick={onOpenQuiz} aria-label="Open Quiz">Take Quiz</button>
      </div>
    </aside>
  );
}
