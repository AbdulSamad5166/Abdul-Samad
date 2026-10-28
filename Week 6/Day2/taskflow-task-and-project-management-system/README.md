# TaskFlow — Modern Task & Project Management System

TaskFlow is a production-quality, multi-page Task Management System dashboard engineered with React, TypeScript, Vite, Tailwind CSS, TanStack Query, Axios, and Zod. It features an offline-first architecture synchronized with the DummyJSON REST API, full Kanban boards, interactive analytics, subtask checklists, and a customizable multi-accent theme system with zero-flash rendering.

---

## 🚀 Quick Start (VS Code / Local Machine)

To run this project locally:

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Build for production
npm run build
```

The application runs at `http://localhost:3000`.

---

## 👤 User Registration & Authentication

TaskFlow provides isolated, per-user workspace persistence:

1. **Sign Up**: Navigate to `/register` and create your account with your name, email, and password. Strict Zod validation and a real-time password strength meter guide you.
2. **Sign In**: Navigate to `/login` to sign in with your credentials.
3. **Clean Workspace Onboarding**: New users start with a clean slate (0 tasks, 0 projects). You can immediately create your own tasks or click **Sync Tasks from API** to import items from the DummyJSON REST API.
4. **Isolated Storage**: All tasks, projects, settings, and deletion tombstones are partitioned per user (`taskflow_tasks_${userId}`) in browser `localStorage`.
5. **Password storage**: Passwords are hashed client-side with SHA-256 via Web Crypto because the app has no backend; this is not server-side password security.

---

## 🌟 Key Features

1. **Dashboard & Analytics**:
   - High-contrast KPI stat cards (Total, Pending, In Progress, Completed, Overdue).
   - Circular completion progress ring in pure SVG.
   - Status distribution Bar Chart built in pure SVG.
   - Priority severity breakdown Donut Chart in pure SVG.
   - Recent tasks activity stream and upcoming/due today countdown.
   - Real-time Sync button with status indicators.

2. **Full CRUD Task Management**:
   - Title, multi-line description, status, priority, due date, project category, and `#tags`.
   - Multi-filtering by status, priority, project, and timeline (Overdue, Due Today, This Week, Upcoming).
   - Debounced search (250ms) across titles, descriptions, and tags.
   - Sorting by creation date, due date, priority, or title (ascending and descending).
   - Client-side pagination with dynamic page calculations.
   - Grid and List (table) view switcher.
   - "Load More from API (+10)" pagination button.

3. **Multi-Select Bulk Operations**:
   - Floating action bar for multi-task selection.
   - Bulk mark as Completed.
   - Bulk move to In Progress.
   - Bulk delete with confirmation dialog.

4. **Task Details & Collaboration**:
   - Subtask checklist with live percentage progress bar.
   - Discussion / Notes timeline with author and relative timestamps.
   - Audit activity log tracking every change.

5. **Kanban Workflow Board**:
   - 3-column workflow (Pending, In Progress, Completed).
   - Column-specific task creation.
   - Quick column status switching.

6. **Projects & Categories**:
   - Color-coded badges and category progress bars.
   - Create, edit, and delete projects.

7. **Native Date Calendar**:
   - Monthly calendar grid calculated using native `Date` and `Intl` APIs (zero date library dependencies).
   - Interactive day selection displaying scheduled tasks.

8. **Theme & Customization System**:
   - **Appearance Modes**: Light, Dark, and System (automatically synchronizes with operating system theme changes).
   - **6 Functional Accent Themes**: Indigo (default), Emerald, Rose, Amber, Sky, and Violet (plus Ocean Teal).
   - **Density**: Comfortable and Compact.
   - **Zero Flash of Unstyled Content (FOUC)**: Pre-render script in `<head>` applies classes and attributes before React mounts.
   - Fully synchronized between Navbar quick-pickers and the Settings page.

9. **Robust Data & API Sync System**:
   - **Real-Time UI**: Navbar refresh button, Dashboard sync button, Tasks page sync button with animated spin.
   - **Relative Timestamps**: Formatted with `Intl.RelativeTimeFormat`, auto-refreshed every 60 seconds.
   - **Online / Offline Detection**: Real-time listeners update network pills and gracefully fall back to local storage when offline.
   - **Idempotent Merging**: Intelligent merge algorithm preserves user-edited tasks, retains custom local tasks, drops deleted items via tombstones, and absorbs new remote items.
   - **Data & Sync Settings**: Auto-sync background interval (1m, 5m, 15m, Off), manual "Sync Now", "Re-import Missing Tasks", and "Reset to Fresh API Data".

10. **Accessibility & Code Quality**:
    - Strictly typed in TypeScript with checked unused symbols.
    - Full keyboard navigation and accessible focus rings.
    - Native SVG icons and charts without heavy external libraries.

---

## 📁 Folder Structure

```
task-management-system/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── src/
    ├── app/
    │   ├── queryClient.ts       # TanStack Query client configuration
    │   ├── providers.tsx         # Combined React Context & Query providers
    │   └── router.tsx            # Protected & Public routing with React.lazy
    ├── components/
    │   ├── charts/               # Pure SVG BarChart, DonutChart, ProgressRing
    │   ├── dashboard/            # StatCard, RecentTasks, UpcomingTasks
    │   ├── icons/                # Accessible inline SVG icons
    │   ├── layout/               # Sidebar, Navbar, MobileDrawer, PageHeader, DashboardLayout
    │   ├── tasks/                # TaskCard, TaskRow, TaskForm, TaskFilters, TaskBoard, SubtaskList, BulkActionBar
    │   └── ui/                   # Reusable UI primitives (Button, Input, Select, Modal, Toast, etc.)
    ├── context/                  # AuthContext, ThemeContext, SyncContext, ToastContext
    ├── hooks/                    # useAuth, useTheme, useSync, useToast, useTasks, useProjects, useDebounce
    ├── pages/                    # Multi-page views (Dashboard, Tasks, TaskDetail, Board, Projects, Calendar, Profile, Settings, Login, Register, 404)
    ├── schemas/                  # Zod validation schemas
    ├── services/                 # Axios client, taskService, projectService, authService, syncService, storage
    ├── types/                    # Shared TypeScript interfaces & models
    ├── utils/                    # Pure dateHelpers, formatters, sortingFiltering, constants, mergeTasks
    ├── App.tsx                   # Main React entry component
    └── main.tsx                  # DOM root mounting
```

---

## 🔄 API Synchronization Details

- API Endpoint: `https://dummyjson.com/todos`
- Tasks modified locally receive `locallyModified: true` and are never overwritten by subsequent sync calls.
- Deletions are recorded in user tombstones (`taskflow_tombstones_${userId}`) to prevent resurrecting deleted API tasks.
- If network connectivity is lost, TaskFlow seamlessly switches to offline mode with full local read/write capabilities and syncs when reconnected.
