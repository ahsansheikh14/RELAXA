# Relaxa — Selenium Tests (Assignment 3)

## Setup (Windows)

1. Install **Python 3.10+** from https://www.python.org/downloads/
2. Install **Google Chrome** (Selenium 4 auto-downloads ChromeDriver).
3. Start the app:
   ```powershell
   # Terminal 1
   cd backend
   npm run dev

   # Terminal 2
   cd frontend
   npm run dev
   ```
4. Create a **test user** via Sign Up on http://localhost:5173/login (or use existing).
5. Ensure **admin** works: `admin@relaxa.com` / your password.

## Install test dependencies

```powershell
cd tests/selenium
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Edit .env with your real emails/passwords
```

## Run tests

```powershell
# CRUD test (required for assignment)
pytest test_crud_exercises.py -v

# Extra smoke tests (login + navigation)
pytest test_smoke_user.py -v

# All tests
pytest -v
```

## For your report

1. Screenshot each CRUD step (Create → Read → Update → Delete).
2. Paste the **CRUD test plan** table from `docs/CSC411_Assignment3_Web_Design_Testing.md`.
3. Mention **framework = MERN** with short justification.
4. Note: AI chat tests need a valid `GEMINI_API_KEY` — skip or test UI only without sending messages.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Connection refused` | Start frontend on port 5173 |
| Admin login fails | Check `.env` credentials; seed admin in backend |
| User login fails | Register user first or fix `USER_EMAIL` / `USER_PASSWORD` |
| ChromeDriver error | Update Chrome browser; upgrade `pip install -U selenium` |
