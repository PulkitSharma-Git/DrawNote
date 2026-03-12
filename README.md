# 🎨 DrawNote

<p align="center">

<img src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white">
<img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB">
<img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white">
<img src="https://img.shields.io/badge/WebSockets-real--time-010101?logo=socketdotio">
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white">
<img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma">
<img src="https://img.shields.io/badge/Turborepo-monorepo-EF4444?logo=turborepo">

</p>

<p align="center">
<b>Brainstorm. Collaborate. Create.</b>
</p>

DrawNote is a **real-time collaborative whiteboard** built for seamless brainstorming and visual collaboration.

Users can **draw together on an infinite canvas**, with instant synchronization powered by WebSockets and persistent event storage.

🌐 **Live Demo**  
https://drawnote1.vercel.app

---

# ⚡ Tech Highlights

• Real-time collaboration using **WebSockets**  
• **Event-driven architecture** with persistent drawing events  
• **Infinite canvas rendering** using HTML Canvas API  
• **Room-based collaboration** with shareable links  
• **Monorepo architecture** powered by Turborepo  
• **Canvas state reconstruction** via event replay

---

# 🎥 Demo
https://github.com/user-attachments/assets/b73a10b1-fb4f-4b8a-b7e7-c6e9a76b5d33


---

# 📸 Screenshots

<img width="1440" height="810" alt="Screenshot 2026-03-12 at 6 03 41 PM" src="https://github.com/user-attachments/assets/ea210f2c-0d70-480a-9f96-df78ee3d9b56" />

<img width="1439" height="816" alt="Screenshot 2026-03-12 at 7 38 08 PM" src="https://github.com/user-attachments/assets/4788051a-0f7d-4ffb-bfed-3d457e1c2dc0" />

<img width="1440" height="805" alt="Screenshot 2026-03-12 at 6 06 04 PM" src="https://github.com/user-attachments/assets/ba34cbcb-0c16-42af-a76a-9d122746c20c" />


<img width="1440" height="816" alt="Screenshot 2026-03-12 at 7 37 24 PM" src="https://github.com/user-attachments/assets/d67ce923-fcb0-4e41-be7c-8e4738743875" />


---

# ✨ Features

### 🎨 Real-Time Collaboration
Multiple users can draw simultaneously with instant synchronization.

### 🌌 Infinite Canvas
Users can draw without boundaries using a dynamically expanding canvas.

### 🏠 Persistent Room System
Rooms have permanent links and stored drawing history.

### 🧠 Event Persistence
All drawing events are stored in the database and replayed when new users join.

### 🖌 Drawing Tools

- Freehand drawing
- Lines
- Rectangles
- Circles
- Eraser
- Diamond
- Text
- Resize
- Move
- Zoom In and Zoom Out
- And More

### 👥 Multi-User Synchronization
Drawing updates are broadcast instantly to all users in the room.

### 🔒 Secure Authentication
JWT-based authentication protects room access.

---

# 🏗 System Architecture

DrawNote uses an **event-driven architecture** where drawing events are transmitted through WebSockets and persisted in the database.

This allows the application to **reconstruct the canvas state by replaying events** when a new user joins a room.

```mermaid
flowchart LR

Client[Client Browser - Next.js]

Client -->|HTTP Requests| HTTP[HTTP Backend - Express]

HTTP -->|Auth / Room Data| DB[(PostgreSQL)]

Client -->|WebSocket Connection| WS[WebSocket Server]

WS -->|Broadcast Drawing Events| Client

WS -->|Persist Drawing Event| DB

DB --> Prisma[Prisma ORM]

Prisma --> HTTP
Prisma --> WS
```

---

# ⚡ Real-Time Drawing Flow

```mermaid
sequenceDiagram

participant A as User A
participant WS as WebSocket Server
participant DB as PostgreSQL
participant B as User B

A->>WS: Send drawing event
WS->>DB: Store event
WS->>B: Broadcast event
B->>B: Render stroke on canvas
```

This ensures:

• instant drawing updates  
• persistent event history  
• consistent canvas state across users

---

# 🔄 Room Join & Canvas Reconstruction

When a user joins a room, the stored drawing events are fetched and replayed.

```mermaid
sequenceDiagram

participant User
participant HTTP
participant DB
participant Canvas

User->>HTTP: Join room
HTTP->>DB: Fetch drawing events
DB->>HTTP: Return events
HTTP->>User: Send event history
User->>Canvas: Replay drawing events
```

This allows:

- persistent whiteboards
- consistent canvas state
- reliable collaboration

---

# 📊 Distributed Scaling Architecture

To support high concurrency, DrawNote can scale horizontally.

```mermaid
flowchart LR

Clients[Clients]

Clients -->|HTTP| LB1[Load Balancer]

LB1 --> H1[HTTP Server 1]
LB1 --> H2[HTTP Server 2]

H1 --> DB[(PostgreSQL)]
H2 --> DB

Clients -->|WebSocket| LB2[WS Load Balancer]

LB2 --> WS1[WebSocket Server 1]
LB2 --> WS2[WebSocket Server 2]

WS1 --> Redis[(Redis Pub/Sub)]
WS2 --> Redis

Redis --> WS1
Redis --> WS2
```

### Scaling Strategy

• Load balancers distribute traffic  
• Multiple WebSocket servers handle concurrent connections  
• Redis Pub/Sub synchronizes events across servers  

This architecture enables DrawNote to scale to **thousands of concurrent users**.

---

# 🛠 Tech Stack

## Frontend

- **Next.js**
- **React**
- **Tailwind CSS**
- **Framer Motion**
- **HTML Canvas API**

## Backend

- **Node.js**
- **Express.js**
- **WebSockets (ws)**
- **JWT Authentication**
- **Zod Validation**

## Database

- **PostgreSQL**
- **Prisma ORM**

## Monorepo

- **Turborepo**
- **Yarn Workspaces**

## Language

- **TypeScript**

---

# 📂 Project Structure

```
/
├── apps
│   ├── frontend
│   ├── http-backend
│   └── ws-backend
│
├── packages
│   ├── common
│   ├── db
│   ├── ui
│   └── config
│
└── turbo.json
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/PulkitSharma-Git/DrawNote.git
cd DrawNote
```

---

## Install Dependencies

```bash
yarn install
```

---

## Setup Environment Variables

Create `.env` files in:

```
apps/http-backend
apps/ws-backend
packages/db
```

Example:

```
DATABASE_URL=postgresql://user:password@localhost:5432/drawnote
JWT_SECRET=your_secret
```

---

## Setup Database

```
cd packages/db

npx prisma generate
npx prisma db push
```

---

## Run Development Servers

```
yarn dev
```

This launches:

• Next.js frontend  
• HTTP backend  
• WebSocket server  

---

# 📈 Performance Characteristics

DrawNote is optimized for:

• low latency real-time updates  
• scalable WebSocket communication  
• efficient canvas rendering  
• event-driven persistence model

---

# 🛣 Future Improvements

- Stroke size control
- Undo / redo functionality
- Tablet stylus support
- Improved mobile drawing experience
- Cursor presence indicators
- Export drawings (PNG / SVG)
- Redis-based event streaming for production scaling

---

# 👨‍💻 Author

**Pulkit Sharma**

GitHub  
https://github.com/PulkitSharma-Git

---

⭐ If you found this project interesting, consider starring the repository.
