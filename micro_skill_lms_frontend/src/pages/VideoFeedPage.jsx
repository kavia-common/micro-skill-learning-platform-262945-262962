import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import client from '../api/client';
import VerticalFeed from '../components/video/VerticalFeed';
import SummaryPanel from '../components/video/SummaryPanel';
import QuizModal from '../components/quiz/QuizModal';
import { useProgress } from '../context/ProgressContext';

/**
 * PUBLIC_INTERFACE
 * VideoFeedPage shows the main vertical video feed with a side summary panel.
 */
export default function VideoFeedPage() {
  /** This is a public function. */
  const [feed, setFeed] = useState([]);
  const [selected, setSelected] = useState(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef(null);

  const { summary, track } = useProgress();

  const normalizeItems = (data) => {
    if (Array.isArray(data)) return data;
    return data?.items || [];
  };

  const fetchPage = useCallback(async (nextCursor = null) => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const qs = nextCursor ? `?cursor=${encodeURIComponent(nextCursor)}` : '';
      const res = await client.get(`/api/feed${qs}`);
      const items = normalizeItems(res.data);
      const newCursor = res.data?.nextCursor ?? res.data?.cursor ?? null;
      setFeed(prev => [...prev, ...items]);
      if (!selected && items.length > 0) setSelected(items[0]);
      setCursor(newCursor);
      setHasMore(Boolean(newCursor) && items.length > 0);
    } catch {
      // fail closed
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, selected]);

  useEffect(() => {
    // initial load
    fetchPage(null);
  }, [fetchPage]);

  useEffect(() => {
    // Infinite scroll with IntersectionObserver on a sentinel at the end
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMore && !loadingMore) {
        fetchPage(cursor);
      }
    }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [cursor, fetchPage, hasMore, loadingMore]);

  const onVideoPlay = async (v) => {
    // post a "started" tracking event once per view (best effort)
    try {
      await track({
        moduleId: v.moduleId,
        videoId: v.id || v._id || v.videoId,
        completed: false,
      });
    } catch {
      // ignore
    }
    setSelected(v);
  };

  const onVideoEnd = async (v) => {
    // mark completion for the video/module if applicable
    await track({
      moduleId: v.moduleId,
      videoId: v.id || v._id || v.videoId,
      completed: true,
    });
    // select next
    const vid = v.id || v._id || v.videoId;
    const idx = feed.findIndex(item => (item.id || item._id || item.videoId) === vid);
    if (idx >= 0) {
      if (idx < feed.length - 1) {
        setSelected(feed[idx + 1]);
      } else if (hasMore && cursor && !loadingMore) {
        // attempt to load more and then select first new item
        const beforeLen = feed.length;
        await fetchPage(cursor);
        setSelected((prev) => {
          // if new items appended
          if (feed.length > beforeLen) {
            return feed[beforeLen];
          }
          return prev;
        });
      }
    }
  };

  const percent = useMemo(() => summary?.percent ?? 0, [summary]);

  // Optionally fetch per-video details (summary) if not embedded
  useEffect(() => {
    let cancelled = false;
    async function loadDetails() {
      if (!selected) return;
      if (selected.description || selected.summary) return;
      try {
        const vid = selected.id || selected._id || selected.videoId;
        const res = await client.get(`/api/videos/${vid}`);
        if (!cancelled && res?.data) {
          setSelected(s => ({ ...(s || {}), ...res.data }));
        }
      } catch {
        // ignore
      }
    }
    loadDetails();
    return () => { cancelled = true; };
  }, [selected]);

  return (
    <div className="feed-grid">
      <div>
        {feed.length === 0 ? (
          <div className="surface centered" style={{ minHeight: 200 }}>
            {loadingMore ? 'Loading feed...' : 'No videos in feed'}
          </div>
        ) : (
          <>
            <VerticalFeed items={feed} onVideoEnd={onVideoEnd} onVideoPlay={onVideoPlay} />
            <div ref={loaderRef} className="centered" style={{ padding: 12, color: '#4B5563' }}>
              {loadingMore ? 'Loading more...' : (hasMore ? 'Scroll to load more' : 'No more videos')}
            </div>
          </>
        )}
      </div>
      <div>
        <SummaryPanel selected={selected} percent={percent} onOpenQuiz={() => setQuizOpen(true)} />
      </div>

      <QuizModal
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        videoId={selected?.id || selected?._id || selected?.videoId}
        moduleId={selected?.moduleId}
      />
    </div>
  );
}
