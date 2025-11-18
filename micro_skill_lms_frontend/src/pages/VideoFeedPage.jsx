import React, { useEffect, useMemo, useState } from 'react';
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
  const { summary, track } = useProgress();

  useEffect(() => {
    let mounted = true;
    client.get('/api/feed')
      .then(res => {
        const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
        if (mounted) {
          setFeed(items);
          setSelected(items[0]);
        }
      })
      .catch(() => { /* ignore */ });
    return () => { mounted = false; };
  }, []);

  const onVideoEnd = async (v) => {
    // mark completion for the video/module if applicable
    await track({
      videoId: v.id || v._id || v.videoId,
      moduleId: v.moduleId,
      status: 'completed',
      progress: 1
    });
    // select next
    const idx = feed.findIndex(item => (item.id || item._id || item.videoId) === (v.id || v._id || v.videoId));
    if (idx >= 0 && idx < feed.length - 1) {
      setSelected(feed[idx + 1]);
    }
  };

  const percent = useMemo(() => summary?.percent ?? 0, [summary]);

  return (
    <div className="feed-grid">
      <div>
        {feed.length === 0 ? (
          <div className="surface centered" style={{ minHeight: 200 }}>No videos in feed</div>
        ) : (
          <VerticalFeed items={feed} onVideoEnd={onVideoEnd} />
        )}
      </div>
      <div>
        <SummaryPanel selected={selected} percent={percent} onOpenQuiz={() => setQuizOpen(true)} />
      </div>

      <QuizModal
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        videoId={selected?.id || selected?._id || selected?.videoId}
      />
    </div>
  );
}
