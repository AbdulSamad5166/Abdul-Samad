# 🛍️ Product Explorer Dashboard (TanStack Query)

An interactive, responsive product management dashboard built with **React 19**, **TanStack Query v5**, **Vite 8**, and **Tailwind CSS v4**. It demonstrates modern server-state architecture, seamless pagination with data retention, search, category filtering, and optimistic mutations with automatic error rollback.

---

## ✨ Features

- **⚡ Server State Management**: Powered by `@tanstack/react-query` v5 with dedicated cache keys, background revalidation, and zero layout shift.
- **🔍 Search & Filter**:
  - Live title search querying DummyJSON.
  - Category selector dynamically loaded and cached indefinitely (`staleTime: Infinity`).
  - Active search and category filters synchronize seamlessly with pagination reset.
- **📄 Smooth Pagination**:
  - Configurable page size (12 items per page).
  - Uses TanStack Query's `keepPreviousData` (placeholder data) for uninterrupted browsing while the next page is fetched.
- **✏️ Complete CRUD Operations**:
  - **Create**: Add new products with client validation and timestamped mock persistence.
  - **Edit**: Patch existing product details (title, price, category, description) with instant optimistic UI update.
  - **Delete**: Remove items with confirmation and instant optimistic removal from cache.
  - **Rollback Mechanism**: Reverts immediately to previous cache snapshots if an API error occurs.
- **🎨 Modern UI & Feedback**:
  - Tailwind CSS v4 styling.
  - Shimmering skeleton loader during initial query pending state.
  - Inline error banners for failed mutations and comprehensive error boundary with retry button for failed queries.
  - Animated refresh indicator in the header.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^19.0.0` | UI Component Framework |
| **TanStack Query** | `^5.104.0` | Asynchronous Server State & Cache Management |
| **Vite** | `^8.3.0` | Fast Modern Bundler & Development Server |
| **Tailwind CSS** | `^4.3.0` | Utility-First Modern CSS |
| **Axios** | `^1.20.0` | HTTP Client for REST API Calls |
| **TypeScript** | `^7.0.0` | Type Safety & Developer Experience |

---

## 📁 Project Structure

```text
├── src/
│   ├── api/
│   │   ├── client.ts             # Axios HTTP client configuration (DummyJSON baseURL)
│   │   └── products.ts           # Product CRUD & category API functions
│   ├── components/
│   │   ├── CategoryFilter.tsx    # Category dropdown selector
│   │   ├── ErrorMessage.tsx      # Query error state with retry action
│   │   ├── LoadingSkeleton.tsx   # Pulse placeholder grid
│   │   ├── Modal.tsx             # Accessible backdrop & dialog component
│   │   ├── Navbar.tsx            # Header with title, refresh trigger, and add button
│   │   ├── Pagination.tsx        # Next/previous and page indicator controls
│   │   ├── ProductCard.tsx       # Individual product card with thumbnail, stock & actions
│   │   ├── ProductForm.tsx       # Add / Edit form with input validation
│   │   ├── ProductGrid.tsx       # Responsive product grid wrapper
│   │   └── SearchBar.tsx         # Search input with clear and submit triggers
│   ├── hooks/
│   │   ├── useProductMutations.ts# Create, Update, Delete mutations + optimistic UI
│   │   └── useProductsQuery.ts   # Product list & category query hooks
│   ├── types/
│   │   └── product.ts            # TypeScript interfaces (Product, NewProduct, etc.)
│   ├── utils/
│   │   └── getErrorMessage.ts    # Friendly error string extractor for Axios/JS errors
│   ├── App.tsx                   # Main dashboard view & state orchestration
│   ├── index.css                 # Tailwind CSS v4 entry point
│   └── main.tsx                  # Application entry point with QueryClientProvider
├── index.html                    # Main HTML entry
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript compiler configuration
└── vite.config.ts                # Vite build and Tailwind plugin configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (**v20.11+** or **v22+** recommended).

Check your installation:
```bash
node -v
npm -v
```

### Installation

1. Clone or open the project folder in your terminal:
   ```bash
   cd "product-explorer-dashboard-(tanstack-query) (1)"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start the local development server:
```bash
npm run dev
```

Once started, open your browser and navigate to:
```
http://localhost:3000/
```

### Building for Production

To create an optimized production build in the `dist/` directory:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

### Type Checking & Linting

Run TypeScript type check without emitting output:
```bash
npm run lint
```

### Cleaning Build Artifacts

Remove the build output directory (`dist`):
```bash
npm run clean
```

---

## 📡 API Details

This project uses the free public [DummyJSON](https://dummyjson.com/docs/products) API:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/products?limit={}&skip={}` | `GET` | Fetches paginated products list |
| `/products/search?q={}` | `GET` | Searches products by keyword |
| `/products/category-list` | `GET` | Retrieves full list of available categories |
| `/products/category/{cat}` | `GET` | Fetches products filtered by category |
| `/products/add` | `POST` | Simulates creating a new product |
| `/products/{id}` | `PATCH` | Simulates updating product details |
| `/products/{id}` | `DELETE` | Simulates deleting a product |

> **Note on DummyJSON:** The DummyJSON API is a mock backend that simulates server responses without modifying the actual database on their end. To ensure a seamless user experience, `useProductMutations.ts` leverages optimistic updates and custom cache management in TanStack Query so newly created, edited, and deleted products stay reflected during your session.

---

## 🔧 Resolved Issues & Fixes Applied

1. **Dependency Resolution (`ERESOLVE`)**: Removed the conflicting pinned `esbuild@^0.25.0` from `devDependencies` so modern `vite` and `tsx` resolve esbuild peer dependencies cleanly.
2. **Vite Native Config Compatibility**: Updated `vite.config.ts` to use `import.meta.dirname` instead of deprecated `__dirname`.
3. **Cross-Platform Clean Script**: Replaced `rm -rf dist` with a native Node.js filesystem command (`node -e "..."`) ensuring compatibility across Windows, macOS, and Linux.
4. **Dev Server Verification**: Verified end-to-end building and local hosting at `http://localhost:3000/`.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
