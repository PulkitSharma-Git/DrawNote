# 🎨 DrawNote

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Node.js](https://img.shields.io/badge/Node.js-runtime-green)
![WebSockets](https://img.shields.io/badge/WebSockets-real--time-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-database-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-type--safe-blue)
![License](https://img.shields.io/badge/License-None-lightgrey)

**Brainstorm. Collaborate. Create.**

DrawNote is a **high-performance real-time collaborative whiteboard** designed for seamless brainstorming and visual collaboration.

It enables multiple users to **draw together in real-time**, powered by WebSockets and a scalable full-stack architecture.

🌐 **Live Demo**  
https://drawnote1.vercel.app

---

# 🎥 Demo

> Drag and drop your demo video below.

<!-- DROP DEMO VIDEO HERE -->

---

# 📸 Screenshots

> Drag and drop screenshots here.

```
assets/screenshot1.png
assets/screenshot2.png
```

Example:

```md
![Whiteboard](assets/screenshot1.png)
```

---

# ✨ Features

### 🎨 Real-Time Collaboration
Multiple users can draw on the same canvas simultaneously with instant synchronization.

### 🖌 Fluid Drawing Experience
Powered by the **HTML Canvas API** for smooth, low-latency rendering.

### 🏠 Room-Based Collaboration
Users can create and join rooms for organized brainstorming sessions.

### 🔒 Secure Authentication
JWT-based authentication system for user sessions.

### 📐 Shape Tools
Supports multiple drawing tools:

- Freehand drawing
- Rectangle
- Circle
- Line
- Eraser

### 🌌 Infinite Canvas
The workspace expands dynamically allowing unlimited drawing area.

### 👥 Multi-User Synchronization
Canvas updates are broadcast to all connected clients in real-time.

### 📱 Responsive Design
Works across desktop and mobile browsers.

---

# 🏗 System Architecture

DrawNote separates **HTTP APIs and real-time communication** to improve scalability and performance.

```mermaid
flowchart LR

Client[Client Browser - Next.js]

Client -->|HTTP Requests| HTTP[HTTP Backend - Express]

HTTP -->|Auth / Room Data| DB[(PostgreSQL)]

Client -->|WebSocket Connection| WS[WebSocket Server]

WS -->|Broadcast Drawing Events| Client

WS --> DB

DB --> Prisma[Prisma ORM]

Prisma --> HTTP
Prisma --> WS
```

### Components

**Frontend**
- Next.js application
- Canvas-based rendering engine
- Maintains WebSocket connection

**HTTP Backend**
- Handles authentication
- Room creation
- User management

**WebSocket Server**
- Broadcasts drawing events
- Synchronizes canvas state across users

**Database**
- Stores users
- Room metadata
- Drawing information

---

# ⚡ Real-Time Event Flow

```mermaid
sequenceDiagram

participant A as User A
participant WS as WebSocket Server
participant B as User B

A->>WS: Send drawing event
WS->>B: Broadcast drawing event
B->>B: Render on canvas
```

---

# 🚀 Scalable Architecture

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

- **Load balancers** distribute incoming traffic
- **Multiple WebSocket servers** enable horizontal scaling
- **Redis Pub/Sub** synchronizes events across servers

This architecture can support **thousands of concurrent users**.

---

# 🧠 Engineering Challenges

### 1️⃣ Real-Time Synchronization
Ensuring multiple users see identical canvas states in real time required an event-driven WebSocket architecture.

### 2️⃣ Efficient Canvas Rendering
Instead of syncing entire canvas states, only **drawing events** are transmitted to minimize bandwidth usage.

### 3️⃣ Multi-User Conflict Handling
Simultaneous drawing operations are broadcast and rendered sequentially to maintain consistency.

### 4️⃣ Monorepo Architecture
The project uses **Turborepo + Yarn Workspaces** to manage shared code and services across frontend and backend.

---

# 🛠 Tech Stack

## Monorepo Infrastructure
- **Turborepo**
- **Yarn Workspaces**

## Frontend
- **Next.js 15**
- **React**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React**
- **Canvas API**

## Backend
- **Node.js**
- **Express.js**
- **WebSockets (`ws`)**
- **JWT Authentication**
- **Zod validation**

## Database
- **PostgreSQL**
- **Prisma ORM**

## Language
- **TypeScript**

---

# 📂 Project Structure

```
/
├── apps/
│   ├── frontend/
│   ├── http-backend/
│   └── ws-backend/
│
├── packages/
│   ├── common/
│   ├── db/
│   ├── ui/
│   └── config/
│
└── turbo.json
```

---

# 🚀 Getting Started

## Prerequisites

- Node.js **v18+**
- **Yarn**
- **PostgreSQL**

---

## Clone the Repository

```bash
git clone https://github.com/PulkitSharma-Git/DrawNote.git
cd DrawNote
```

---

## Install Dependencies

```
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
JWT_SECRET=your_secret_key
```

---

## Setup Database

```
cd packages/db
npx prisma generate
npx prisma db push
```

---

## Run the Application

```
yarn dev
```

This launches:

- Next.js frontend
- HTTP backend
- WebSocket server

---

# 📈 Performance Characteristics

DrawNote is optimized for:

- Low-latency real-time updates
- Efficient canvas rendering
- Horizontal scaling
- High concurrent collaboration

---

# 🛣 Future Improvements

- Stroke size control
- Undo / redo functionality
- Tablet stylus support
- Improved mobile drawing experience
- Cursor presence indicators
- Export drawings (PNG / SVG)
- Redis event streaming for production scaling

---

# 👨‍💻 Author

**Pulkit Sharma**

GitHub  
https://github.com/PulkitSharma-Git

---

⭐ If you found this project interesting, consider **starring the repository**!