# Relaxa Backend – Team Tasks (3 Members)

## Workflow

1. **Lead (Ahsan)** finishes foundation + API contracts
2. Teammates implement middle modules in parallel (separate branches)
3. Lead implements **AI** last and integrates everything

## Lead (Ahsan) – Phase 1 (Foundation) ✅

- Project structure + Express server + MongoDB Atlas connection
- Base middleware (cors/json/notFound/errorHandler)
- Placeholder controllers/routes/models/services
- Versioned API router at `/api/v1`

## Teammate 1 – Phase 2 (Auth + User + Mood)

**Owns**
- `controllers/auth.controller.js`
- `controllers/user.controller.js`
- `controllers/mood.controller.js`
- `routes/auth.routes.js`
- `routes/user.routes.js`
- `routes/mood.routes.js`
- `middleware/auth.middleware.js` (implement `protect` and `adminOnly`)
- `models/user.model.js`
- `models/mood.model.js`

**Deliverables**
- JWT auth working:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
- User profile:
  - `GET /api/v1/users/me`
  - `PATCH /api/v1/users/me`
- Mood tracking:
  - `POST /api/v1/moods`
  - `GET /api/v1/moods/history`

## Teammate 2 – Phase 2 (Admin + Exercises + Reports + Analytics)

**Owns**
- `controllers/admin.controller.js`
- `controllers/exercise.controller.js`
- `controllers/report.controller.js`
- `routes/admin.routes.js`
- `routes/exercise.routes.js`
- `routes/report.routes.js`
- `models/exercise.model.js`

**Deliverables**
- Admin:
  - `POST /api/v1/admin/login`
  - `GET /api/v1/admin/users?page=&limit=&search=`
- Exercises (admin CRUD + user list):
  - `POST /api/v1/admin/exercises`
  - `GET /api/v1/exercises?category=&search=`
- Reports:
  - `GET /api/v1/reports/mood-trends?range=7d|30d`
- Analytics (admin):
  - `GET /api/v1/admin/analytics/summary`
  - `GET /api/v1/admin/analytics/activity-mix`

## Lead (Ahsan) – Phase 3 (AI, last)

**Owns**
- `controllers/ai.controller.js`
- `services/chatbot.service.js`
- `services/recommendation.service.js`
- `routes/ai.routes.js`

**Deliverables**
- Chatbot:
  - `POST /api/v1/ai/chat`
- Recommendations (BFS/A*):
  - `POST /api/v1/ai/recommendations`
- Integrate with mood history + exercises list
