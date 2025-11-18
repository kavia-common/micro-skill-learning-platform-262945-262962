import React, { useState } from 'react';
import VideoCard from './VideoCard';

/**
 * PUBLIC_INTERFACE
 * VerticalFeed renders a vertical stack of videos.
 */
export default function VerticalFeed({ items = [], onVideoEnd, onVideoPlay }) {
  /** This is a public function. */
  const [muted, setMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="btn secondary" onClick={() => setMuted(m => !m)} aria-label={muted ? 'Unmute videos' : 'Mute videos'}>
          {muted ? 'Unmute' : 'Mute'}
        </button>
        <button className="btn secondary" onClick={() => setShowControls(s => !s)} aria-label={showControls ? 'Hide native controls' : 'Show native controls'}>
          {showControls ? 'Hide Controls' : 'Show Controls'}
        </button>
      </div>
      {items.map(v => (
        <VideoCard
          key={v.id || v._id || v.videoId || v.url}
          src={v.url || v.src}
          title={v.title || 'Untitled'}
          onPlay={() => onVideoPlay?.(v)}
          onEnded={() => onVideoEnd?.(v)}
          muted={muted}
          controls={showControls}
        />
      ))}
    </div>
  );
}
