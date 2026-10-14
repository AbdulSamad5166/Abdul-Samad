import { useState, useEffect } from 'react'

/**
 * =======================================================================
 * Week 4, Day 3: Tailwind CSS Topics Implementation
 * =======================================================================
 * 1.  Introduction to Tailwind CSS  -> Imported via @import "tailwindcss" in index.css
 * 2.  Utility-First CSS            -> Every element styled with utility classes
 * 3.  Tailwind Project Setup       -> Configured with @tailwindcss/vite and @custom-variant dark
 * 4.  Typography                   -> text-xs..3xl, font-medium..extrabold, tracking, uppercase
 * 5.  Spacing                      -> p-*, px-*, py-*, m-*, mt-*, mb-*, gap-*
 * 6.  Colors                       -> slate-50/950, blue-600, emerald-600, amber-600 palettes
 * 7.  Borders                      -> border, border-b/r/t, border-slate-*, rounded-lg/xl/2xl/full
 * 8.  Shadows                      -> shadow-xs, shadow-sm, shadow-md, hover:shadow-md
 * 9.  Flexbox Utilities            -> flex, flex-col, items-center, justify-between, gap-*
 * 10. Grid Utilities               -> grid, grid-cols-1, sm:grid-cols-2, xl:grid-cols-4, gap-5
 * 11. Responsive Utilities         -> sm:, md:, lg:, xl: breakpoint modifiers
 * 12. Hover & Focus States         -> hover:*, focus:*, focus-visible:ring-*, active:scale-*
 * 13. Dark Mode Concepts           -> dark:* classes toggled via 'dark' class & persisted in localStorage
 * 14. Reusable UI Patterns         -> Card, button, input, and badge reusable pattern objects
 * =======================================================================
 */

// --- TypeScript Interfaces (Type Safety) ---
interface NavItem {
  id: string
  label: string
}

interface KpiMetric {
  id: string
  label: string
  value: string
  trend: string
  trendType: 'positive' | 'neutral' | 'warning'
}

interface InventoryProduct {
  id: string
  name: string
  category: string
  stock: number
  status: 'In Stock' | 'Low Stock'
}

// --- Topic 14: Reusable UI Patterns ---
// Consistent styling patterns across cards, buttons, inputs, and badges
const uiPatterns = {
  card: 'rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900',
  primaryButton:
    'inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:bg-blue-500 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-95 dark:focus-visible:ring-offset-slate-900',
  secondaryButton:
    'inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-xs transition-all duration-150 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750 dark:hover:text-white dark:focus-visible:ring-offset-slate-900',
  input:
    'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs transition-all duration-150 hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-500/30',
  badgeInStock:
    'inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30',
  badgeLowStock:
    'inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/30',
}

// Initial dashboard data (preserved from existing project)
const initialNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'products', label: 'Products' },
  { id: 'sales', label: 'Sales' },
  { id: 'reports', label: 'Reports' },
]

const kpiMetrics: KpiMetric[] = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: '$24,850',
    trend: '+12.5% this month',
    trendType: 'positive',
  },
  {
    id: 'products',
    label: 'Total Products',
    value: '1,248',
    trend: 'Products in inventory',
    trendType: 'neutral',
  },
  {
    id: 'orders',
    label: 'Total Orders',
    value: '356',
    trend: '+8.2% this month',
    trendType: 'positive',
  },
  {
    id: 'stock',
    label: 'Low Stock Items',
    value: '12',
    trend: 'Requires attention',
    trendType: 'warning',
  },
]

const initialProducts: InventoryProduct[] = [
  {
    id: '1',
    name: 'Wireless Mouse',
    category: 'Accessories',
    stock: 55,
    status: 'In Stock',
  },
  {
    id: '2',
    name: 'USB-C Hub',
    category: 'Electronics',
    stock: 8,
    status: 'Low Stock',
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    category: 'Accessories',
    stock: 42,
    status: 'In Stock',
  },
]

