# E2E Verification Guide — Micro Skill LMS

Use this checklist to run local previews and validate end-to-end behavior across frontend (React), backend (Express/Prisma), and Supabase auth.

## 0) Prereqs
- Node 18+ recommended
- A Supabase project with anon public key and URL

## 1) Configure environments

Frontend (micro_skill_lms_frontend/.env):
- REACT_APP_API_BASE=http://localhost:3001
- REACT_APP_SUPABASE_URL=<your-supabase-url>
- REACT_APP_SUPABASE_KEY=<your-supabase-anon-key>
- REACT_APP_FRONTEND_URL=http://localhost:3000  # optional

Backend (backend/.env):
- PORT=3001
- CORS_ORIGIN=http://localhost:3000
- JWT_SECRET=<strong-random-value>
- DATABASE_PROVIDER=sqlite
- DATABASE_URL="file:./data/dev.db"
- SUPABASE_URL=<your-supabase-url>

## 2) Start backend
```
cd ../micro-skill-learning-platform-262945-262963/backend
npm install
cp .env.example .env  # then edit values
npm run db:setup
npm run dev
```
Visit http://localhost:3001/docs to confirm Swagger loads.

## 3) Start frontend
```
cd ../micro-skill-learning-platform-262945-262962/micro_skill_lms_frontend
npm install
cp .env.example .env  # then edit values
npm start
```
Visit http://localhost:3000

## 4) Verify content and UI
- Sidebar lists modules (GET /api/modules)
- Home feed shows videos (GET /api/feed); scroll to load more
- Selecting a video shows summary content (GET /api/videos/{id})

## 5) Verify authentication (Supabase)
- Open /login
- Register or sign in
- After success:
  - TopNav shows Logout
  - Profile shows your email
  - Protected ping works: GET /api/auth/supabase/me returns { user } (check devtools network)

## 6) Verify progress tracking
- Play a video; on play/end the app posts /api/progress/track
- Profile shows updated overall percent (GET /api/progress)
- Module page shows per-module progress (GET /api/progress/module/{moduleId})

## 7) Verify quiz flow
- On the selected video, click “Take Quiz”
- Questions load from GET /api/quiz/video/{videoId}
- Submit; POST /api/quiz/attempts returns score and attempt payload
- Score is visible in the modal

## 8) Common issues
- 401/Forbidden:
  - Ensure Supabase envs set on frontend, SUPABASE_URL set on backend
  - Confirm Authorization header present in requests to protected endpoints
- CORS:
  - CORS_ORIGIN in backend must include http://localhost:3000
- DB migration:
  - If schema changed, run `npm run prisma:migrate` and optionally re-seed

This guide covers the full user journey: feed viewing, summary display, Supabase login, quiz submission, and progress updates.
