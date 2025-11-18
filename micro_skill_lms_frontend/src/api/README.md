# Frontend API Client Wiring (with Supabase Auth)

Install:
- npm install @supabase/supabase-js

Environment (.env):
- REACT_APP_API_BASE=http://localhost:3001
- REACT_APP_SUPABASE_URL=<your-supabase-url>
- REACT_APP_SUPABASE_KEY=<your-supabase-anon-key>
- Optional: REACT_APP_FRONTEND_URL=http://localhost:3000

Auth flow:
- Use `src/api/AuthContext.jsx` which initializes Supabase client, maintains session, and wires axios to send `Authorization: Bearer <supabase access token>`.
- On app mount and auth state changes, the token getter is set automatically. Supabase manages session persistence.

Quick usage:

```jsx
// App.jsx
import React from 'react';
import { AuthProvider } from './api/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      {/* your routes/components */}
    </AuthProvider>
  );
}
```

Example calls:

```jsx
import api from '../api/client';

async function fetchFeed() {
  const res = await api.get('/api/feed'); // public
  return res.data;
}

async function fetchMe() {
  const res = await api.get('/api/auth/supabase/me'); // protected; Authorization auto-attached
  return res.data;
}
```

Routes:
- Auth: `/api/auth/supabase/me` (Supabase), legacy `/api/auth/login`, `/api/auth/register`, `/api/auth/me` remain during migration
- Progress: `/api/progress`, `/api/progress/module/:moduleId`, `/api/progress/track`
- Quiz: `/api/quiz/video/:videoId`, `/api/quiz/attempts`

Troubleshooting (401 Unauthorized):
- Ensure Supabase session is established (signIn/signUp) and `REACT_APP_SUPABASE_*` envs are set.
- Verify `REACT_APP_API_BASE` points to your backend.
- Backend must have `CORS_ORIGIN` including your frontend origin and `SUPABASE_URL` set for JWKS lookup.
