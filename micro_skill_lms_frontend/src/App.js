import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';
import { AuthProvider, useAuth } from './api/AuthContext.jsx';
import { ProgressProvider } from './context/ProgressContext';
import TopNav from './components/layout/TopNav';
import Sidebar from './components/layout/Sidebar';
import VideoFeedPage from './pages/VideoFeedPage';
import LoginPage from './pages/LoginPage';
import ModulePage from './pages/ModulePage';
import ProfilePage from './pages/ProfilePage';

/**
 * PUBLIC_INTERFACE
 * App component is the main entry that wires providers and routes.
 */
function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Router>
          <ShellLayout />
        </Router>
      </ProgressProvider>
    </AuthProvider>
  );
}

/**
 * ShellLayout sets the classic layout: top navigation + sidebar + main content.
 * It also contains the route config for the application.
 */
function ShellLayout() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <TopNav />
      <div className="app-body">
        <Sidebar />
        <main className="app-content" role="main" aria-live="polite">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
            <Route path="/" element={<RequireAuth><VideoFeedPage /></RequireAuth>} />
            <Route path="/modules/:moduleId" element={<RequireAuth><ModulePage /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * RequireAuth guards routes that need authentication.
 */
function RequireAuth({ children }) {
  /** This is a public function.
   * Guards nested route elements; redirects to /login if user is not authenticated.
   */
  const { user, session } = useAuth();
  const loading = session === undefined;
  if (loading) {
    return <div className="centered loading">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default App;
