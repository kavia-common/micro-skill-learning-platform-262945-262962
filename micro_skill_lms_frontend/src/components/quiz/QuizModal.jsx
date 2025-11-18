import React, { useEffect, useState } from 'react';
import client from '../../api/client';

/**
 * PUBLIC_INTERFACE
 * QuizModal fetches questions for a video and submits the attempt.
 */
export default function QuizModal({ videoId, moduleId, open, onClose }) {
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
      // Convert flat map {qid: value} to array answers per API spec
      const answersArray = Object.entries(answers).map(([questionId, selected]) => ({
        questionId,
        selectedAnswerIds: Array.isArray(selected) ? selected : [selected]
      }));

      const payload = {
        videoId,
        ...(moduleId ? { moduleId } : {}),
        answers: answersArray
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
          {!loading && !result && questions.map((q, idx) => {
            const opts = (q.options || q.choices || []);
            const qid = q.id ?? String(idx);
            return (
              <div key={qid} className="surface" style={{ padding: 12, marginBottom: 10 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  {idx + 1}. {q.text || q.question}
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                  {opts.length === 0 ? (
                    <div style={{ color: '#6B7280', fontSize: 13 }}>No options available</div>
                  ) : opts.map((opt, i) => {
                    const id = `${qid}-${i}`;
                    const value = typeof opt === 'object' ? (opt.value ?? opt.id ?? `${i}`) : opt;
                    const label = typeof opt === 'object' ? (opt.label ?? String(opt.value ?? 'Option')) : opt;
                    return (
                      <label key={id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input
                          type="radio"
                          name={`q-${qid}`}
                          value={value}
                          onChange={(e) => setAnswer(qid, e.target.value)}
                        />
                        <span>{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

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
              <div style={{ marginTop: 8, fontSize: 13, color: '#4B5563' }}>
                You can close this window to continue.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
