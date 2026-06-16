# 🚀 Sprintal - A Project Management Tool

> **A full-featured bilingual Kanban + Scrum + Agile project manager**  
> Built with AI Agent | React 19 || Persian & English | Dark & Light mode

![Version](https://img.shields.io/badge/version-1.0-blue?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## ✨ Features at a Glance

### 📋 Kanban Board
- Drag & drop tasks between columns
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
- **Burndown Chart** — ideal vs. actual line chart ✓
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

## 🌟 What Makes FlowBoard Special?

- ✅ **100% client-side** — no backend, no database, no cloud fees
- ✅ **Persian calendar support** — the only PM app with Solar Hijri dates
- ✅ **Bilingual UI** — seamless switch between English and Persian
- ✅ **All Agile ceremonies** — from daily board work to sprint retrospectives
- ✅ **Portfolio-ready** — clean architecture, modern stack, production-quality code

---

## 📄 License

**MIT** — Free to use, modify, and distribute.
