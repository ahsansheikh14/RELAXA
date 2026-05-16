# Relaxa Backend – API Contracts

Base URL (local): `http://localhost:5000/api/v1`

All protected routes require header: `Authorization: Bearer <token>`

---

## Auth

### POST `/auth/register`
**Body**
```json
{ "name": "Ahsan", "email": "ahsan@example.com", "password": "secret123" }
```
**Response** `201`
```json
{ "message": "...", "token": "<jwt>", "user": { "id": "...", "name": "...", "email": "...", "role": "user" } }
```

### POST `/auth/login`
**Body**
```json
{ "email": "ahsan@example.com", "password": "secret123" }
```

### POST `/auth/forgot-password`
**Body**
```json
{ "email": "ahsan@example.com" }
```
**Response** `200` — generic success message. In development without SMTP, may include `resetLink` for testing.

### POST `/auth/reset-password`
**Body**
```json
{ "email": "ahsan@example.com", "token": "<from-email-link>", "newPassword": "newsecret123" }
```

### POST `/auth/change-password` (protected)
**Body**
```json
{ "currentPassword": "old", "newPassword": "newsecret123" }
```

---

## Users

### GET `/users/me` (protected)
**Response**
```json
{ "user": { "id": "...", "name": "...", "email": "...", "role": "user", "createdAt": "..." } }
```

### PATCH `/users/me` (protected)
**Body**
```json
{ "name": "New Name" }
```

---

## Moods

### POST `/moods` (protected)
**Body**
```json
{ "mood": "Calm", "stressLevel": 4, "note": "Better today" }
```

### GET `/moods/history?limit=30` (protected)
**Response**
```json
{ "count": 5, "moods": [ { "_id": "...", "mood": "Calm", "stressLevel": 4, "createdAt": "..." } ] }
```

---

## Exercises

### GET `/exercises?category=&targetMood=&search=` (protected)
**Response** list of exercises for users.

### GET `/exercises/:id` (protected)

### POST `/exercises` (admin)
### PATCH `/exercises/:id` (admin)
### DELETE `/exercises/:id` (admin)

**Body (create/update)**
```json
{
  "title": "Ocean Breath",
  "category": "Breathing",
  "targetMood": "Anxious",
  "durationMinutes": 10,
  "description": "...",
  "mediaType": "video",
  "mediaUrl": "https://..."
}
```

---

## Reports

### GET `/reports/mood-trends?days=30` (protected)
**Response** mood trend points for charts and PDF export.

---

## AI

### POST `/ai/recommendations` (protected)
**Body**
```json
{ "currentMood": "Stressed", "algorithm": "a_star", "limit": 3 }
```
**Response** recommended exercises plus BFS/A* path metadata (backend only; not shown on user UI).

### POST `/ai/chat` (protected)
**Body**
```json
{ "message": "I feel anxious today", "conversationId": "" }
```
**Response**
```json
{
  "message": "AI chat reply generated successfully.",
  "conversation": { "id": "...", "title": "...", "messages": [] },
  "conversationSummary": { "id": "...", "title": "...", "lastMessagePreview": "..." },
  "provider": "gemini",
  "chatLimitReached": false
}
```

### GET `/ai/conversations` (protected)
**Response**
```json
{ "items": [ { "id": "...", "title": "...", "lastMessagePreview": "...", "updatedAt": "..." } ] }
```

### GET `/ai/conversations/:conversationId` (protected)
**Response** full conversation with messages.

---

## Admin

### POST `/admin/login`
**Body**
```json
{ "email": "admin@relaxa.com", "password": "RelaxaAdmin@2026" }
```

### POST `/admin/forgot-password`
Resets to bootstrap credentials in development.

### GET `/admin/users?page=1&limit=10&search=` (admin)

### GET `/admin/analytics/summary` (admin)

### GET `/admin/analytics/activity-mix` (admin)

---

## Environment (backend/.env)

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection |
| `JWT_SECRET` | Auth token signing |
| `GEMINI_API_KEY` | Primary AI chat |
| `GEMINI_MODEL` | e.g. `gemini-2.0-flash` |
| `OPENAI_API_KEY` | Backup AI chat when Gemini quota full |
| `OPENAI_MODEL` | e.g. `gpt-4o-mini` |
| `FRONTEND_URL` | Password reset links |
| `SMTP_*` | Real email for forgot-password |
