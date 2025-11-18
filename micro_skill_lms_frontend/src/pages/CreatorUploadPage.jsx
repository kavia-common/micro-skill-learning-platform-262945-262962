import React, { useState } from 'react';
import client from '../api/client';

/**
 * PUBLIC_INTERFACE
 * CreatorUploadPage contains a simple upload form for lesson/short video metadata.
 * Uses JSON metadata first approach: POST /api/creator/videos (if available).
 */
export default function CreatorUploadPage() {
  /** This is a public function. */
  const [form, setForm] = useState({
    title: '',
    description: '',
    url: '',
    moduleId: '',
    tags: '',
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    setErr('');
    try {
      const payload = {
        title: form.title,
        description: form.description,
        url: form.url,
        moduleId: form.moduleId || undefined,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      // Fallback: if /api/creator/videos not available, try /api/videos
      let res;
      try {
        res = await client.post('/api/creator/videos', payload);
      } catch {
        res = await client.post('/api/videos', payload);
      }
      if (res?.status >= 200 && res?.status < 300) {
        setMsg('Upload submitted successfully');
        setForm({ title: '', description: '', url: '', moduleId: '', tags: '' });
      } else {
        throw new Error('Upload failed');
      }
    } catch {
      setErr('Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="surface" style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Creator Upload</h2>
      {msg && <div style={{ color: 'var(--color-success)' }}>{msg}</div>}
      {err && <div style={{ color: 'var(--color-error)' }}>{err}</div>}
      <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
        <Field label="Title">
          <input name="title" required value={form.title} onChange={onChange} style={inputStyle} />
        </Field>
        <Field label="Description">
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </Field>
        <Field label="Video URL">
          <input
            name="url"
            required
            placeholder="https://cdn.example.com/lesson.mp4"
            value={form.url}
            onChange={onChange}
            style={inputStyle}
          />
        </Field>
        <Field label="Module ID (optional)">
          <input name="moduleId" value={form.moduleId} onChange={onChange} style={inputStyle} />
        </Field>
        <Field label="Tags (comma separated)">
          <input name="tags" value={form.tags} onChange={onChange} style={inputStyle} />
        </Field>
        <button className="btn" type="submit" disabled={busy} aria-label="Upload">
          {busy ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label>
      <div style={{ fontSize: 12, color: '#4B5563', marginBottom: 4 }}>{label}</div>
      {children}
    </label>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #E5E7EB',
  outline: 'none',
  marginTop: 2,
};
