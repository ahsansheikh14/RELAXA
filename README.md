# Relaxa

Relaxa is a mental wellness web app that helps people track mood, get gentle support, and discover wellness exercises.
The project has two parts:

The project has two parts:
- `backend/` — Node.js + Express API with MongoDB data storage
- `frontend/` — React + Vite web app for users and admins

## What Relaxa does

For users:
- Register and log in
- Track your mood with a simple mood check-in
- See mood history and reports
- Chat with an AI wellness assistant
- Browse wellness exercises and suggestions

For admins:
- Log in using admin credentials
- Manage the exercise library
- View user and analytics data

## Tech used

- Backend: Node.js, Express, MongoDB, JWT authentication
- Frontend: React, Vite, React Router
- AI: OpenAI / Gemini chat support (optional)

## Quick setup

### 1. Backend setup

Open a terminal and run:

```bash
cd backend
npm install
```

Then copy the example environment file and update it:

```bash
copy .env.example .env
```

In `backend/.env`, set:
- `MONGODB_URI` for your MongoDB database
- `JWT_SECRET` for auth tokens
- `GEMINI_API_KEY` or `OPENAI_API_KEY` if you want AI chat support

Start the backend server:

```bash
npm run dev
```

The server will usually run on `http://localhost:5000`.

### 2. Frontend setup

In a new terminal, run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will usually run on `http://localhost:5173`.

## How to use the app

- Open the frontend link in your browser
- Register a new user or log in
- Use the dashboard to track moods, read reports, and chat with the AI
- Admins can log in to the admin panel to manage exercises and analytics

## Default admin credentials

Use these details to log in as the admin:

- Email: `admin@relaxa.com`
- Password: `RelaxaAdmin@2026`

## Notes

- The AI chat requires a valid `GEMINI_API_KEY` or `OPENAI_API_KEY` in `backend/.env`.
- If you do not configure an email service, password reset may not work.
- The backend includes a health check route: `/api/health`.

## Useful commands

Backend:
- `npm run dev` — run backend in development mode
- `npm start` — run backend normally

Frontend:
- `npm run dev` — run frontend development server
- `npm run build` — build production files
- `npm run preview` — preview the built app

## Project structure

- `backend/` — API code, routes, controllers, models, middleware
- `frontend/` — React app, pages, components, routes
- `docs/` — project documentation and testing notes
- `tests/selenium/` — browser tests for app features

Enjoy building and using Relaxa!