function App() {
  // Navigation active state
  const [activeNav, setActiveNav] = useState<string>('dashboard')

  // Search filter for Inventory table (demonstrating form input styling)
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Topic 13: Dark Mode state with persistence in localStorage
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('stockpilot_theme')
      if (savedTheme) {
        return savedTheme === 'dark'
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return true
  })

  // Synchronize 'dark' class on HTML root element & save to localStorage
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('stockpilot_theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('stockpilot_theme', 'light')
    }
  }, [isDark])

  // Filter products based on search input
  const filteredProducts = initialProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    // Topic 6 & 11: Colors, Responsive Layout, Dark Mode root container
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 md:flex dark:bg-slate-950 dark:text-slate-100">

      {/* =================================================================
          SIDEBAR
          Demonstrating: Flexbox, Borders, Typography, Spacing, Responsive, Hover/Focus
         ================================================================= */}
      <aside className="border-b border-slate-200 bg-white p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:p-6 dark:border-slate-800 dark:bg-slate-900 shrink-0 flex flex-col justify-between">
        <div>
          {/* Topic 4: Typography (Headings & Labels) */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-sm">
              SP
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                StockPilot
              </h1>
              {/* Topic 4 & 5: Typography size & Spacing */}
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Sales &amp; Inventory
              </p>
            </div>
          </div>

          {/* Topic 9 & 11: Flexbox & Responsive Navigation */}
          <nav className="mt-8 flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
            {initialNavItems.map((item) => {
              const isActive = activeNav === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  type="button"
                  className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${isActive
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                    }`}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="hidden border-t border-slate-200 pt-4 md:block dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            StockPilot v1.0.0
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Tailwind CSS System
          </p>
        </div>
      </aside>

      {/* =================================================================
          MAIN CONTENT AREA
          Demonstrating: Spacing, Typography, Flexbox, Grid, Hover/Focus, Shadows
         ================================================================= */}
      <main className="min-w-0 flex-1 p-5 md:p-8">

        {/* --- Top Navbar / Header --- */}
        {/* Topic 9: Flexbox Utilities (flex, items-center, justify-between, gap-4) */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            {/* Topic 4: Typography (Font sizes, weights, leading) */}
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-slate-900 dark:text-white">
              Dashboard Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track your sales and inventory performance.
            </p>
          </div>

          {/* Topic 9 & 12: Flexbox container for interactive buttons with hover & focus states */}
          <div className="flex items-center gap-3">
            {/* Topic 13: Dark Mode toggle button */}
            <button
              onClick={() => setIsDark((prev) => !prev)}
              type="button"
              className={uiPatterns.secondaryButton}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="text-base mr-1.5" aria-hidden="true">
                {isDark ? '☀️' : '🌙'}
              </span>
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </button>

            {/* Topic 12 & 14: Interactive Primary Button with Reusable Pattern */}
            <button
              type="button"
              className={uiPatterns.primaryButton}
            >
              + Add Product
            </button>
          </div>
        </header>

        {/* --- KPI Cards Section --- */}
        {/* Topic 10 & 11: Grid Utilities with Responsive Breakpoints */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {kpiMetrics.map((kpi) => (
            // Topic 7, 8, 14: Borders, Shadows, and Reusable Card Pattern
            <div
              key={kpi.id}
              className={uiPatterns.card}
            >
              {/* Topic 4 & 6: Typography and Muted Colors */}
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {kpi.label}
              </p>

              {/* Topic 4: Big Bold Metric Typography */}
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {kpi.value}
              </h3>

              {/* Topic 6: Semantic Status Colors (emerald, blue, amber) */}
              <p
                className={`mt-2 text-sm font-medium ${kpi.trendType === 'positive'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : kpi.trendType === 'warning'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}
              >
                {kpi.trend}
              </p>
            </div>
          ))}
        </section>

        {/* --- Inventory Overview Section --- */}
        {/* Topic 7 & 8: Borders, Rounded Corners, Shadows */}
        <section className={`mt-8 ${uiPatterns.card} p-5 md:p-6`}>
          {/* Header toolbar with search input and View All button */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                Inventory Overview
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time stock levels and categorization
              </p>
            </div>

            {/* Topic 7, 12, 14: Search Input (Borders, Focus States, Form Control Pattern) */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${uiPatterns.input} max-w-xs`}
              />

              <button
                type="button"
                className={uiPatterns.secondaryButton}
              >
                View All
              </button>
            </div>
          </div>

          {/* Topic 11: Responsive Overflow Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              {/* Topic 4 & 7: Typography & Borders */}
              <thead className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="pb-3.5 font-medium">Product</th>
                  <th className="pb-3.5 font-medium">Category</th>
                  <th className="pb-3.5 font-medium">Stock</th>
                  <th className="pb-3.5 font-medium">Status</th>
                </tr>
              </thead>

              {/* Topic 12: Interactive Hover States on Table Rows */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    >
                      <td className="py-3.5 font-medium text-slate-900 dark:text-slate-100">
                        {product.name}
                      </td>
                      <td className="py-3.5 text-slate-500 dark:text-slate-400">
                        {product.category}
                      </td>
                      <td className="py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                        {product.stock}
                      </td>
                      <td className="py-3.5">
                        {/* Topic 7, 14: Badges with rounded-full & semantic borders/colors */}
                        <span
                          className={
                            product.status === 'In Stock'
                              ? uiPatterns.badgeInStock
                              : uiPatterns.badgeLowStock
                          }
                        >
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-sm text-slate-500 dark:text-slate-400"
                    >
                      No products found matching "{searchQuery}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  )
}

export default App