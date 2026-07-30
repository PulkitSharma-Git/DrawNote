# Update Summary (Changelog)

This document provides a detailed summary of the logical changes, features, and fixes introduced to the DrawNote application across its commit history. It serves as a high-level changelog to track the project's evolution.

## Latest Updates (July 2026)

- **Optimistic Room Deletion with Undo Toast & Standalone Delete Room Modal**
  - Refactored [Room.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/dashboard/Room.tsx) to perform instant card removal from the frontend UI upon clicking delete.
  - Created a modular standalone [DeleteRoomModal.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/dashboard/DeleteRoomModal.tsx) component wrapping the `CustomModal` confirmation logic with a clean, simplified and concise warning prompt.
  - Designed and implemented [UndoToast.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/dashboard/UndoToast.tsx) at the bottom left with responsive layout configurations (centered width margins on mobile, bottom-left pinning on desktop), minimal text, a colorless/transparent Undo button (similar to the navbar sign-in style), and an optimized, butter-smooth hardware-accelerated progress bar transition (`transition: width 5000ms linear`) to replace stuttery React state updates.
  - Added robust state-preservation inside [join/page.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/app/join/page.tsx) to support optimistic deletion (restoring position exactly on Undo), immediate API dispatch when a new deletion begins, and cleanup triggers on unmount. Removed `await` on backend deletion triggers so that network latency does not block hiding the toast.
  - Created a reusable `DestructiveButton` component inside [DestructiveButton.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/ui/DestructiveButton.tsx) and integrated it inside both [DeleteRoomModal.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/dashboard/DeleteRoomModal.tsx) and [UserDetails.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/dashboard/UserDetails.tsx) to unify destructive action button styles.

- **Minimal User Details Dropdown Card Redesign & Loading Skeleton**
  - Redesigned the user profile card popup in [UserDetails.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/dashboard/UserDetails.tsx) that appears upon clicking the navbar avatar.
  - Added a premium skeleton loading state to the user details dropdown card matching its structural layout and incorporating a subtle gradient pulse effect to improve perceived load times.
  - Updated the navigation bar component [Navbar.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/layout/Navbar.tsx) to track client-side user details loading state and pass it down as a prop to the `UserDetails` component.
  - Implemented a sleek, solid deep-dark styling (`bg-[#0f1115] border border-white/10 shadow-2xl p-4`) that perfectly blends with the workspace theme colors and keeps the design solid.
  - Replaced the generic outline avatar icon with a personalized dynamic circular initials container, picking a deterministic gradient based on the hash of the user's name.
  - Cleaned up the dropdown list layout to be minimal and directly to the point, removing extra widgets and leaving just the profile name/email and a solid red Sign out action (`bg-red-600 hover:bg-red-500 text-white`) with a Lucide `LogOut` icon.
  - Updated the sign out button handler to trigger a full page reload by redirecting using `window.location.href = "/"` instead of client-side `router.push("/")` to ensure complete session state clearance.
  - Ported the identical custom initials gradient avatar generator and design system (matching dynamic presets and outlines) to the "People in Room" active user listing in [RoomUsers.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/canvas/RoomUsers.tsx) to establish visual identity consistency.

- **Navbar Animation and Room Skeleton UI Improvements**
  - Disabled the initial up-to-down slide entrance animation on the [Navbar.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/layout/Navbar.tsx) component when navigating to the rooms page (`/join`) by detecting the path using `usePathname()` from `next/navigation`.
  - Replaced the generic, low-fidelity spinner loading indicator on the rooms list page [join/page.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/app/join/page.tsx) with a grid of 6 pulsing skeleton cards.
  - Created a new [RoomSkeleton.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/dashboard/RoomSkeleton.tsx) component, matching the visual geometry and using the same hover gradient background (`bg-gradient-to-br from-orange-500/20 via-red-500/10 to-blue-500/20`) of active [Room.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/dashboard/Room.tsx) cards (configured with `opacity-70` to make it softer).
  - Removed the thin border outlines (`border border-white/10` and hover variants) from the arrow icon container on both the active [Room.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/dashboard/Room.tsx) card and [RoomSkeleton.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/dashboard/RoomSkeleton.tsx) placeholders to clean up the card interface.
  - Fixed a potential type discrepancy crash on numeric room IDs (`room.id`) by converting them to string format before rendering or running deletion state filters.
  - Extracted the empty state drawing illustration into a standalone [EmptyState.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/dashboard/EmptyState.tsx) component with minimal text ("NO ROOMS YET") and no redundant CTA button, refactoring the artwork into a high-fidelity vector SVG showing a drawing easel canvas and paintbrush.
  - Redesigned the landing home page hero section [MainSection.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/home/MainSection.tsx) to use a responsive split layout (left-aligned content panel on the left, vector graphics illustration on the right).
  - Built and inlined an interactive collaborative whiteboard canvas SVG graphic, expanding the layout to a spacious 600x450 coordinate space with separated drawing details and perfectly aligned synchronized animations.
  - Added synchronized CSS keyframe stroke-dash, transform-origin scale, and group transform animations to simulate lasso lines being drawn in sync with Sarah's cursor, a rectangle scaling small-to-big as Alex drags it out, and the stylus marker tip matching the curved connector path coordinates (configured with a `linear` timing function to guarantee lockstep precision and eliminate ease lag).
  - Removed the polygon arrowhead overlay from the connector line.

