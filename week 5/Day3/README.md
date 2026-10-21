# StockPilot — Sales & Inventory Dashboard
### Week 4 Project: Tailwind CSS & Professional UI Component Library

StockPilot is a modern, responsive sales and inventory management dashboard built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**. It features an accessible, reusable UI component library engineered with type-safety, responsive layouts, subtle micro-interactions, dark mode persistence, and WCAG-aligned accessibility standards.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Project Objectives](#project-objectives)
3. [Technologies Used](#technologies-used)
4. [Features & Dashboard Functionality](#features--dashboard-functionality)
5. [Week 4 Concepts Demonstrated](#week-4-concepts-demonstrated)
6. [Project Folder Structure](#project-folder-structure)
7. [Installation & Setup Instructions](#installation--setup-instructions)
8. [Available Scripts & Commands](#available-scripts--commands)
9. [Reusable UI Component Library](#reusable-ui-component-library)
10. [Responsive Design & Accessibility](#responsive-design--accessibility)
11. [Screenshots & UI Showcase](#screenshots--ui-showcase)
12. [Git & GitHub Repository Setup](#git--github-repository-setup)

---

## 1. Project Overview

StockPilot provides operational intelligence for inventory and order management. Originating in **Day 3** as a utility-first Tailwind CSS prototype, it was expanded in **Day 4** with an enterprise-grade UI component library and finalized in **Day 5** with TypeScript type-safety revisions, keyboard accessibility, and production verification.

---

## 2. Project Objectives

- **Modular UI Component Architecture**: Extract repetitive dashboard elements into isolated, type-safe, and composable UI components.
- **Utility-First Styling**: Implement zero-runtime CSS with modern Tailwind CSS v4, maintaining strict design consistency.
- **End-to-End Type Safety**: Leverage TypeScript strict mode for data schemas, component props, and event handlers.
- **Accessible Interactions (A11y)**: Adhere to WCAG standards with semantic markup, ARIA roles, visible focus indicators, and complete keyboard navigation.
- **Seamless Responsiveness**: Deliver an optimal layout across mobile devices, tablets, and wide desktop displays.

---

## 3. Technologies Used

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode, ES2023 target)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Linter & Code Quality**: [ESLint 10](https://eslint.org/) with `typescript-eslint` and React Hooks rules

---

## 4. Features & Dashboard Functionality

### 🪟 Modern Glassmorphism Aesthetic
- **Frosted Glass Panels**: Semi-transparent card surfaces (`backdrop-blur-xl`, `border-white/60 dark:border-slate-800/80`) with soft specular reflections.
- **Ambient Gradient Orbs**: Vibrant glowing radial background gradients (cyan, indigo, emerald) refracting through translucent glass layers.

### 📈 Interactive Revenue & Sales Analytics Chart
- **Custom Responsive SVG Chart**: Vector-based area chart rendering smooth bezier lines, gradient fills, and data points with hover values.
- **Timeframe Selector**: Interactive switching between **7D**, **30D**, and **90D** viewports.
- **Key Performance Telemetry**: Real-time display of Average Order Value (`$69.80`), Conversion Rate (`3.4%`), and Fulfillment Velocity (`1.2 Days`).

### 📊 KPI Performance Telemetry
- **Real-Time Cards**: Total Revenue (`$24,850`), Total Products (`1,248`), Total Orders (`356`), and Low Stock Items (`12`).
- **Trend Indicators & Sparklines**: Visual color cues for positive gains (emerald), catalog metrics (blue), and critical thresholds (amber) with sparkline bar charts.

### 📦 Live Inventory Management & Inline Stock Adjustments
- **Quick Stock Counter (+ / -)**: Increment or decrement inventory directly from the table rows with instant feedback and toast alerts.
- **Dynamic Status Auto-Toggles**: Items automatically switch between "In Stock" and "Low Stock" when crossing the threshold (≤10 units).
- **Search Filtering**: Real-time multi-field search across product names and categories with instant table updates.
- **Status Tabs**: Fast filtering between **All Items**, **In Stock**, and **Low Stock** with dynamic count badges.
- **Table Actions Dropdown**: Interactive dropdown menu to sort products by stock count, sort by price, trigger CSV export, or reset sample data.
- **Add Product Modal**: Accessible modal form with required field validation, category selection, price input, and instant table insertion.

### 🔔 Notification Drawer & Operations Audit Feed
- **Notification Flyout**: Top navigation bell with live unread counter badge (3) opening an interactive system notification flyout.
- **Operations Audit Stream**: Real-time activity timeline tracking shipments, order fulfillments, and stock adjustments.
- **Inventory Health Score Widget**: Live gauge displaying operational stock health (e.g., 75% health score across total inventory units).

---

## 5. Week 4 Concepts Demonstrated

### Day 3: Tailwind CSS Fundamentals
- Utility-first CSS classes replacing custom stylesheets.
- Typography scale (`text-xs` to `text-3xl`), font weights (`medium` to `extrabold`), tracking, and uppercase styling.
- Spacing rhythm (`p-*`, `px-*`, `py-*`, `m-*`, `gap-*`).
- Curated color palettes (`slate`, `blue`, `emerald`, `amber`, `rose`).
- Rounded corners (`rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`) and shadows (`shadow-xs` through `shadow-xl`).
- Flexbox and CSS Grid layout utilities with responsive breakpoint modifiers (`sm:`, `md:`, `lg:`, `xl:`).
- Dark mode configuration using Tailwind v4 `@custom-variant dark`.

### Day 4: Professional UI Development & Component Library
- Creation of an isolated component library in `src/components/`.
- Reusable buttons supporting variants (`primary`, `secondary`, `outline`, `danger`), sizes (`sm`, `md`, `lg`), and hover/focus/disabled states.
- Reusable card wrappers and subcomponents (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
- Form inputs with accessible labels, helper text, and validation states (`error`, `success`, `default`).
- Accessible modal dialogs with backdrop blur, Escape key dismissal, and focus management.
- Dropdowns with click-outside dismissal and keyboard arrow navigation.
- Accessible tabs (`role="tablist"`, `role="tab"`, `aria-selected`).
- Semantic alert banners (`role="alert"`) with variant styling.
- Status badges with dot indicators.
- Animated loading skeleton placeholders (`animate-pulse`).

### Day 5: Project & Revision
- Strict TypeScript contracts and type-safe event handlers (`React.FormEvent`, `React.KeyboardEvent`, `React.MouseEvent`).
- Comprehensive accessibility audit (ARIA attributes, keyboard navigation, visible focus indicators).
- Production build validation (`tsc -b && vite build`) and zero-warning linting (`eslint .`).
- Git repository hygiene and `.gitignore` configuration.

---

## 6. Project Folder Structure

```text
Day3/
├── .gitignore               # Git ignore rules (node_modules, dist, .env, logs)
├── index.html               # Application HTML entry point
├── package.json             # Project dependencies and script definitions
├── package-lock.json        # Deterministic dependency tree
├── tsconfig.json            # Base TypeScript configuration
├── tsconfig.app.json        # Application-specific compiler options
├── tsconfig.node.json       # Node environment compiler options
├── vite.config.ts           # Vite bundler configuration with Tailwind plugin
├── eslint.config.js         # ESLint configuration with TypeScript & React plugins
├── README.md                # Comprehensive documentation (this file)
├── public/                  # Static assets
└── src/
    ├── main.tsx             # React application root mounting point
    ├── index.css            # Tailwind CSS import & @custom-variant dark definition
    ├── App.tsx              # Main dashboard application consuming component library
    └── components/          # Reusable UI Component Library
        ├── index.ts         # Centralized barrel export
        ├── uiPatterns.ts    # Day 3 CSS pattern strings (preserved for compatibility)
        ├── Button.tsx       # Reusable button component
        ├── Card.tsx         # Card container & subcomponents
        ├── Input.tsx        # Accessible form input with validation
        ├── Modal.tsx        # Accessible modal dialog with focus management
        ├── Dropdown.tsx     # Dropdown menu with click-outside & keyboard support
        ├── Navigation.tsx   # Sidebar & mobile navigation component
        ├── Tabs.tsx         # Tablist & tab filtering component
        ├── Alert.tsx        # Semantic alert banners
        ├── Badge.tsx        # Status & category pill badges
        └── Skeleton.tsx     # Skeleton loading placeholders
```

---

## 7. Installation & Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### Steps
1. Clone or download the repository to your local machine:
   ```bash
   git clone <repository-url>
   cd Day3
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```

---

## 8. Available Scripts & Commands

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server at `http://localhost:5173/` with hot module replacement (HMR). |
| `npm run build` | Runs TypeScript type-checks (`tsc -b`) and builds the production bundle into `/dist`. |
| `npm run lint` | Runs ESLint across all TypeScript and React files to verify code quality. |
| `npm run preview` | Locally serves the production build from `/dist` for testing. |

---

## 9. Reusable UI Component Library

All components are located in `src/components/` and exported via `src/components/index.ts`.

### 1. Button (`<Button />`)
- **Props**: `variant` (`'primary' | 'secondary' | 'outline' | 'danger'`), `size` (`'sm' | 'md' | 'lg'`), `icon`, `disabled`, `children`.
- **States**: Interactive hover, active scale (`active:scale-95`), visible focus ring (`focus-visible:ring-2`), and disabled opacity.
- **Example**:
  ```tsx
  <Button variant="primary" size="md" onClick={handleSave}>
    Save Product
  </Button>
  ```

### 2. Card (`<Card />`)
- **Subcomponents**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- **Props**: `hoverable` (boolean), `className`, `children`.
- **Example**:
  ```tsx
  <Card hoverable={true}>
    <CardHeader>
      <CardTitle>Total Revenue</CardTitle>
      <CardDescription>Monthly overview</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-extrabold">$24,850</p>
    </CardContent>
  </Card>
  ```

### 3. Input (`<Input />`)
- **Props**: `label`, `error`, `helperText`, `state` (`'default' | 'error' | 'success'`), `icon`, `required`.
- **Accessibility**: Binds `<label>` with `htmlFor`, sets `aria-invalid`, and links descriptions with `aria-describedby`.
- **Example**:
  ```tsx
  <Input
    label="Product Name"
    placeholder="e.g. Ergonomic Keyboard"
    value={name}
    onChange={(e) => setName(e.target.value)}
    error={errorText}
    required
  />
  ```

### 4. Modal (`<Modal />`)
- **Props**: `isOpen`, `onClose`, `title`, `description`, `footer`, `maxWidth`, `children`.
- **Accessibility**: Uses `role="dialog"`, `aria-modal="true"`, listens for `Escape` key, locks body scroll, and traps focus.
- **Example**:
  ```tsx
  <Modal
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    title="Add New Inventory Product"
    footer={<Button onClick={handleSubmit}>Save</Button>}
  >
    <form>{/* Form fields */}</form>
  </Modal>
  ```

### 5. Dropdown (`<Dropdown />`)
- **Props**: `trigger`, `items` (array with `id`, `label`, `icon`, `onClick`, `danger`, `disabled`), `align`.
- **Accessibility**: Includes `aria-haspopup="menu"`, `aria-expanded`, click-outside dismissal, and keyboard arrow navigation.
- **Example**:
  ```tsx
  <Dropdown
    trigger={<Button variant="secondary">Actions ▾</Button>}
    items={[
      { id: 'export', label: 'Export CSV', onClick: handleExport },
      { id: 'delete', label: 'Delete All', danger: true, onClick: handleDelete },
    ]}
  />
  ```

### 6. Navigation (`<Navigation />`)
- **Props**: `items` (array with `id`, `label`, `icon`, `badge`), `activeId`, `onSelect`, `direction` (`'horizontal' | 'vertical'`).
- **Accessibility**: Semantic `<nav>` landmark with `aria-current="page"` on active selection.

### 7. Tabs (`<Tabs />`)
- **Props**: `tabs` (array with `id`, `label`, `count`), `activeTab`, `onChange`.
- **Accessibility**: `role="tablist"` and `role="tab"` with `aria-selected` attributes and tabIndex management.

### 8. Alert (`<Alert />`)
- **Props**: `variant` (`'info' | 'success' | 'warning' | 'error'`), `title`, `onClose`, `children`.
- **Accessibility**: Semantic alert landmark with `role="alert"`.

### 9. Badge (`<Badge />`)
- **Props**: `variant` (`'success' | 'warning' | 'danger' | 'info' | 'neutral'`), `size` (`'sm' | 'md'`), `dot` (boolean).

### 10. Skeleton (`<Skeleton />`, `<CardSkeleton />`, `<TableSkeleton />`)
- **Props**: `className`, `rows`.
- **Accessibility**: Includes `role="status"` and a hidden screen-reader announcement (`sr-only`).

---

## 10. Responsive Design & Accessibility

### Responsive Breakpoints
- **Mobile (<640px)**: Sidebar shifts to a compact horizontal scroll bar; KPI cards stack in a single column; tables scroll horizontally with smooth momentum scrolling.
- **Tablet (640px - 1024px)**: KPI cards adapt to a 2-column grid; toolbars transition to responsive flex rows; modal widths scale dynamically.
- **Desktop (>1024px)**: Full vertical sidebar with fixed branding and version tag; 4-column KPI grid; expanded inventory table.

### Accessibility Highlights
- **Keyboard Navigation**:
  - `Escape` key closes both the active Modal and open Dropdown menus.
  - `Enter` and `Space` activate buttons, tabs, and open dropdowns.
  - `ArrowDown` and `ArrowUp` cycle through items in the Dropdown menu.
- **Visible Focus Indicators**: High-contrast outline rings (`focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`).
- **Semantic Structure**: Proper heading hierarchy (`h1` for brand, `h2` for page title, `h3` for section headers).
- **Color Contrast**: Tailored color scales ensuring readability in both light and dark themes.

---

## 11. Screenshots & UI Showcase

```text
+-----------------------------------------------------------------------------------------+
| [SP] StockPilot                                          [⏳ Preview Skeletons] [🌙] [+ Add] |
+------------------+----------------------------------------------------------------------+
| Dashboard   (★)  |  Dashboard Overview                                                  |
| Products    [4]  |  Track your sales and inventory performance                          |
| Sales            +--------------------+--------------------+--------------------+--------+
| Reports          | Total Revenue      | Total Products     | Total Orders       | Low... |
|                  | $24,850            | 1,248              | 356                | 12     |
|                  | +12.5% this month  | In inventory       | +8.2% this month   | Attn!  |
|                  +--------------------+--------------------+--------------------+--------+
|                  | ⚠️ Low Stock Attention: 12 items require attention.              [✕] |
|                  +----------------------------------------------------------------------+
|                  | Inventory Overview                                                   |
|                  | [All Products (4)]  [In Stock (2)]  [Low Stock (2)]                  |
|                  | [🔍 Search products... ]               [Actions ▾] [Clear Filters]    |
|                  | +------------------------------------------------------------------+ |
|                  | | Product             | Category    | Stock     | Status   | Act.  | |
|                  | |---------------------+-------------+-----------+----------+-------| |
|                  | | Wireless Mouse      | Accessories | 55 units  | In Stock | Remove| |
|                  | | USB-C Hub           | Electronics | 8 units   | Low Stock| Remove| |
|                  +------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------------+
```

*(To capture screenshots, run `npm run dev`, navigate to `http://localhost:5173/`, and save snapshots of Light Mode, Dark Mode, the Add Product Modal, and the Skeleton Loading state in a `/screenshots` folder).*

---

## 12. Git & GitHub Repository Setup

The project is initialized as a clean Git repository with all sensitive and generated files ignored via `.gitignore`.

### Initializing and Committing Locally
```bash
# Verify working tree status
git status

# Stage all project files
git add .

# Create the final Week 4 commit
git commit -m "feat: complete Week 4 Day 5 project revision with reusable component library"
```

### Connecting to a GitHub Remote Repository
To link this project to your GitHub account:
1. Create a new repository on [GitHub](https://github.com/new) (e.g. `stockpilot-dashboard`).
2. Run the following commands in your terminal:
   ```bash
   # Add your GitHub remote URL
   git remote add origin https://github.com/<your-username>/stockpilot-dashboard.git

   # Set branch name to main
   git branch -M main

   # Push your code to GitHub
   git push -u origin main
   ```
