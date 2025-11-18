import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../api/AuthContext.jsx';

/**
 * PUBLIC_INTERFACE
 * TopNav renders the top navigation bar with brand and user actions.
 */
export default function TopNav() {
  /** This is a public function. */
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="topnav" role="navigation" aria-label="Top Navigation">
      <div className="brand">
        <span aria-hidden>🌊</span>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Micro Skill LMS</Link>
      </div>
      <div className="nav-actions">
        <Link to="/profile" className="btn secondary" aria-label="Profile">Profile</Link>
        {user ? (
          <button className="btn" onClick={handleLogout} aria-label="Logout">Logout</button>
        ) : (
          <Link className="btn" to="/login" aria-label="Login">Login</Link>
        )}
      </div>
    </header>
  );
}
