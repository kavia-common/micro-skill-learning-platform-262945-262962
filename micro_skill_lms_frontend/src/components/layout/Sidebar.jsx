import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import client from '../../api/client';

/**
 * PUBLIC_INTERFACE
 * Sidebar lists module links fetched from the backend.
 */
export default function Sidebar() {
  /** This is a public function. */
  const [modules, setModules] = useState([]);

  useEffect(() => {
    let mounted = true;
    client.get('/api/modules')
      .then(res => {
        if (mounted) setModules(res.data || []);
      })
      .catch(() => { /* no-op */ });
    return () => { mounted = false; };
  }, []);

  return (
    <aside className="sidebar" aria-label="Module Navigation">
      <div className="section-title">Modules</div>
      {modules.length === 0 && <div style={{ color: '#6B7280', fontSize: 14 }}>No modules yet</div>}
      {modules.map(m => (
        <NavLink
          key={m.id || m._id || m.slug || JSON.stringify(m)}
          to={`/modules/${m.id ?? m._id ?? m.slug}`}
          className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}
        >
          {m.title || m.name || 'Untitled Module'}
        </NavLink>
      ))}
      <div className="section-title" style={{ marginTop: 18 }}>Explore</div>
      <Link className="navlink" to="/">Home Feed</Link>
    </aside>
  );
}