- **Canvas Drawing Tool Sizing & Font Customization Features**
  - Integrated 3 Thickness Options: Thin (2px), Medium (5px), and Thick (10px) inside shape and pencil line drawings, using horizontal line segments (short strokes) inside the toolbar settings to visually indicate line widths instead of dots.
  - Configured `"Comic Sans MS", "Comic Neue", cursive` as the default font for all text canvas elements.
  - Refactored [Palette.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/canvas/Palette.tsx) to remove divider lines (hairlines), font family selectors, and redundant "Color" and "Thickness" text labels, keeping the UI layout ultra-minimal and focused.
  - Configured state propagation hooks inside [Canvas.tsx](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/canvas/Canvas.tsx) and updated [Game.ts](file:///Users/mac/Desktop/DrawNote/apps/frontend/draw/Game.ts) to track active line thickness.
  - Completely resolved all text-rendering coordinate drifts (where text shifted when committed to canvas) by drawing the input text on the canvas in real-time while typing in a transparent HTML overlay div, keeping the coordinates and rendering engine perfectly consistent and eliminating any switches or jumping.
  - Softened geometric shapes and freehand pencil strokes by configuring round line joins/caps (`lineJoin = "round"; lineCap = "round"`), rendering smooth rounded rectangles (`roundRect` with 12px radii), and interpolating jagged pencil strokes using quadratic Bezier curve equations.
  - Redesigned the Eraser tool into a circular cursor dot (`cursor: none` hidden system pointer) that draws a semi-transparent red trail representing its erase coordinates path, automatically clearing when the click is lifted.
  - Fixed the circle tool quadrant scaling bug by calculating the radius and center coordinates using absolute mouse dragging delta values, enabling smooth 4-directional circle growth in all quadrants.

- **Safe Shape Parsing & Crash Prevention**
  - Updated `getExistingShapes` in `apps/frontend/draw/http.ts` to safely parse message records retrieved from the database, filtering out any records that do not contain a valid serialized `shape` object (e.g. text chat messages) to prevent `undefined` shape references.
  - Wrapped JSON parsing inside `initHandlers()` in `apps/frontend/draw/Game.ts` in a try-catch block to ignore standard chat text WebSocket events and prevent websocket handler crashes.
  - Added safety checks in `clearCanvas()` in `apps/frontend/draw/Game.ts` to check if a shape is valid and skip any rendering if it is undefined or lacks a type, falling back to a default `"white"` drawing color when a shape lacks a color.

- **Dashboard Redesign**
  - Removed the large `RoomForm` landing card from the dashboard (`page.tsx`) to prioritize the rooms list.
  - Shipped a clean, centered container layout (`max-w-6xl`) with improved spacing.
  - Integrated a "+ New Room" button aligned with the "Your Rooms" heading, reusing the existing `Button` component exactly as-is.
  - Created custom `CustomModal` and `NewRoomModal` components utilizing pure React state and Tailwind CSS (no external UI libraries) to manage Create/Join forms within an accessible, tabbed dialog interface.
  - Added `type` prop support to the primary `Button` component to ensure smooth form submissions via keyboard enter key.
  - Refactored the Room card design (`Room.tsx`):
    - Increased height and padding (`p-6`).
    - Enhanced typography hierarchy (bold title, smaller muted ID). Removed description text ("Collaborative canvas") and centered header elements vertically.
    - Added high-quality hover transitions (translateY by -4px, shadow, border glow, and subtle arrow shifting).

- **Server Wake-up & Health Check Status UI**
  - Added a `/health` endpoint to `http-backend` (Express) returning a simple status JSON.
  - Added a `/health` endpoint and CORS OPTIONS handler to `ws-backend` by wrapping the WebSocket server in an `http.createServer` instance.
  - Shipped a beautiful client-side `<ServerStatusCard />` component in the frontend featuring a clean, minimal design with a thick gradient progress loader bar at the top.
  - The status card polls both backend endpoints to wake them up when the user first opens the page and automatically hides itself with Framer Motion once they are online.
  - Updated the server status card loader progress behavior: the progress bar now smoothly and dynamically increments from 10% up to 90% over a 60-second duration during the booting/connecting phase, and immediately "rushes to complete" (jumps to 100%) as soon as a healthy poll is received from the backend servers.

- **Scalability & Voice/Video Call Strategy**
  - Created a comprehensive feasibility report and strategy guide ([feasibility_report.md](file:///Users/mac/.gemini/antigravity-ide/brain/cd5a1309-8bf1-4e48-904b-ca2f30cc4b0d/feasibility_report.md)) for scaling DrawNote rooms horizontally and integrating WebRTC calling services.
  - Formulated mapping of existing services (HTTP APIs, WebSockets, DB, WebRTC, Signaling) onto the Oracle Cloud Infrastructure (OCI) Always Free Tier resources (as of July 2026 limits).
  - Outlined horizontal scaling strategy using Redis Pub/Sub, Nginx Load Balancers, and database write debouncing/buffering.
  - Evaluated and detailed WebRTC topologies (P2P mesh vs. self-hosted SFU LiveKit vs. SaaS Agora) including CPU, RAM, and bandwidth requirements.
  - Created a step-by-step 7-phase incremental migration plan ([migration_plan.md](file:///Users/mac/.gemini/antigravity-ide/brain/cd5a1309-8bf1-4e48-904b-ca2f30cc4b0d/migration_plan.md)) to slowly transition HTTP and WebSocket backend services onto OCI with zero-downtime cross-platform synchronization, while keeping Neon DB as the primary managed database.
  - Conducted a deep-dive codebase review and generated a production-grade analysis report ([production_grade_analysis.md](file:///Users/mac/.gemini/antigravity-ide/brain/cd5a1309-8bf1-4e48-904b-ca2f30cc4b0d/production_grade_analysis.md)) highlighting critical security vulnerabilities (plaintext password storage, non-expiring JWTs, room access leaks), reliability gaps (WebSocket reconnect logic, input validations), and performance bottlenecks (canvas layer optimization).
  - Developed a comprehensive design system conversion plan ([design_system_plan.md](file:///Users/mac/.gemini/antigravity-ide/brain/cd5a1309-8bf1-4e48-904b-ca2f30cc4b0d/design_system_plan.md)) to modularize scattered local frontend React components into a shared, un-prefixed Tailwind CSS component library inside the `@repo/ui` package.
  - **Frontend UI Component Reorganization:**
    - Restructured the flat `apps/frontend/components/` folder by sorting 29+ components into six domain-specific folders (`ui/`, `canvas/`, `auth/`, `dashboard/`, `home/`, `layout/`).
    - Renamed `Input1.tsx` to `Input.tsx` and updated the exports to standard `Input` conventions.
    - Added [README.md](file:///Users/mac/Desktop/DrawNote/apps/frontend/components/README.md) inside the components folder to document folder content mappings and onboarding guidelines.
    - Rewrote and compiled all cross-component imports and page layout routes in Next.js, verifying building with Turborepo (`yarn build`).

## Latest Updates (April 2026)

- **Canvas Synchronization fixes (`2d967cf`, `8e07514`)**
  - Fixed an issue where erased shapes would not delete from the database and would reappear upon reloading.
  - Added structural shape IDs alongside WebSocket event listening to properly broadcast shape removals and coordinate updates (moving/resizing) in real-time across connected clients.

- **Room Management & Security (May 2026)**
  - **Room Deletion**: Added a dedicated `DELETE /room/:roomId` API endpoint that safely removes all associated drawing/chat records before deleting the room to prevent foreign key constraint errors. Updated the UI to feature a clear, accessible trash icon for room administrators.
  - **Link Sharing**: Added a convenient one-click "Share Link" button to room cards, copying the full absolute URL for easier invites.
  - **Security Strategy Outlined**: Evaluated the current open-access architecture where anyone with a room ID can join. Formulated and documented a comprehensive three-phase security strategy (Basic Access Control, Invite System, Real-Time Approval) inside `TechnicalAnalysis.md` to guide future iterations.

- **Social Canvas Tracking (`apps/ws-backend/src/index.ts`, `apps/frontend/components/Canvas.tsx`, `apps/frontend/components/RoomUsers.tsx`)**
  - Added a "People in Room" feature connecting active WebSocket presence with frontend UI.
  - The backend extracts connected `userId`s, fetches their display names from Prisma, and broadcasts `room_users` to dynamically manage Canvas connections.
  - In instances where users hold concurrent tabs (multiple WebSocket connections for the same userId), the logic neatly dynamically de-duplicates the lists.
  - Extracted the dropdown tracking element into a standalone modular `RoomUsers.tsx` component.
  - Implemented a dynamic coloring system that hashes a user's unique ID to generate a consistent, beautiful tailwind background color (emerald, rose, purple, etc.) instead of fallback strict blue bubbles.
  - Deepened the UI glassmorphism effect across the Canvas buttons and drop-down by significantly increasing the backdrop-blur value and decreasing background layer opacity, allowing canvas drawings to remain beautifully visible beneath the cards.
  - Globally unified all UI panels (`Bar.tsx`, `Palette.tsx`, Canvas Zoom, and `RoomUsers.tsx`) to utilize a unified software translucent glassmorphism base (`bg-[#0b0d12]/80 backdrop-blur-sm`), keeping the dense dark app background color while applying a subtle blur.
  - Implemented GPU Layer Promotion across all canvas-top UI components using `will-change: transform` and hardware-accelerated transforms (`translateZ(0)`). This ensures 60fps fluid panning/scrolling by offloading the expensive glassmorphic blur calculations to the dedicated graphics processor.

  **WebSocket Payload Structure Changes:**

  _Old Structure:_ Shapes were transmitted without identifiers and only sent as generic "chat" logs.

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

  _New Structure:_ Shapes carry uniquely generated IDs, and the server now processes dedicated `erase` and `update` logic against the database dynamically matching those IDs.

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

- **Canvas Interactivity & Tools (`8d743ed`, `e3f5e8b`)**
  - Introduced selection, dragging, and resizing for plotted shapes.
  - Added the local eraser tool logic for removing geometries.
  - Implemented canvas navigation features including infinite zoom-in, zoom-out, and panning.
- **Auth & Backend Stability (`e3956aa`, `8810920`, `279d7c9`, `9ac2972`)**
  - Handled Prisma schema updates to correct user casting issues with UUID strings.
  - Resolved room collision states by ensuring that attempting to create an already-existing room gracefully returns the existing room's context instead of crashing.
  - General authentication logic improvements inside the backend.
- **Deployment & CI/CD Architecture (`4831ab1` to `9bf0384`)**
  - Migrated the repository package manager setups extensively (moving across PNPM and Yarn) to forcefully resolve Vercel deployment cache and fetch failures.
  - Added `prisma generate` to the Render backend build pipelines to ensure ORM types build cleanly in production environments.
  - Setup Render deployment blueprints and dynamic ports for horizontal scalability.
  - Updated Next.js to patch a critical Vercel CVE block.
- **Documentation (`508fbf3` to `11674a7`)**
  - Greatly enhanced the `README.md` with demonstration links, screenshots, badges, and a comprehensive breakdown of the application's features.
  - Removed deprecated SiSpinrilla spinner icons failing vercel builds.

## February 2025 – February 2026

- **Drawing Capabilities (`62519bb`, `bb61b26`, `56e5227`)**
  - Shipped the **Diamond**, **Pencil** (freehand drawing), and **Text** tools (featuring fixed sizing and fonts).
- **Application Interface & Tooling (`7c8434e`, `38effd0`, `62435cb`)**
  - Conducted a major UI overhaul, adding a modernized Toolbar interface and a dedicated Color Selector for all brush types.
- **Social & Access Components (`a01593c`, `491e60b`, `44ce8a8`)**
  - Rebuilt the authentication flow to include a fully functional Login Button.
  - Designed the User Profile card and "Previously Joined Rooms" cards allowing users to jump back into their recent sessions quickly.
  - Added Loading state indicators for slower network transitions.

## December 2025 - January 2026

- **Foundation & Redesign (`06d4873`, `1cbc830`, `88f8edb`)**
  - Initial layout structures and styling overhauls.
  - Redesigned the primary landing page components including the Hero Section, Navigation Bar, and Footer for a sleek, modern aesthetic.
