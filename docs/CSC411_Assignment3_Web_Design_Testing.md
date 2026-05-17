# CSC-411 — Assignment 3 (CLO-2)
## Web Application Design & Testing Task

**Project:** Relaxa — Mental Wellness Web Application  
**Group:** _(fill names & registration numbers)_

---

## Task 1 — Application Architecture & Framework

### 1.1 Chosen framework: **MERN Stack**

| Layer | Technology | Role in Relaxa |
|--------|------------|----------------|
| **M** — MongoDB | MongoDB Atlas / local MongoDB | Stores users, mood logs, exercises, AI chat history |
| **E** — Express | Node.js + Express 4 | REST API (`/api/v1`), auth, AI services |
| **R** — React | React 19 + Vite | User dashboard, exercises, reports, AI chat, admin panel |
| **N** — Node.js | Node 18+ | Runs the backend server |

**Why MERN for Relaxa?**
- Single language (JavaScript) for frontend and backend — faster team development.
- MongoDB fits flexible wellness data (moods, chat messages, exercise metadata).
- React supports rich UI (chat, charts, admin CRUD) with component reuse.
- Express is lightweight and matches REST APIs required for mobile/web clients later.

### 1.2 Application architecture (3-tier)

```
[ Browser - React SPA ]
        |
        |  HTTP (JSON) + JWT
        v
[ Express API - /api/v1 ]
        |
        v
[ MongoDB ]
```

**Main modules:**
- **Auth** — register, login, forgot/reset password  
- **User** — profile (`GET/PATCH /users/me`)  
- **Mood** — create mood, history (Create + Read)  
- **Exercise** — admin CRUD; user read + AI recommendations  
- **AI** — Gemini chat, BFS/A* exercise recommendations  
- **Reports** — mood trends, PDF export  
- **Admin** — user list, exercise library, analytics  

_(Use the PlantUML diagram from `docs/CSC411_Assignment4_Documentation_Evaluation.md` as Figure 1 in your PDF.)_

### 1.3 Supporting tools

| Tool | Purpose |
|------|---------|
| Vite | Fast React dev server & build |
| React Router | Page routing (`/dashboard`, `/chat`, `/admin/...`) |
| JWT | Protected API routes |
| Gemini API | AI psychologist chat |

---

## Task 2 — Testing with Selenium

### 2.1 Testing approach

We use **Selenium WebDriver** (Python) to automate the **browser UI** — the same way a real user clicks, types, and navigates.

**What “test the whole app” means for this assignment:**
- **Required:** A formal **CRUD test plan** + Selenium scripts for **Create, Read, Update, Delete** on one feature.
- **Recommended:** Extra **smoke tests** for login, dashboard, and navigation (included in this repo under `tests/selenium/`).

**Best CRUD feature in Relaxa:** **Admin → Exercise Management**  
(Full create, list/search, edit, delete in the UI.)

### 2.2 Test environment

| Item | Value |
|------|--------|
| Frontend URL | `http://localhost:5173` |
| Backend URL | `http://localhost:5000/api/v1` |
| Browser | Google Chrome (latest) |
| Selenium | Python 3.10+ , `selenium` 4.x |
| OS | Windows 10/11 |

**Before running tests:**
1. Start MongoDB  
2. `cd backend && npm run dev`  
3. `cd frontend && npm run dev`  
4. Ensure admin works: `admin@relaxa.com` / `RelaxaAdmin@2026` (default; see `backend/src/constants/admin.constants.js`)  

### 2.3 CRUD test plan — Admin Exercises

| Test ID | Operation | Test case | Steps | Expected result |
|---------|-----------|-----------|--------|-----------------|
| CRUD-C-01 | **Create** | Add new exercise | 1. Admin login 2. Go to Add Exercise 3. Fill title, category, mood, description 4. Click Create | Success message; exercise appears in library |
| CRUD-R-01 | **Read** | List & search exercise | 1. Admin login 2. Open Exercise Management 3. Search by title | Exercise card visible with correct title & mood |
| CRUD-U-01 | **Update** | Edit exercise | 1. Open library 2. Click Edit on exercise 3. Change title 4. Update | Success message; new title shown in list |
| CRUD-D-01 | **Delete** | Remove exercise | 1. Open library 2. Click Delete 3. Confirm dialog | Exercise removed from list |

### 2.4 Additional smoke tests (whole-app coverage)

| Test ID | Module | What is verified |
|---------|--------|------------------|
| SMK-01 | User auth | Login with valid credentials → dashboard URL |
| SMK-02 | Navigation | Dashboard, Exercises, Reports links load |
| SMK-03 | Admin auth | Admin login → admin dashboard |

### 2.5 How to run Selenium tests (this project)

```powershell
cd tests/selenium
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Copy and edit credentials
copy .env.example .env

# Run (app must be running)
python -m pytest test_crud_exercises.py -v
python -m pytest test_smoke_user.py -v
```

**Screenshots for report:** Run tests with browser visible (default). Capture screenshots after each CRUD step (Create → Read → Update → Delete).

### 2.6 Sample test result table (fill after run)

| Test ID | Pass/Fail | Date | Notes |
|---------|-----------|------|-------|
| CRUD-C-01 | | | |
| CRUD-R-01 | | | |
| CRUD-U-01 | | | |
| CRUD-D-01 | | | |
| SMK-01 | | | |

### 2.7 References

- Selenium: https://www.selenium.dev/
- Sauce Labs getting started: https://wiki.saucelabs.com/display/DOCS/Getting+Started+with+Selenium+for+Automated+Website+Testing
- Guru99 Selenium tutorial: https://www.guru99.com/selenium-tutorial.html

---

## Submission checklist

- [ ] Task 1: Framework explanation + architecture diagram  
- [ ] Task 2: CRUD test plan (table above)  
- [ ] Selenium code (screenshots or attach `tests/selenium/`)  
- [ ] Short conclusion: what passed, what failed, limitations (e.g. AI chat needs API key)  
- [ ] Group names on cover page  
