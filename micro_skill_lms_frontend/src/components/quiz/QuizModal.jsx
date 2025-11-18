import React, { useEffect, useState } from 'react';
import client from '../../api/client';

/**
 * PUBLIC_INTERFACE
 * QuizModal fetches questions for a video and submits the attempt.
 */
export default function QuizModal({ videoId, open, onClose }) {
  /** This is a public function. */
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setError('');

    client.get(`/api/quiz/video/${videoId}`)
      .then(res => setQuestions(res.data?.questions || res.data || []))
      .catch(() => setError('Failed to load questions'))
      .finally(() => setLoading(false));
  }, [open, videoId]);

  const setAnswer = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        videoId,
        answers
      };
      const res = await client.post('/api/quiz/attempts', payload);
      setResult(res?.data || { score: 0, total: questions.length });
    } catch {
      setError('Failed to submit attempt');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Quiz">
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Quick Quiz</h3>
          <button className="btn secondary" onClick={onClose} aria-label="Close Quiz">Close</button>
        </div>
        <div style={{ marginTop: 12 }}>
          {loading && <div className="loading">Loading questions...</div>}
          {error && <div style={{ color: '#DC2626', marginBottom: 8 }}>{error}</div>}
          {!loading && !result && questions.map((q, idx) => (
            <div key={q.id || idx} className="surface" style={{ padding: 12, marginBottom: 10 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                {idx + 1}. {q.text || q.question}
              </div>
              <div style={{ display: 'grid', gap: 6 }}>
                {(q.options || q.choices || []).map((opt, i) => {
                  const id = `${q.id || idx}-${i}`;
                  return (
                    <label key={id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        type="radio"
                        name={`q-${q.id || idx}`}
                        value={typeof opt === 'object' ? opt.value : opt}
                        onChange={(e) => setAnswer(q.id || idx, e.target.value)}
                      />
                      <span>{typeof opt === 'object' ? opt.label : opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {!loading && !result && questions.length > 0 && (
            <button className="btn" onClick={submit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          )}

          {result && (
            <div className="surface" style={{ padding: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Your Score</div>
              <div style={{ fontSize: 32, color: '#1E3A8A', fontWeight: 800 }}>
                {result.score ?? 0} / {result.total ?? questions.length}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
