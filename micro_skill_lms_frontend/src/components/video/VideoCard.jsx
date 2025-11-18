import React, { useEffect, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * VideoCard renders a vertical video that auto-plays/pauses using IntersectionObserver.
 */
export default function VideoCard({ src, title, onEnded, muted = true, controls = false }) {
  /** This is a public function. */
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);

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
      if (playPromise?.catch) {
        playPromise.catch(() => { /* autoplay may be blocked */ });
      }
    } else {
      v.pause();
    }
  }, [inView]);

  return (
    <div className="video-card surface">
      <video
        ref={videoRef}
        src={src}
        playsInline
        muted={muted}
        controls={controls}
        preload="metadata"
        onEnded={onEnded}
        aria-label={title}
      />
      <div className="meta">
        <div style={{ fontWeight: 700 }}>{title}</div>
      </div>
    </div>
  );
}
