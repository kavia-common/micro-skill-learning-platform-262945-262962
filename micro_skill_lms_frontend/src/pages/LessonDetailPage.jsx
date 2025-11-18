import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';
import ProgressBar from '../components/common/ProgressBar';
import TagList from '../components/common/TagList';
import { useProgress } from '../context/ProgressContext';
import QuizModal from '../components/quiz/QuizModal';

/**
 * PUBLIC_INTERFACE
 * LessonDetailPage shows a single lesson with a player, summary box, progress, and CTA to quiz.
 */
export default function LessonDetailPage() {
  /** This is a public function. */
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [quizOpen, setQuizOpen] = useState(false);

  const videoRef = useRef(null);
  const { track } = useProgress();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr('');
    client
      .get(`/api/videos/${id}`)
      .then((res) => {
        if (mounted) setLesson(res?.data || null);
      })
      .catch(() => setErr('Failed to load lesson'))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  const tags = useMemo(() => lesson?.tags || lesson?.keywords || [], [lesson]);

  const onPlay = async () => {
    const vId = lesson?.id || lesson?._id || id;
    try {
      await track({ moduleId: lesson?.moduleId, videoId: vId, completed: false });
    } catch {
      // ignore
    }
  };

  const onEnded = async () => {
    const vId = lesson?.id || lesson?._id || id;
    await track({ moduleId: lesson?.moduleId, videoId: vId, completed: true });
  };

  return (
    <div className="surface" style={{ padding: 16 }}>
      {loading ? (
        <div className="loading">Loading lesson...</div>
      ) : err ? (
        <div style={{ color: 'var(--color-error)' }}>{err}</div>
      ) : !lesson ? (
        <div>No lesson found.</div>
      ) : (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '2fr 1fr' }}>
          <div>
            <div
              className="video-card"
              style={{ aspectRatio: '16/9', background: '#000', border: '1px solid var(--border)' }}
            >
              <video
                ref={videoRef}
                src={lesson.url || lesson.src}
                controls
                playsInline
                onPlay={onPlay}
                onEnded={onEnded}
                aria-label={lesson.title || 'Lesson Player'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h2 style={{ marginTop: 12 }}>{lesson.title || 'Lesson'}</h2>
            <div style={{ color: '#4B5563', lineHeight: 1.6 }}>{lesson.description || lesson.summary}</div>
            <div style={{ marginTop: 12 }}>
              <TagList tags={tags} onTagClick={() => {}} />
            </div>
          </div>
          <div>
            <div className="surface" style={{ padding: 16, marginBottom: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Progress</div>
              <ProgressBar percent={Math.min(100, lesson?.progressPercent ?? 0)} />
              <div style={{ fontSize: 12, color: '#4B5563', marginTop: 6 }}>
                {lesson?.progressText || 'Watch the video and take the quiz to earn points.'}
              </div>
            </div>
            <div className="surface" style={{ padding: 16, marginBottom: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Summary</div>
              <div style={{ color: '#4B5563', lineHeight: 1.6 }}>
                {lesson?.keyTakeaways ||
                  lesson?.summary ||
                  'This lesson provides concise, actionable knowledge. Review the summary and test yourself.'}
              </div>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              <button className="btn" onClick={() => setQuizOpen(true)} aria-label="Take Quiz">
                Take Quiz
              </button>
              <button
                className="btn secondary"
                onClick={() => navigate(`/quiz/${lesson.id || id}`)}
                aria-label="Open Quiz Page"
              >
                Open Quiz Page
              </button>
            </div>
          </div>

          <QuizModal
            open={quizOpen}
            onClose={() => setQuizOpen(false)}
            videoId={lesson?.id || id}
            moduleId={lesson?.moduleId}
          />
        </div>
      )}
    </div>
  );
}
