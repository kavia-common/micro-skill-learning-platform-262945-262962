import React from 'react';
import VideoCard from './VideoCard';

/**
 * PUBLIC_INTERFACE
 * VerticalFeed renders a vertical stack of videos.
 */
export default function VerticalFeed({ items = [], onVideoEnd }) {
  /** This is a public function. */
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {items.map(v => (
        <VideoCard
          key={v.id || v._id || v.videoId || v.url}
          src={v.url || v.src}
          title={v.title || 'Untitled'}
          onEnded={() => onVideoEnd?.(v)}
        />
      ))}
    </div>
  );
}
