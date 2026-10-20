# 🛒 Product Explorer Dashboard

A modern, responsive, and feature-rich product management dashboard built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**. The application integrates directly with the **DummyJSON REST API** to deliver seamless product discovery, searching, filtering, pagination, and full CRUD (Create, Read, Update, Delete) workflows.

---

## ✨ Features

- **🛍️ Product Catalog**:
  - Displays rich product cards with thumbnails, ratings, discount badges, pricing, brand info, and stock availability.
  - Responsive grid layout optimized for mobile, tablet, and desktop screens.

- **🔍 Search & Filter**:
  - **Keyword Search**: Instant search through products with auto-debouncing.
  - **Category Filter**: Dynamically fetched categories list for category-specific browsing.
  - **Active Filter Bar**: Highlights current search terms and categories with a one-click reset option.

- **⚡ Full CRUD Operations**:
  - **Create**: Add new products with validation (title, price, category, stock, description).
  - **Read**: View product details with formatted pricing, ratings, and tags.
  - **Update**: Edit existing products with pre-filled modal forms and targeted patch updates.
  - **Delete**: Remove products with prompt confirmation and automatic list refresh.

- **📄 Pagination**:
  - Paginated navigation supporting custom limit and skip parameters.
  - Intuitive previous/next controls, page number buttons, and total item count indicator.

- **🎨 UX & Polish**:
  - Shimmering loading skeletons during network requests.
  - Graceful error handling with detailed feedback and retry actions.
  - Accessible modal dialogs with focus traps and keyboard support (`Escape` to close).
  - Clean icons provided by **Lucide React**.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Modern UI component architecture |
| **TypeScript** | Type-safe code and interfaces |
| **Vite 8** | Fast development server and build tool |
| **Tailwind CSS v4** | Modern utility-first styling with `@tailwindcss/vite` |
| **Axios** | HTTP client for REST API communication |
| **Lucide React** | Crisp, consistent UI icons |
| **DummyJSON** | REST API providing mock ecommerce product data |

---

## 📁 Project Structure

```text
product-explorer-dashboard/
├── src/
│   ├── api/
│   │   ├── client.ts          # Pre-configured Axios instance
│   │   └── products.ts        # DummyJSON API methods (get, search, filter, add, edit, delete)
│   ├── components/
│   │   ├── CategoryFilter.tsx # Category dropdown filter
│   │   ├── ErrorMessage.tsx   # Friendly error display with retry button
│   │   ├── LoadingSkeleton.tsx# Shimmer loading cards
│   │   ├── Modal.tsx          # Accessible modal dialog
│   │   ├── Navbar.tsx         # Top app bar with Add Product trigger
│   │   ├── Pagination.tsx     # Page navigation controls
│   │   ├── ProductCard.tsx    # Individual product item card
│   │   ├── ProductForm.tsx    # Form for adding/editing products
│   │   ├── ProductGrid.tsx    # Responsive grid layout and empty states
│   │   └── SearchBar.tsx      # Debounced search input
│   ├── hooks/
│   │   └── useProducts.ts     # Main state management hook for all product actions
│   ├── types/
│   │   └── product.ts         # TypeScript definitions and interfaces
│   ├── utils/
│   │   └── getErrorMessage.ts # Standardized error message extraction
│   ├── App.tsx                # Main dashboard container
│   ├── index.css              # Global styles & Tailwind imports
│   └── main.tsx               # React application entry point
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── vite.config.ts             # Vite build & plugin configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or later recommended)
- **npm** (v9 or later)

### Installation

1. Clone or navigate to the repository:
   ```bash
   cd product-explorer-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
   > **Note:** The `--legacy-peer-deps` flag ensures smooth peer dependency resolution between Vite and esbuild.

### Running in Development

Start the local Vite development server:

```bash
npm run dev
```

Open your browser and navigate to:
```text
http://localhost:3000
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Launches the local dev server on port `3000` with hot reloading. |
| `npm run build` | Builds the production-ready application to the `dist/` directory. |
| `npm run preview` | Locally previews the production build. |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`). |
| `npm run clean` | Removes build artifacts (`dist`). |

---

## 🌐 API Reference

This project uses [DummyJSON Products API](https://dummyjson.com/docs/products):

- `GET /products?limit={limit}&skip={skip}`: Fetch paginated products.
- `GET /products/search?q={query}`: Search products by keyword.
- `GET /products/categories`: Fetch all category names.
- `GET /products/category/{category}`: Fetch products by category.
- `POST /products/add`: Simulate creating a product.
- `PATCH /products/{id}`: Simulate updating a product.
- `DELETE /products/{id}`: Simulate deleting a product.

---

## 📄 License

This project is licensed under the MIT License.
