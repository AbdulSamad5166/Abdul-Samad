# Week 3 - Day 3: SmartFind Product Catalog

SmartFind is a responsive product catalog built with React and Vite. Browse a sample catalog, search products by name, narrow results with filters, and change the sort order.

## Features

- Search product names without regard to letter case, with a clear-search action.
- Filter products by category or maximum price.
- Use preset price filters or adjust the price slider.
- Sort results by featured order, price, rating, or name.
- See category counts, result totals, and a helpful empty state.
- Reset search and filters in one action.
- View product ratings, review counts, badges, stock status, and images.
- Use the responsive layout on desktop and mobile screens.

## Built with

- React 19
- Vite
- JavaScript and CSS

## Run locally

Make sure Node.js and npm are installed. From the repository root, run:

```powershell
Set-Location "week 3\Day3"
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

## Available commands

Run these from the `week 3\Day3` project folder:

```bash
npm run dev      # Start the development server
npm run build    # Build the production version
npm run lint     # Check the source with Oxlint
npm run preview  # Preview the production build locally
```

## Project structure

```text
week 3/Day3/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx                 # Search, filter, sort, and result state
    ├── App.css                 # Catalog and component styles
    ├── index.css               # Global styles
    ├── main.jsx                # React application entry point
    ├── data/
    │   └── products.js         # Sample products and category list
    └── components/
        ├── CategoryFilter.jsx
        ├── EmptyState.jsx
        ├── FilterControls.jsx
        ├── Footer.jsx
        ├── Header.jsx
        ├── PriceFilter.jsx
        ├── ProductCard.jsx
        ├── ProductList.jsx
        ├── SearchBar.jsx
        └── SortFilter.jsx
```
