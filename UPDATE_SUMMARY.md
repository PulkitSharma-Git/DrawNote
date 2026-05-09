# Update Summary (Changelog)

This document provides a detailed summary of the logical changes, features, and fixes introduced to the DrawNote application across its commit history. It serves as a high-level changelog to track the project's evolution.

## Latest Updates (April 2026)

* **Canvas Synchronization fixes (`2d967cf`, `8e07514`)** 
  * Fixed an issue where erased shapes would not delete from the database and would reappear upon reloading.
  * Added structural shape IDs alongside WebSocket event listening to properly broadcast shape removals and coordinate updates (moving/resizing) in real-time across connected clients.

* **Room Management & Security (May 2026)**
  * **Room Deletion**: Added a dedicated `DELETE /room/:roomId` API endpoint that safely removes all associated drawing/chat records before deleting the room to prevent foreign key constraint errors. Updated the UI to feature a clear, accessible trash icon for room administrators.
  * **Link Sharing**: Added a convenient one-click "Share Link" button to room cards, copying the full absolute URL for easier invites.
  * **Security Strategy Outlined**: Evaluated the current open-access architecture where anyone with a room ID can join. Formulated and documented a comprehensive three-phase security strategy (Basic Access Control, Invite System, Real-Time Approval) inside `TechnicalAnalysis.md` to guide future iterations.

* **Social Canvas Tracking (`apps/ws-backend/src/index.ts`, `apps/frontend/components/Canvas.tsx`, `apps/frontend/components/RoomUsers.tsx`)**
  * Added a "People in Room" feature connecting active WebSocket presence with frontend UI.
  * The backend extracts connected `userId`s, fetches their display names from Prisma, and broadcasts `room_users` to dynamically manage Canvas connections. 
  * In instances where users hold concurrent tabs (multiple WebSocket connections for the same userId), the logic neatly dynamically de-duplicates the lists.
  * Extracted the dropdown tracking element into a standalone modular `RoomUsers.tsx` component.
  * Implemented a dynamic coloring system that hashes a user's unique ID to generate a consistent, beautiful tailwind background color (emerald, rose, purple, etc.) instead of fallback strict blue bubbles.
  * Deepened the UI glassmorphism effect across the Canvas buttons and drop-down by significantly increasing the backdrop-blur value and decreasing background layer opacity, allowing canvas drawings to remain beautifully visible beneath the cards.
  * Globally unified all UI panels (`Bar.tsx`, `Palette.tsx`, Canvas Zoom, and `RoomUsers.tsx`) to utilize a unified software translucent glassmorphism base (`bg-[#0b0d12]/80 backdrop-blur-sm`), keeping the dense dark app background color while applying a subtle blur.
  * Implemented GPU Layer Promotion across all canvas-top UI components using `will-change: transform` and hardware-accelerated transforms (`translateZ(0)`). This ensures 60fps fluid panning/scrolling by offloading the expensive glassmorphic blur calculations to the dedicated graphics processor.

  **WebSocket Payload Structure Changes:**
  
  *Old Structure:* Shapes were transmitted without identifiers and only sent as generic "chat" logs.
  ```json
  {
    "type": "chat",
    "message": {
      "shape": {
        "type": "rect",
        "x": 0,
        "y": 0,
        "width": 100,
        "height": 100,
        "color": "red-500"
      }
    },
    "roomId": "123"
  }
  ```
  
  *New Structure:* Shapes carry uniquely generated IDs, and the server now processes dedicated `erase` and `update` logic against the database dynamically matching those IDs.
  ```json
  // Drawing a Shape
  {
    "type": "chat",
    "message": {
      "shape": {
        "id": "1a2b3cz9...",
        "type": "rect",
        "x": 0,
        "y": 0,
        "width": 100,
        "height": 100,
        "color": "red-500"
      }
    },
    "roomId": "123"
  }
  
  // Updating a Shape (Move/Resize)
  {
    "type": "update",
    "shapeId": "1a2b3cz9...",
    "message": {
      "shape": {
        "x": 150,
        "y": 150,
        "width": 120,
        "height": 120
      }
    },
    "roomId": "123"
  }
  
  // Erasing a Shape
  {
    "type": "erase",
    "shapeId": "1a2b3cz9...",
    "roomId": "123"
  }
  ```

## March 2026

* **Canvas Interactivity & Tools (`8d743ed`, `e3f5e8b`)** 
  * Introduced selection, dragging, and resizing for plotted shapes.
  * Added the local eraser tool logic for removing geometries.
  * Implemented canvas navigation features including infinite zoom-in, zoom-out, and panning.
* **Auth & Backend Stability (`e3956aa`, `8810920`, `279d7c9`, `9ac2972`)**
  * Handled Prisma schema updates to correct user casting issues with UUID strings.
  * Resolved room collision states by ensuring that attempting to create an already-existing room gracefully returns the existing room's context instead of crashing.
  * General authentication logic improvements inside the backend.
* **Deployment & CI/CD Architecture (`4831ab1` to `9bf0384`)**
  * Migrated the repository package manager setups extensively (moving across PNPM and Yarn) to forcefully resolve Vercel deployment cache and fetch failures.
  * Added `prisma generate` to the Render backend build pipelines to ensure ORM types build cleanly in production environments.
  * Setup Render deployment blueprints and dynamic ports for horizontal scalability.
  * Updated Next.js to patch a critical Vercel CVE block.
* **Documentation (`508fbf3` to `11674a7`)**
  * Greatly enhanced the `README.md` with demonstration links, screenshots, badges, and a comprehensive breakdown of the application's features.
  * Removed deprecated SiSpinrilla spinner icons failing vercel builds.

## February 2025 – February 2026

* **Drawing Capabilities (`62519bb`, `bb61b26`, `56e5227`)**
  * Shipped the **Diamond**, **Pencil** (freehand drawing), and **Text** tools (featuring fixed sizing and fonts).
* **Application Interface & Tooling (`7c8434e`, `38effd0`, `62435cb`)**
  * Conducted a major UI overhaul, adding a modernized Toolbar interface and a dedicated Color Selector for all brush types.
* **Social & Access Components (`a01593c`, `491e60b`, `44ce8a8`)**
  * Rebuilt the authentication flow to include a fully functional Login Button.
  * Designed the User Profile card and "Previously Joined Rooms" cards allowing users to jump back into their recent sessions quickly.
  * Added Loading state indicators for slower network transitions.

## December 2025 - January 2026

* **Foundation & Redesign (`06d4873`, `1cbc830`, `88f8edb`)**
  * Initial layout structures and styling overhauls.
  * Redesigned the primary landing page components including the Hero Section, Navigation Bar, and Footer for a sleek, modern aesthetic.
