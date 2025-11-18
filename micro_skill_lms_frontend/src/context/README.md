# Auth Contexts

Canonical authentication context for this app is located at:

- src/api/AuthContext.jsx (Supabase-based)

It wires:
- Supabase session handling
- axios Authorization via session.access_token
- signIn, signUp, signOut helpers

Legacy context (src/context/AuthContext.js) is retained only for migration reference and should not be imported by new code.

Environment variables required:
- REACT_APP_API_BASE
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY
- Optional: REACT_APP_FRONTEND_URL (used for Supabase emailRedirectTo)
