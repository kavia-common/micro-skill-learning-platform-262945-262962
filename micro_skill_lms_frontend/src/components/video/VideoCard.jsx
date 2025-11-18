import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * VideoCard renders a vertical video that auto-plays/pauses using IntersectionObserver.
 */
export default function VideoCard({ src, title, onEnded, onPlay, muted = true, controls = false, id }) {
  /** This is a public function. */
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => setInView(entry.isIntersecting && entry.intersectionRatio > 0.5));
      },
      { threshold: [0, 0.5, 1] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (inView) {
      const playPromise = v.play();
      if (playPromise?.then) {
        playPromise.then(() => onPlay?.()).catch(() => { /* autoplay may be blocked */ });
      } else {
        onPlay?.();
      }
    } else {
      v.pause();
    }
  }, [inView, onPlay]);

  return (
    <div className="video-card surface">
      <video
        ref={videoRef}
        src={src}
        playsInline
        muted={muted}
        controls={controls}
        preload="metadata"
        onPlay={onPlay}
        onEnded={onEnded}
        aria-label={title}
      />
      <div className="meta">
        <button
          type="button"
          onClick={() => id && navigate(`/lesson/${id}`)}
          style={{ background: 'transparent', color: '#fff', border: 0, padding: 0, fontWeight: 700, cursor: 'pointer' }}
          aria-label={`Open lesson ${title}`}
        >
          {title}
        </button>
      </div>
    </div>
  );
}
