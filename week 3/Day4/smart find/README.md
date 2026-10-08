# SmartFind - Product Catalog & Filter Application

**SmartFind** is a modern, responsive, searchable, and filterable product catalog built with **React** and **Vite**.

---

## Features

- **Real-Time Name Search**: Instant case-insensitive search by product name with a clear (x) button.
- **Category Filter Pills**: Interactive category chips with dynamic item counts for Audio, Wearables, Electronics, Home & Office, and Accessories.
- **Price Range Filter**: Interactive range slider to filter products up to a specified maximum price, including quick preset buttons (`< $50`, `< $100`, `< $150`, `All`).
- **Sort Options**: Sort by Featured, Price (Low to High), Price (High to Low), Rating, or Alphabetical (A to Z).
- **Clear / Reset Filters**: Dedicated reset button with an active filter counter badge to restore all default settings with one click.
- **Friendly Empty State**: When no products match the criteria, a helpful "No products found" component appears with a breakdown of active criteria and a reset CTA.
- **Reusable Component Architecture**:
  - `Header`: Application branding and live catalog stats.
  - `SearchBar`: Search input with clear button.
  - `CategoryFilter`: Category selection pills with item count badges.
  - `PriceFilter`: Range slider with preset threshold buttons.
  - `SortFilter`: Dropdown for ordering items.
  - `FilterControls`: Unified toolbar aggregating all filters and reset actions.
  - `ProductCard`: Individual card showcasing image, badge, rating, category, price, and stock status.
  - `ProductList`: Responsive grid mapping over product items.
  - `EmptyState`: Contextual zero-results view with reset CTA.
  - `Footer`: Clean footer with branding and summary.
- **Modern Responsive UI**: Built with custom Vanilla CSS tokens, Google Font (*Plus Jakarta Sans*), subtle elevations, smooth hover micro-animations, and mobile breakpoints.

---

## Getting Started

### Run the Dev Server
```bash
npx vite
```
Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npx vite build
```

### Preview the Production Build
```bash
npx vite preview
```

---

## Project Structure

```text
├── index.html                  # HTML entry point with metadata and fonts
├── package.json                # Project dependencies and scripts
├── vite.config.js              # Vite configuration
└── src/
    ├── App.css                 # Comprehensive styling for catalog and components
    ├── App.jsx                 # Connects the catalog hook to the page components
    ├── index.css               # Core CSS variables, resets, and typography
    ├── main.jsx                # React root mount
    ├── components/
    │   ├── Button.jsx          # Shared button element
    │   ├── CategoryFilter.jsx  # Category filter pills
    │   ├── EmptyState.jsx      # Zero results view
    │   ├── FilterControls.jsx  # Consolidated toolbar
    │   ├── Footer.jsx          # App footer
    │   ├── Header.jsx          # Header with logo and item count
    │   ├── PriceFilter.jsx     # Price range slider & quick presets
    │   ├── ProductCard.jsx     # Reusable product card
    │   ├── ProductList.jsx     # Product cards grid
    │   ├── SearchBar.jsx       # Name search input with clear button
    │   └── SortFilter.jsx      # Sorting dropdown
    ├── data/
    │   └── products.js         # Product dataset and category definitions
    ├── hooks/
    │   └── useCatalog.js       # Shared filter state and derived catalog values
    └── utils/
        └── productUtils.js     # Pure filtering, sorting, and counting functions
```

## How the Catalog Code Is Organized

- `App.jsx` calls `useCatalog` once and passes its state and actions to the UI. Keeping shared filter state here lets the controls and product results stay synchronized.
- `useCatalog.js` is a custom hook: it combines React state with catalog-specific calculations and reset behavior.
- `productUtils.js` contains plain JavaScript functions. They accept products and filter settings, then return counts or matching products without changing React state.
- Components such as `FilterControls`, `ProductList`, and `ProductCard` focus on rendering. `Button` shares the common native button behavior while each use keeps its own existing class and appearance.
- Product data is bundled locally and read synchronously, so the app does not show a fake page-loading or page-error state. Product images have their own loading skeleton and fallback; the catalog already has an empty-results state.
