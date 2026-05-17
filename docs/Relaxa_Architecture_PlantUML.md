# Relaxa — PlantUML Architecture Diagrams

**How to export:** Paste each block at [https://www.plantuml.com/plantuml/uml](https://www.plantuml.com/plantuml/uml) → Export PNG/SVG for your report.

---

## Diagram 1 — System Architecture (MERN + Modules)

Use as **Figure 1: System Architecture of Relaxa**

```plantuml
@startuml Relaxa_System_Architecture
title Figure 1: Relaxa System Architecture (MERN Stack)

skinparam componentStyle rectangle
skinparam shadowing false
skinparam defaultFontName Segoe UI
skinparam packageStyle rectangle

actor "User" as User
actor "Administrator" as Admin

package "Presentation Layer\n(React 19 + Vite + React Router)" #E8F5F2 {
  component "Login / Register\nForgot Password" as LoginPage
  component "Dashboard\n(Mood Logging)" as Dashboard
  component "Exercises\n(AI Recommendations)" as Exercises
  component "Reports\n(Charts + PDF)" as Reports
  component "AI Chat\n(Zen Assistant)" as Chat
  component "Admin Panel\n(Users, Exercises, Analytics)" as AdminUI
}

package "Application Layer\n(Node.js + Express 5 — /api/v1)" #D9EEEA {
  component "Auth Module\n(JWT, bcrypt)" as AuthAPI
  component "User Module" as UserAPI
  component "Mood Module" as MoodAPI
  component "Exercise Module\n(CRUD)" as ExerciseAPI
  component "Report Module" as ReportAPI
  component "AI Module" as AIAPI
  component "Admin Module" as AdminAPI
  component "Recommendation Service\n(BFS + A*)" as RecService #C9E6D7
  component "Chatbot Service\n(System Prompt)" as ChatService #C9E6D7
}

cloud "External Services" #FFF8E8 {
  component "Google Gemini API" as Gemini
  component "Email Service\n(Resend / SMTP)" as Email
}

database "Data Layer\n(MongoDB + Mongoose)" #F5F3F3 {
  collections "Collections" {
    storage "users" as Users
    storage "moods" as Moods
    storage "exercises" as Exercises
    storage "chatconversations" as Chats
  }
}

User --> LoginPage
User --> Dashboard
User --> Exercises
User --> Reports
User --> Chat
Admin --> AdminUI

LoginPage --> AuthAPI
Dashboard --> MoodAPI
Dashboard --> AIAPI
Exercises --> ExerciseAPI
Exercises --> AIAPI
Reports --> MoodAPI
Reports --> ReportAPI
Chat --> AIAPI
AdminUI --> AdminAPI
AdminUI --> ExerciseAPI

AuthAPI --> Users
UserAPI --> Users
MoodAPI --> Moods
ExerciseAPI --> Exercises
ReportAPI --> Moods
AdminAPI --> Users
AdminAPI --> Exercises

AIAPI --> RecService
AIAPI --> ChatService
RecService --> Moods
RecService --> Exercises
ChatService --> Chats
ChatService --> Gemini
AuthAPI --> Email

@enduml
```

---

## Diagram 2 — Three-Tier Architecture

Use as **Figure 2: Three-Tier Architecture of Relaxa**

```plantuml
@startuml Relaxa_Three_Tier_Architecture
title Figure 2: Three-Tier Architecture — Relaxa

skinparam shadowing false
skinparam defaultFontName Segoe UI
skinparam rectangle {
  RoundCorner 8
}

actor "Client\n(Web Browser)" as Browser

rectangle "Tier 1: Presentation Layer" #E8F5F2 {
  card "React Single Page Application (SPA)" as SPA {
    portin HTTP_Request
    portout UI_Render
  }
  note right of SPA
    **Technologies:**
    React 19, Vite 8
    React Router 7
    CSS, jsPDF
    **Runs on:** localhost:5173
  end note
}

rectangle "Tier 2: Application / Business Layer" #D9EEEA {
  card "REST API Server" as API {
    portin API_In
    portout API_Out
  }
  note right of API
    **Technologies:**
    Node.js, Express 5
    JWT, bcryptjs, cors
    **Base URL:** /api/v1
    **Modules:** auth, users,
    moods, exercises,
    reports, ai, admin
  end note
}

rectangle "Tier 3: Data Layer" #F0EBE8 {
  database "MongoDB" as DB {
    portin DB_In
  }
  note right of DB
    **ODM:** Mongoose
  end note
}

cloud "External" #FFF8E8 {
  [Gemini API] as Gemini
  [Email API] as Mail
}

Browser --> SPA : HTTPS\nUser actions
SPA --> API : JSON + JWT\n(HTTP REST)
API --> DB : CRUD queries\n(Mongoose)
API --> Gemini : AI chat requests
API --> Mail : Password reset

@enduml
```

---

## Diagram 3 — Three-Tier (Simplified — for slides)

Shorter version if your report has limited space.

```plantuml
@startuml Relaxa_Three_Tier_Simple
title Relaxa — Three-Tier Architecture (Simplified)

skinparam shadowing false

together {
  rectangle "Presentation Tier" #E8F5F2 {
    [React Frontend\n(Vite + React Router)]
  }
  rectangle "Application Tier" #D9EEEA {
    [Express REST API\n/api/v1]
  }
  rectangle "Data Tier" #F5F3F3 {
    database "MongoDB"
  }
}

[React Frontend\n(Vite + React Router)] -down-> [Express REST API\n/api/v1] : HTTP/JSON\nJWT Auth
[Express REST API\n/api/v1] -down-> [MongoDB] : Mongoose ODM
[Express REST API\n/api/v1] -right-> [Google Gemini] : AI Chat

@enduml
```

---

## Diagram 4 — Request Flow (Sequence — optional bonus)

Use as **Figure 3: Example request flow (Mood log)**

```plantuml
@startuml Relaxa_Mood_Request_Flow
title Figure 3: Request Flow — User Logs Mood

actor User
participant "React\nDashboard" as UI
participant "Express\nMood API" as API
participant "MongoDB" as DB
participant "AI Service\n(BFS/A*)" as AI

User -> UI : Select mood (e.g. Calm)
UI -> API : POST /api/v1/moods\n+ JWT token
API -> API : Verify JWT
API -> DB : Save mood document
DB --> API : OK
API --> UI : 201 Created

UI -> API : POST /api/v1/ai/recommendations
API -> DB : Read moods + exercises
API -> AI : Run A* / BFS
AI --> API : Recommended exercises
API --> UI : JSON response
UI --> User : Show exercise cards

@enduml
```

---

## Diagram 5 — Deployment Architecture (optional)

```plantuml
@startuml Relaxa_Deployment
title Relaxa Deployment Architecture (Production)

node "User Device" {
  [Chrome / Edge Browser]
}

cloud "Internet" {
  [Vercel / Netlify\n(Static React Build)] as FE
  [Render / Railway\n(Node.js API)] as BE
  [MongoDB Atlas\n(Cloud Database)] as DB
  [Google Gemini API] as AI
  [Resend Email API] as Mail
}

[Chrome / Edge Browser] --> FE : HTTPS
[Chrome / Edge Browser] --> BE : HTTPS /api/v1
BE --> DB
BE --> AI
BE --> Mail

@enduml
```

---

## Report captions (copy-paste)

**Figure 1:** System architecture of Relaxa showing presentation components (React), application modules (Express API), data collections (MongoDB), and external services (Gemini, email).

**Figure 2:** Three-tier architecture separating presentation (React SPA), application/business logic (Express REST API), and data persistence (MongoDB).

**Figure 3:** Sequence diagram illustrating mood logging and AI-based exercise recommendation flow.
