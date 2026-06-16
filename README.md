# 🚀 Sprintal - A Project Management Tool

> **A full-featured bilingual Kanban + Scrum + Agile project manager**  
> Built with React 19 | Persian & English | Dark & Light mode

![Version](https://img.shields.io/badge/version-2.0-blue?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## ✨ Features at a Glance

### 📋 Kanban Board
- Drag & drop tasks between columns (powered by `@dnd-kit`)
- Add, edit, delete tasks with title, description, priority, due date, labels, story points, epic & sprint association
- Add, rename, reorder, and delete columns
- **WIP Limits** — set maximum tasks per column; visual warning when exceeded ✓
- **Acceptance Criteria** — define and display per-task acceptance criteria ✓
- **Task Comments** — threaded comments on any task ✓
- Real-time assignee & sprint filter
- Visual indicators for overdue / due-soon tasks

### 🏷️ Product Backlog
- Manage user stories with priority, story points, labels, and epic association
- Filter by epic or unassigned status
- Send items directly to the board or assign to sprints

### 🚩 Sprints & Scrum
- Create time-boxed iterations with goals and date ranges (Persian or Gregorian)
- Sprint planning — assign backlog items, move stories to board
- Active sprint filter on the board
- **Burndown Chart** — ideal vs. actual line chart
- **Velocity Chart** — track completed points per sprint ✓
- Sprint completion — unfinished items automatically return to backlog

### ⚡ Epics
- Group related stories into epics with distinct color coding
- Visual epic indicator on every task card

### 📊 Dashboard & Analytics
- Stat cards: total items, in progress, overdue, completed
- Bar chart: tasks per column
- Pie chart: priority distribution
- Sprint burndown chart
- Label usage overview
- **User Workload** — per-user board tasks, backlog items, story points, overdue count with progress bar ✓
- **Velocity Chart** — completed story points per sprint ✓
- Overdue & due-soon task lists

### 👥 Role-Based Access
- **Admin** — full access to everything (board, backlog, sprints, epics, labels, users, meetings)
- **Member** — sees all items; can only drag & edit their own assigned tasks on the board

### 📅 Meetings
- Schedule meetings with title, date (Persian Solar Hijri or Gregorian), time, and description
- Badge count on sidebar for unheld meetings
- Add/edit meeting minutes after the meeting is held

### 📜 Activity Log
- Every action is logged: task moves, column changes, sprint completions, and more ✓
- Browse the full history at `/activity`

### 🌐 Bilingual (English / فارسی)
- Full RTL support with Vazirmatn Persian font
- Persian dates use **Solar Hijri (Shamsi)** calendar via `jalaali-js`
- Toggle language instantly from the header

### 🎨 Themes
- Dark & light mode with CSS custom properties
- Persistent preference stored in localStorage

### 💾 Persistence & Backup
- All data auto-saves to `localStorage` in real time
- **Export** your entire board as a downloadable JSON file ✓
- Reset to default sample data with one click

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Hooks, Context API, useReducer |
| **React Router v7** | Client-side routing, nested layouts |
| **@dnd-kit** | Drag & drop (tasks, columns, sorting) |
| **Recharts** | Bar, pie, line, and area charts |
| **Vite 8** | Lightning-fast build tool |
| **jalaali-js** | Solar Hijri date conversion |
| **CSS Custom Properties** | Theming (dark/light) |
| **localStorage** | Client-side persistence |

---

## 📁 Project Structure

```
src/
├── context/
│   ├── BoardContext.jsx    — Central state (useReducer + localStorage + activity log)
│   ├── AuthContext.jsx     — Login / logout / roles
│   ├── ThemeContext.jsx    — Dark/light theme
│   └── LanguageContext.jsx — English / Persian i18n
├── components/
│   ├── Layout.jsx          — Sidebar + Header + outlet
│   ├── Sidebar.jsx         — Navigation with SVG icons & badge counts
│   ├── Header.jsx          — User info, theme/lang toggle, reset & export
│   ├── Board.jsx           — Kanban board with DnD, sprint filter, WIP
│   ├── Column.jsx          — Droppable column with WIP badge
│   ├── TaskCard.jsx        — Draggable card with all metadata
│   ├── TaskModal.jsx       — Full task editor with comments & acceptance criteria
│   ├── Backlog.jsx         — Product backlog management
│   ├── Sprints.jsx         — Sprint lifecycle with date inputs
│   ├── Dashboard.jsx       — Charts, stats, workload, velocity
│   ├── MeetingsPage.jsx    — Meeting CRUD with minutes
│   ├── ActivityLogPage.jsx — Full activity history viewer
│   ├── EpicsPage.jsx       — Epic management (admin)
│   ├── LabelsPage.jsx      — Label management (admin)
│   ├── UsersPage.jsx       — User management with photo upload (admin)
│   ├── ProtectedRoute.jsx  — Auth & role gating
│   ├── LoginPage.jsx       — Login form with show/hide password
│   ├── DateInput.jsx       — Locale-aware date picker wrapper
│   ├── ShamsiDatePicker.jsx— Solar Hijri 3-select picker
│   ├── TimeInput.jsx       — Styled hour:minute picker
│   ├── PhotoUpload.jsx     — Styled avatar upload with preview
│   └── ConfirmModal.jsx    — Confirmation dialog
├── hooks/
│   └── useLocalStorage.js  — Generic localStorage hook
├── data/
│   └── seed.js             — Default board data & constants
├── i18n/
│   ├── en.js               — English translations
│   └── fa.js               — Persian translations
├── utils/
│   └── dateFormat.js       — Date formatting (Gregorian + Jalali)
├── App.jsx                 — Route definitions
├── main.jsx                — Entry point
└── index.css               — Complete stylesheet
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and log in with:

> **Admin** — `Admin` / `admin`  
> **Member** — `User` / `user`

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```

---

## 🧪 Default Login Credentials

| Role | Username | Password |
|---|---|---|
| 🛡️ Admin | `Admin` | `admin` |
| 👤 Member | `User` | `user` |
| 👤 Member | `Test` | `test` |

---

## 🌟 What Makes FlowBoard Special?

- ✅ **100% client-side** — no backend, no database, no cloud fees
- ✅ **Persian calendar support** — the only Kanban app with Solar Hijri dates
- ✅ **Bilingual UI** — seamless switch between English and Persian
- ✅ **All Agile ceremonies** — from daily board work to sprint retrospectives
- ✅ **Portfolio-ready** — clean architecture, modern stack, production-quality code

---

## 📄 License

**MIT** — Free to use, modify, and distribute.
