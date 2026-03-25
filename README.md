# DevTools

A responsive **offline-first PWA** for developers managing multiple projects — built with React, TypeScript, and Vite.

## Features

### 📌 Tasks (Kanban)
- GitHub Projects-inspired Kanban board with **To Do**, **In Progress**, and **Done** columns
- Drag-and-drop tasks between columns
- List view toggle
- Search and filter by project or tag
- Inline CRUD with quick actions on each card

### 📝 Notes
- Rich text editor powered by [TipTap](https://tiptap.dev)
- Supports headings, bold, italic, bullet lists, and ordered lists
- Associate notes with projects and tags

### 🌐 Translate
- Translate text between 9 languages (defaults to French)
- Powered by the [MyMemory Translation API](https://mymemory.translated.net)
- Keyboard shortcut: `Ctrl+Enter` to translate

### 🧩 Space (Infinite Canvas)
- Infinite pan & zoom canvas
- Create resizable note cards by double-clicking
- Connect cards with arrows
- Associate cards with projects

### 🏷️ Projects & Tags
- Shared across Tasks, Notes, and Space
- Projects have custom colors
- Tags are flexible labels (frontend, backend, design, etc.)

### 🌙 Dark Mode
- Toggle between light and dark themes
- Preference saved to localStorage

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS v3 |
| State | Zustand (localStorage persistence) |
| Drag & Drop | @hello-pangea/dnd |
| Rich Text | TipTap |
| PWA | vite-plugin-pwa + Workbox |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Deployment (Netlify)

The project includes a `netlify.toml` for one-click Netlify deployment:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

All routes are redirected to `index.html` for SPA routing.

## Architecture

```
src/
├── types/          # Shared TypeScript interfaces
├── store/          # Zustand stores (projects, tasks, notes, space)
├── hooks/          # Custom hooks (useTheme)
└── components/
    ├── layout/     # AppShell, TabNav
    ├── shared/     # ProjectPill, TagPill, Modals, ProjectManager, TagManager
    ├── tasks/      # KanbanBoard, KanbanColumn, TaskCard, TaskModal, ListView
    ├── notes/      # NotesTab, NotesList, NoteCard, NoteEditor
    ├── translate/  # TranslateTab
    └── space/      # SpaceTab, SpaceCard, ConnectionLine
```

## Data Storage

All data is stored locally using `localStorage` via Zustand's `persist` middleware — no backend or account required.

| Store | Key |
|-------|-----|
| Projects & Tags | `devtools-projects` |
| Tasks | `devtools-tasks` |
| Notes | `devtools-notes` |
| Space | `devtools-space` |

## PWA

The app works fully offline after the first visit. Assets are cached by a Workbox service worker. Translation requires an internet connection.
