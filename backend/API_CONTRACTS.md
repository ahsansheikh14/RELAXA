# Relaxa Backend – API Contracts (Draft)

Use `/api/v1` as the preferred base. Non-versioned `/api/*` is kept for compatibility.

## Auth

### POST `/api/v1/auth/register`
**Body**
```json
{ "name": "Elena", "email": "elena@example.com", "password": "secret" }
```
**Response**
```json
{ "token": "<jwt>", "user": { "id": "<id>", "name": "Elena", "email": "elena@example.com", "role": "user" } }
```

### POST `/api/v1/auth/login`
**Body**
```json
{ "email": "elena@example.com", "password": "secret" }
```
**Response** same as register

## Users

### GET `/api/v1/users/me` (protected)
**Response**
```json
{ "id": "<id>", "name": "Elena", "email": "elena@example.com", "role": "user" }
```

### PATCH `/api/v1/users/me` (protected)
**Body**
```json
{ "name": "New Name" }
```
**Response** updated user object

## Moods

### POST `/api/v1/moods` (protected)
**Body**
```json
{ "mood": "Calm", "stressLevel": 4, "note": "Better today" }
```
**Response**
```json
{ "id": "<id>", "mood": "Calm", "stressLevel": 4, "note": "Better today", "createdAt": "..." }
```

### GET `/api/v1/moods/history` (protected)
**Response**
```json
{ "items": [ { "mood": "Calm", "stressLevel": 4, "createdAt": "..." } ] }
```

## Exercises (user)

### GET `/api/v1/exercises` (protected)
Query: `category`, `search`
**Response**
```json
{ "items": [ { "id": "<id>", "title": "Work Stress", "category": "Work", "durationMinutes": 10 } ] }
```

## Reports

### GET `/api/v1/reports/mood-trends` (protected)
Query: `range=7d|30d`
**Response**
```json
{ "points": [ { "date": "2026-05-01", "mood": 3, "stress": 6 } ] }
```

## Admin

### POST `/api/v1/admin/login`
**Body**
```json
{ "email": "admin@relaxa.com", "password": "secret" }
```
**Response**
```json
{ "token": "<jwt>", "admin": { "id": "<id>", "email": "admin@relaxa.com", "role": "admin" } }
```

### GET `/api/v1/admin/users` (admin)
Query: `page`, `limit`, `search`
**Response**
```json
{ "items": [ { "id": "<id>", "name": "Sarah", "email": "sarah@example.com", "role": "user" } ], "page": 1, "limit": 10, "total": 12842 }
```

### POST `/api/v1/admin/exercises` (admin)
**Body**
```json
{ "title": "Anxiety Relief", "category": "Anxiety", "durationMinutes": 15, "description": "..." }
```
**Response** created exercise

## AI (Lead will implement later)

### POST `/api/v1/ai/chat` (protected)
### POST `/api/v1/ai/recommendations` (protected)
