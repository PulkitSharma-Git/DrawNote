# Frontend UI Components Directory Map

This directory contains all UI components used in the DrawNote frontend, organized logically by domain to separate application state, layouts, and presentational elements.

---

## 📂 Directory Structure

### 1. `ui/`

Generic, stateless, and reusable presentational primitive components. These are candidates for extraction into the workspace-wide `@repo/ui` shared package.

- `Button.tsx` / `Button2.tsx` - Reusable button shapes and color palettes.
- `Input.tsx` - Standard textual form inputs.
- `PasswordInput.tsx` - Secure password fields.
- `CustomModal.tsx` - Base overlay modal component.

### 2. `canvas/`

Drawing canvas rendering components, toolbars, and active session tools.

- `Canvas.tsx` - Main Canvas viewport setup and render loop.
- `RoomCanvas.tsx` - Wrapper that manages the WebSocket handshake and errors.
- `Bar.tsx` / `BarButton.tsx` - Drawing toolbar menu shell and icons.
- `Palette.tsx` / `ColorIcon.tsx` - Active color selections.
- `RoomUsers.tsx` - Dropdown showing active collaborators in the current room.

### 3. `auth/`

Forms, layouts, and page structures for signing in and signing up.

- `SignInCard.tsx` / `SignUpCard.tsx` - Form cards for user login/registration.
- `SignInLayout.tsx` / `SignUpLayout.tsx` - Structural wrappers for auth pages.
- `SignInPage.tsx` / `SignUpPage.tsx` - Composition page containers.

### 4. `dashboard/`

Components for room management, creation, and user status indicators.

- `Room.tsx` - Card showing individual room metadata and actions (Share, Delete).
- `Rooms.tsx` - Grid container layout for active rooms.
- `RoomForm.tsx` - Interface element for room lists/actions.
- `NewRoomModal.tsx` - Dialog container overlay to create/join rooms.
- `UserDetails.tsx` - Display user profile and logout buttons.

### 5. `home/`

Presentational panels and visuals specific to the marketing landing/home page.

- `MainSection.tsx` - Hero section, title, and action prompts.
- `BackgroundAnimation.tsx` - Decorative canvas shapes animation.

### 6. `layout/`

Scaffolding layout components that frame screens across the app.

- `Navbar.tsx` - Global page header navigation bar.
- `Footer.tsx` - Global footer links.
- `PageLayout.tsx` - Core container shell for page routes.

---

## ⚙️ Shared App Layout Widgets

- `ServerStatusCard.tsx` - Visual progress loader that polls backends and shows startup state.

---

## 🚀 Adding New Components

- If a component is a **primitive** (like a badge, selector, or switch), add it to `ui/`.
- If it is a **visual block** for the landing page, add it to `home/`.
- If it contains **canvas interactions**, place it in `canvas/`.
