import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';

/**
 * PUBLIC_INTERFACE
 * QuizPage renders quiz questions for a given videoId and shows instant scoring after submission.
 */
export default function QuizPage() {
  /** This is a public function. */
  const { videoId } = useParams();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    client
      .get(`/api/quiz/video/${videoId}`)
      .then((res) => {
        if (!mounted) return;
        const qs = res.data?.questions || res.data || [];
        setQuestions(qs);
      })
      .catch(() => setError('Failed to load quiz'))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [videoId]);

  const setAnswer = (qid, value) => setAnswers((prev) => ({ ...prev, [qid]: value }));

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const answersArray = Object.entries(answers).map(([questionId, selected]) => ({
        questionId,
        selectedAnswerIds: Array.isArray(selected) ? selected : [selected],
      }));
      const res = await client.post('/api/quiz/attempts', { videoId, answers: answersArray });
      setResult(res?.data?.result || { score: 0, total: questions.length, percent: 0 });
    } catch {
      setError('Failed to submit attempt');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="surface" style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Quiz</h2>
      {loading && <div className="loading">Loading questions...</div>}
      {error && <div style={{ color: 'var(--color-error)' }}>{error}</div>}
      {!loading && !result && (
        <>
          {questions.length === 0 ? (
            <div>No questions available.</div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {questions.map((q, idx) => {
                const opts = q.options || q.choices || q.answers || [];
                const qid = q.id ?? String(idx);
                return (
                  <div key={qid} className="surface" style={{ padding: 12 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>
                      {idx + 1}. {q.text || q.question}
                    </div>
                    <div style={{ display: 'grid', gap: 6 }}>
                      {opts.length === 0 ? (
                        <div style={{ color: '#6B7280', fontSize: 13 }}>No options</div>
                      ) : (
                        opts.map((opt, i) => {
                          const value = typeof opt === 'object' ? (opt.value ?? opt.id ?? `${i}`) : opt;
                          const label = typeof opt === 'object' ? (opt.label ?? String(opt.value ?? 'Option')) : opt;
                          return (
                            <label key={`${qid}-${i}`} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <input
                                type="radio"
                                name={`q-${qid}`}
                                value={value}
                                onChange={(e) => setAnswer(qid, e.target.value)}
                              />
                              <span>{label}</span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {questions.length > 0 && (
            <button className="btn" onClick={submit} disabled={submitting} style={{ marginTop: 12 }}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </>
      )}
      {result && (
        <div className="surface" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Your Score</div>
          <div style={{ fontSize: 36, color: '#1E3A8A', fontWeight: 800 }}>
            {result.score ?? 0} / {result.total ?? questions.length}
          </div>
          <div style={{ color: '#4B5563', marginTop: 6 }}>
            {typeof result.percent === 'number' ? `${result.percent}%` : ''}
          </div>
        </div>
      )}
    </div>
  );
}
