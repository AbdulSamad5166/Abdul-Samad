# Product Management Dashboard (Week 5 Project)

**Created by Abdul Samad**  
A production-grade, responsive dashboard application built as the **Week 5 Day 5 Capstone Project**. This project combines concepts from **Week 1 through Week 5** (Client-side Routing, REST APIs, HTTP methods, Axios Interceptors, TanStack Query, Zod Form Validation, Token Authentication, and Responsive UI architecture).

---

## 🚀 Live Demo & Test Credentials

- **API Used:** [DummyJSON](https://dummyjson.com) (No API key needed)
- **Test Username:** `emilys`
- **Test Password:** `emilyspass`
- *(A convenient "Auto-fill" button is also provided directly on the Login page for rapid evaluation)*

> ⚠️ **DummyJSON API Notice:**  
> DummyJSON is an educational prototyping API. All `POST`, `PUT`, and `DELETE` requests are **simulated on the server** and are **not saved** permanently in DummyJSON's database. The application displays instant success alerts upon successful mutation, invalidates cache queries using `invalidateQueries`, and smoothly transitions the UI as taught in Week 5.

---

## 🛠️ Allowed Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19 + TypeScript** | Component-driven UI with strict type safety (no `any`) |
| **Vite** | Fast modern build tooling & dev server |
| **Tailwind CSS v4** | Utility-first styling with custom dark mode variant |
| **React Router v7** | Client-side routing, nested layouts, protected routes, and 404 handler |
| **TanStack Query v5** | Server state management, query caching (`staleTime`), and mutation invalidation |
| **Axios** | REST client with Bearer token interceptor and HTTP status error parsing |
| **Zod** | TypeScript-first schema validation for forms |
| **lucide-react** | Clean SVG iconography with accessibility labels |

*Strict Scope Notice: Strictly avoids Redux, Zustand, React Context API, React Hook Form, Formik, third-party component libraries (MUI, shadcn), chart libraries, and custom backend code.*

---

## ✨ Key Features

1. **Token Authentication & User Session (No Context API):**
   - Implemented via a lightweight custom hook (`useAuth.ts`) and Local Storage helpers.
   - `ProtectedRoute` reads the token directly from Local Storage.
   - Axios request interceptor attaches `Authorization: Bearer <token>` to requests.
   - Handles HTTP 400, 401, 404, 500, and network failure states with friendly English messages.

2. **Dashboard Overview (`/dashboard`):**
   - 4 StatCards calculating live metrics from API endpoints: Total Products, Categories count, Registered Users, and Average Unit Price.
   - Loading skeletons during network latency.
   - "Latest Products" table with quick navigation.

3. **Product Inventory (`/products`):**
   - Paginated table with `limit=10` and `skip` offsets in query keys.
   - Search bar filtering products by title.
   - Category dropdown filter loaded dynamically from `/products/categories`.
   - Sort by Price (Low/High), Title (A-Z), and Rating.
   - Action buttons: View Details, Edit Product, and Delete with Confirmation Modal.

4. **Product Details (`/products/:id`):**
   - Dynamic route parameter (`useParams`).
   - Image gallery with interactive thumbnail selector.
   - Technical specifications (SKU, Warranty, Shipping, Return Policy).
   - Real customer reviews list.

5. **Reusable Product Form (`/products/new` & `/products/:id/edit`):**
   - Single reusable `ProductForm` component serving both creation (POST) and updating (PUT).
   - Zod schema validation ensuring positive prices, valid categories, and required fields.
   - Automated query cache invalidation on success.

6. **User Directory (`/users`):**
   - Paginated user profiles with contact details, company positions, and avatars.
   - Search bar for querying users.

7. **System Settings & Dark Mode (`/settings`):**
   - Profile update form with Zod validation.
   - Theme toggle between Light and Dark mode persisted in Local Storage.
   - Bearer token inspection card illustrating authentication headers.

---

## 🗂️ Project Folder Structure

```
src/
├── api/
│   ├── authApi.ts          # Authentication endpoints (login, register)
│   ├── client.ts           # Axios instance, Bearer interceptor, HTTP error parser
│   ├── productsApi.ts      # Product CRUD and category API methods
│   └── usersApi.ts         # Users query API methods
├── components/
│   ├── layout/
│   │   ├── Layout.tsx      # Sidebar + Navbar + Outlet shell
│   │   ├── Navbar.tsx      # User profile, theme toggle, logout
│   │   ├── ProtectedRoute.tsx # Auth guard redirecting to /login
│   │   └── Sidebar.tsx     # Navigation links & "Created by Abdul Samad" credit
│   ├── products/
│   │   ├── DeleteConfirmModal.tsx # Accessible modal for deletion
│   │   └── ProductForm.tsx # Reusable Add/Edit form with Zod
│   └── ui/
│       ├── Alert.tsx       # Success/Error/Warning notification banners
│       ├── Badge.tsx       # Color-coded status badges
│       ├── Button.tsx      # Buttons with variants and loading state
│       ├── Card.tsx        # Structured card layout suite
│       ├── EmptyState.tsx  # Empty state graphics and call-to-action
│       ├── ErrorState.tsx  # Error state with Retry refetch button
│       ├── Input.tsx       # Accessible input with label, error, and icons
│       ├── Modal.tsx       # Dialog modal with backdrop and Escape listener
│       ├── Pagination.tsx # Page numbers and navigation buttons
│       ├── SearchBar.tsx   # Search input with clear button
│       ├── Select.tsx      # Select dropdown with typed options
│       ├── Skeleton.tsx    # Skeleton loading placeholders
│       └── StatCard.tsx    # Metric display card with skeleton state
├── hooks/
│   ├── useAuth.ts          # Session management via Local Storage (No Context)
│   ├── useDarkMode.ts      # Dark theme toggle persisted in Local Storage
│   ├── useProducts.ts      # TanStack Query hooks & mutations
│   └── useUsers.ts         # TanStack Query hook for user list
├── pages/
│   ├── DashboardPage.tsx   # Metrics and latest products summary
│   ├── LoginPage.tsx       # Login form with Zod & demo credentials
│   ├── NotFoundPage.tsx    # 404 error page
│   ├── ProductCreatePage.tsx # Route wrapper for creating a product
│   ├── ProductDetailPage.tsx # Comprehensive product specifications
│   ├── ProductEditPage.tsx # Route wrapper for editing a product
│   ├── ProductsPage.tsx    # Catalog with search, filter, sort, pagination
│   ├── RegisterPage.tsx    # Registration form with passwords match check
│   ├── SettingsPage.tsx    # Profile form & theme toggle
│   └── UsersPage.tsx       # Directory of users
├── schemas/
│   ├── authSchema.ts       # Zod schemas for login and register
│   ├── productSchema.ts    # Zod schema for product creation/editing
│   └── profileSchema.ts    # Zod schema for user settings profile
├── types/
│   ├── auth.ts             # Auth session and payload interfaces
│   ├── common.ts           # Pagination and shared types
│   ├── product.ts          # Product entity and category interfaces
│   └── user.ts             # User entity and company interfaces
├── utils/
│   ├── formatters.ts       # Currency and stock utility functions
│   ├── formatters.test.ts  # Logic unit tests (node:test)
│   └── storage.ts          # LocalStorage serialization helpers
├── App.tsx                 # Route configuration
├── index.css               # Tailwind CSS v4 directives
└── main.tsx                # QueryClientProvider & BrowserRouter entry
```

---

## 🚦 Routes Table

| Path | Access Level | Description |
| :--- | :--- | :--- |
| `/login` | Public | User login with demo auto-fill & Zod validation |
| `/register` | Public | Registration form with confirm password check |
| `/dashboard` | Protected | Metric stat cards and latest catalog items |
| `/products` | Protected | Products table with search, category, sort, and pagination |
| `/products/:id` | Protected | Single product specifications, reviews, and gallery |
| `/products/new` | Protected | Nested form route for creating a new product |
| `/products/:id/edit` | Protected | Nested form route for updating existing product |
| `/users` | Protected | Users directory with search and profiles |
| `/settings` | Protected | Profile form and dark mode switch |
| `*` | Public | 404 Page Not Found with return links |

---

## 💻 Local Setup & Installation

Clone and install dependencies:

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests
npx tsx --test src/utils/formatters.test.ts

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

---

## 📦 GitHub Repository Setup Steps

To publish this project to your GitHub account:

```bash
# 1. Initialize git repository
git init

# 2. Stage all project files
git add .

# 3. Commit changes
git commit -m "feat: complete Week 5 Day 5 Product Management Dashboard project"

# 4. Set main branch
git branch -M main

# 5. Link to your remote GitHub repository
git remote add origin https://github.com/<your-username>/product-management-dashboard.git

# 6. Push to GitHub
git push -u origin main
```

---

## 📚 Companion Documentation

- **[docs/API.md](docs/API.md)**: Full REST API specification with request/response payloads and error statuses.
- **[docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md)**: Step-by-step presentation script for the Friday presentation.
- **[docs/REVISION_CHECKLIST.md](docs/REVISION_CHECKLIST.md)**: Week 5 revision checklist mapping every concept to source code.

---

**Created by Abdul Samad** • Week 5 Project
