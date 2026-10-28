import { useState, useEffect } from 'react'
import {
  Button,
  Card,
  Input,
  Modal,
  Dropdown,
  Navigation,
  Tabs,
  Alert,
  Badge,
  CardSkeleton,
  TableSkeleton,
} from './components/index.ts'

/**
 * =======================================================================
 * StockPilot Dashboard - Professional Glassmorphic SaaS Operations Suite
 * =======================================================================
 * Features:
 * - Ambient glassmorphism with dynamic backdrop blur and gradient refraction
 * - Interactive Sales & Revenue Analytics Chart with timeframe switching (7D, 30D, 90D)
 * - Real-time inline inventory adjustments (+ / - stock) with automatic status triggers
 * - Category breakdown and inventory health score gauge
 * - Real-time activity feed and audit trail
 * - Notification center drawer and user profile status
 * - Fully accessible (WCAG AA), responsive, and dark-mode synchronized
 * =======================================================================
 */

// --- TypeScript Interfaces (Type Safety) ---
export interface NavItem {
  id: string
  label: string
}

export interface KpiMetric {
  id: string
  label: string
  value: string
  trend: string
  trendType: 'positive' | 'neutral' | 'warning'
  change: string
}

export interface InventoryProduct {
  id: string
  name: string
  category: string
  stock: number
  price: number
  status: 'In Stock' | 'Low Stock'
}

export interface ActivityItem {
  id: string
  title: string
  timestamp: string
  type: 'order' | 'restock' | 'alert' | 'user'
  details: string
}

export interface NotificationItem {
  id: string
  title: string
  time: string
  unread: boolean
  description: string
}

// Initial navigation items
const initialNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'products', label: 'Products' },
  { id: 'sales', label: 'Sales & Orders' },
  { id: 'reports', label: 'Analytics' },
]

// KPI Metrics with comparison changes
const initialKpis: KpiMetric[] = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: '$24,850',
    trend: '+12.5% vs last month',
    trendType: 'positive',
    change: '+$2,760',
  },
  {
    id: 'products',
    label: 'Total Products',
    value: '1,248',
    trend: 'Catalog active',
    trendType: 'neutral',
    change: '3 categories',
  },
  {
    id: 'orders',
    label: 'Total Orders',
    value: '356',
    trend: '+8.2% vs last month',
    trendType: 'positive',
    change: '32 today',
  },
  {
    id: 'stock',
    label: 'Low Stock Items',
    value: '12',
    trend: 'Requires reorder',
    trendType: 'warning',
    change: 'Action needed',
  },
]

// Sample products with real-life attributes
const initialProducts: InventoryProduct[] = [
  {
    id: '1',
    name: 'Wireless Ergonomic Mouse',
    category: 'Accessories',
    stock: 55,
    price: 49.99,
    status: 'In Stock',
  },
  {
    id: '2',
    name: 'Thunderbolt USB-C Hub',
    category: 'Electronics',
    stock: 8,
    price: 79.5,
    status: 'Low Stock',
  },
  {
    id: '3',
    name: 'Mechanical RGB Keyboard',
    category: 'Accessories',
    stock: 42,
    price: 119.0,
    status: 'In Stock',
  },
  {
    id: '4',
    name: 'Noise-Canceling Studio Headset',
    category: 'Electronics',
    stock: 19,
    price: 149.99,
    status: 'In Stock',
  },
]

// Sample recent activities for real-life operations audit
const initialActivities: ActivityItem[] = [
  {
    id: 'a1',
    title: 'Shipment Received',
    timestamp: '12m ago',
    type: 'restock',
    details: 'Added +20 units to Wireless Ergonomic Mouse',
  },
  {
    id: 'a2',
    title: 'Order #SO-9842 Completed',
    timestamp: '45m ago',
    type: 'order',
    details: 'Shipped to Austin, TX ($248.50)',
  },
  {
    id: 'a3',
    title: 'Threshold Triggered',
    timestamp: '2h ago',
    type: 'alert',
    details: 'Thunderbolt USB-C Hub dropped below 10 units',
  },
  {
    id: 'a4',
    title: 'Catalog Updated',
    timestamp: '4h ago',
    type: 'user',
    details: 'Alex Morgan verified stock valuations',
  },
]

// Notifications list
const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Critical Inventory Notice',
    time: '15m ago',
    unread: true,
    description: 'USB-C Hub reached reorder threshold of 8 units.',
  },
  {
    id: 'n2',
    title: 'Weekly Sales Milestone',
    time: '2h ago',
    unread: true,
    description: 'Weekly revenue target ($24k) surpassed by 3.5%.',
  },
  {
    id: 'n3',
    title: 'System Cloud Sync',
    time: 'Yesterday',
    unread: false,
    description: 'Inventory database automatically backed up to AWS S3.',
  },
]

// Chart dataset for 7D, 30D, and 90D views
const chartDatasets = {
  '7D': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    revenue: [2800, 3400, 3100, 4200, 3900, 4800, 5200],
    orders: [42, 51, 48, 64, 58, 72, 79],
  },
  '30D': {
    labels: ['W1', 'W2', 'W3', 'W4'],
    revenue: [5400, 6800, 6100, 7200],
    orders: [82, 104, 91, 115],
  },
  '90D': {
    labels: ['Month 1', 'Month 2', 'Month 3'],
    revenue: [21000, 23500, 24850],
    orders: [310, 335, 356],
  },
}

let itemCounter = 100

function App() {
  // Navigation active state
  const [activeNav, setActiveNav] = useState<string>('dashboard')

  // Search filter for Inventory table
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Filter Tabs state ('all', 'in-stock', 'low-stock')
  const [activeTab, setActiveTab] = useState<string>('all')

  // Loading Skeleton demonstration toggle
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Chart timeframe toggle ('7D' | '30D' | '90D')
  const [chartTimeframe, setChartTimeframe] = useState<'7D' | '30D' | '90D'>('7D')

  // Products state (allows adding new items, live increment/decrement)
  const [products, setProducts] = useState<InventoryProduct[]>(initialProducts)

  // Activities stream
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities)

  // Modal State for Adding Product
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [newProductName, setNewProductName] = useState('')
  const [newProductCategory, setNewProductCategory] = useState('Accessories')
  const [newProductStock, setNewProductStock] = useState('20')
  const [newProductPrice, setNewProductPrice] = useState('49.99')
  const [nameError, setNameError] = useState('')

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false)

  // Alerts State
  const [showAlert, setShowAlert] = useState<boolean>(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Dark Mode state with persistence in localStorage
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

  // Trigger temporary toast notification
  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current))
    }, 3500)
  }

  // Quick Inline Stock Adjustment (+ / -)
  const handleStockChange = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const updatedStock = Math.max(0, item.stock + delta)
          const updatedStatus = updatedStock <= 10 ? 'Low Stock' : 'In Stock'
          showToast(
            `${item.name} stock ${delta > 0 ? 'increased' : 'decreased'} to ${updatedStock}`
          )
          return {
            ...item,
            stock: updatedStock,
            status: updatedStatus,
          }
        }
        return item
      })
    )

    // Add to activity audit log
    const changedItem = products.find((p) => p.id === productId)
    if (changedItem) {
      const newActivity: ActivityItem = {
        id: `act-${productId}-${itemCounter++}`,
        title: delta > 0 ? 'Stock Replenished' : 'Stock Dispatched',
        timestamp: 'Just now',
        type: delta > 0 ? 'restock' : 'order',
        details: `${delta > 0 ? '+' : ''}${delta} unit(s) of ${changedItem.name}`,
      }
      setActivities((prev) => [newActivity, ...prev.slice(0, 5)])
    }
  }

  // Handle Add Product Submission
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProductName.trim()) {
      setNameError('Product name is required.')
      return
    }

    const stockNumber = parseInt(newProductStock, 10) || 0
    const priceNumber = parseFloat(newProductPrice) || 29.99
    const newProduct: InventoryProduct = {
      id: `prod-${itemCounter++}`,
      name: newProductName.trim(),
      category: newProductCategory,
      stock: stockNumber,
      price: priceNumber,
      status: stockNumber <= 10 ? 'Low Stock' : 'In Stock',
    }

    setProducts((prev) => [newProduct, ...prev])
    setIsAddModalOpen(false)
    setNewProductName('')
    setNewProductStock('20')
    setNewProductPrice('49.99')
    setNameError('')

    // Append to audit trail
    const newActivity: ActivityItem = {
      id: `act-${itemCounter++}`,
      title: 'New Product Added',
      timestamp: 'Just now',
      type: 'user',
      details: `${newProduct.name} (${newProduct.category}) registered by Alex Morgan`,
    }
    setActivities((prev) => [newActivity, ...prev.slice(0, 5)])

    showToast(`Product "${newProduct.name}" added successfully!`)
  }

  // Filter products by search query and active tab
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (activeTab === 'in-stock') return product.status === 'In Stock'
    if (activeTab === 'low-stock') return product.status === 'Low Stock'
    return true
  })

  // Tab counts
  const countAll = products.length
  const countInStock = products.filter((p) => p.status === 'In Stock').length
  const countLowStock = products.filter((p) => p.status === 'Low Stock').length

  const inventoryTabs = [
    { id: 'all', label: 'All Items', count: countAll },
    { id: 'in-stock', label: 'In Stock', count: countInStock },
    { id: 'low-stock', label: 'Low Stock', count: countLowStock },
  ]

  // Category counts for inventory health widget
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0)
  const healthPercent = Math.round(
    ((products.length - countLowStock) / (products.length || 1)) * 100
  )

  // Chart data calculation
  const currentChart = chartDatasets[chartTimeframe]
  const maxRevenue = Math.max(...currentChart.revenue, 1)

  // Dropdown menu items for table actions
  const dropdownActions = [
    {
      id: 'export-csv',
      label: 'Export Inventory CSV',
      icon: <span>📊</span>,
      onClick: () => {
        showToast('Exporting inventory data as CSV...')
      },
    },
    {
      id: 'sort-stock-asc',
      label: 'Sort: Stock (Low to High)',
      icon: <span>↑</span>,
      onClick: () => {
        setProducts((prev) => [...prev].sort((a, b) => a.stock - b.stock))
        showToast('Sorted by stock (Ascending)')
      },
    },
    {
      id: 'sort-stock-desc',
      label: 'Sort: Stock (High to Low)',
      icon: <span>↓</span>,
      onClick: () => {
        setProducts((prev) => [...prev].sort((a, b) => b.stock - a.stock))
        showToast('Sorted by stock (Descending)')
      },
    },
    {
      id: 'sort-price-desc',
      label: 'Sort: Price (High to Low)',
      icon: <span>💰</span>,
      onClick: () => {
        setProducts((prev) => [...prev].sort((a, b) => b.price - a.price))
        showToast('Sorted by price (Descending)')
      },
    },
    {
      id: 'reset-list',
      label: 'Reset Sample Data',
      icon: <span>↺</span>,
      danger: true,
      onClick: () => {
        setProducts(initialProducts)
        showToast('Inventory reset to default sample dataset.')
      },
    },
  ]

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 transition-colors duration-200 md:flex dark:bg-slate-950 dark:text-slate-100">
      {/* =================================================================
          AMBIENT GLASSMORPHISM GLOW ORBS
          Subtle gradient spheres that refract through frosted glass panels
         ================================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-32 -left-32 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-600/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-1/3 -right-32 h-[500px] w-[500px] rounded-full bg-indigo-500/12 blur-3xl dark:bg-indigo-600/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -bottom-32 left-1/3 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-600/10"
      />

      {/* =================================================================
          TOAST NOTIFICATION BANNER (Top-Right Floating)
         ================================================================= */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 text-xs font-semibold text-slate-800 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-100 animate-in fade-in slide-in-from-top-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
            ✓
          </span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* =================================================================
          SIDEBAR NAVIGATION
          Frosted glass styling with semantic tags and active badges
         ================================================================= */}
      <aside className="relative z-20 shrink-0 border-b border-slate-200/70 bg-white/70 p-5 backdrop-blur-xl md:min-h-screen md:w-64 md:border-b-0 md:border-r md:p-6 dark:border-slate-800/80 dark:bg-slate-900/70 flex flex-col justify-between">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-extrabold text-lg shadow-lg shadow-blue-500/25">
              SP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  StockPilot
                </h1>
                <Badge variant="info" size="sm">
                  PRO
                </Badge>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                SaaS Operations Suite
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="mt-8">
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Navigation
            </p>
            <Navigation
              items={initialNavItems.map((item) => ({
                id: item.id,
                label: item.label,
                badge: item.id === 'products' ? products.length : undefined,
              }))}
              activeId={activeNav}
              onSelect={setActiveNav}
              direction="vertical"
              className="hidden md:flex"
            />
            {/* Horizontal Navigation for Mobile Viewports */}
            <Navigation
              items={initialNavItems}
              activeId={activeNav}
              onSelect={setActiveNav}
              direction="horizontal"
              className="flex md:hidden"
            />
          </div>

          {/* Quick Metrics Widget in Sidebar */}
          <div className="mt-8 hidden rounded-2xl border border-white/60 bg-white/50 p-4 shadow-xs backdrop-blur-md md:block dark:border-slate-800/80 dark:bg-slate-950/40">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                Inventory Health
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {healthPercent}%
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${healthPercent}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
              {totalStockUnits} units across {products.length} products
            </p>
          </div>
        </div>

        {/* Sidebar Footer User Profile Chip */}
        <div className="hidden border-t border-slate-200/70 pt-4 md:block dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-xs">
              AM
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                Alex Morgan
              </p>
              <p className="truncate text-[11px] text-slate-400">Operations Lead</p>
            </div>
            <span
              className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
              title="Online"
            />
          </div>
        </div>
      </aside>

      {/* =================================================================
          MAIN DASHBOARD VIEWPORT
         ================================================================= */}
      <main className="relative z-10 min-w-0 flex-1 p-5 md:p-8">
        {/* --- Top Glassy Navigation & Header Bar --- */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/60 bg-white/70 p-5 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Executive Overview
              </h2>
              {/* Real-life Live Sync Status */}
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync Active
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Real-time telemetry, inventory velocity, and order pipeline.
            </p>
          </div>

          {/* Action Buttons in Header */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Notification Bell with Badge */}
            <div className="relative">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsNotificationsOpen((prev) => !prev)}
                aria-label="View notifications"
                className="relative !px-3"
              >
                <span>🔔</span>
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-xs">
                  {notifications.filter((n) => n.unread).length}
                </span>
              </Button>

              {/* Glassy Notification Flyout Drawer */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-3xl border border-white/70 bg-white/95 p-4 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 z-40 dark:border-slate-700/80 dark:bg-slate-900/95">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      System Notifications
                    </h4>
                    <button
                      onClick={() =>
                        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
                      }
                      className="text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="mt-2 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-64 overflow-y-auto">
                    {notifications.map((item) => (
                      <div key={item.id} className="py-2.5 text-xs">
                        <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
                          <span className="flex items-center gap-1.5">
                            {item.unread && (
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                            )}
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400">{item.time}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Skeleton Preview Toggle */}
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsLoading((prev) => !prev)}
              title="Toggle loading skeleton states"
            >
              <span>{isLoading ? '✓ View Real Data' : '⏳ Preview Skeletons'}</span>
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsDark((prev) => !prev)}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="text-base mr-1" aria-hidden="true">
                {isDark ? '☀️' : '🌙'}
              </span>
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </Button>

            {/* Primary Add Product Action */}
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsAddModalOpen(true)}
              className="shadow-blue-500/25"
            >
              + Add Product
            </Button>
          </div>
        </header>

        {/* --- Top Alerts Section --- */}
        <div className="mb-6 space-y-3">
          {showAlert && (
            <Alert
              variant="warning"
              title="Stock Threshold Notice"
              onClose={() => setShowAlert(false)}
              className="border-amber-200/70 bg-amber-50/70 backdrop-blur-md dark:border-amber-900/60 dark:bg-amber-950/30"
            >
              2 catalog items have fallen below minimum safety inventory (≤10 units). Immediate
              restocking recommended.
            </Alert>
          )}
        </div>

        {/* --- KPI Performance Cards Section --- */}
        <section
          aria-label="Key Performance Indicators"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : initialKpis.map((kpi) => (
                <Card key={kpi.id} className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {kpi.label}
                    </p>
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                      {kpi.change}
                    </span>
                  </div>
                  <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {kpi.value}
                  </h3>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span
                      className={`text-xs font-medium ${
                        kpi.trendType === 'positive'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : kpi.trendType === 'warning'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {kpi.trend}
                    </span>
                    {/* Mini Sparkline Bar representation */}
                    <div className="flex items-end gap-1 h-4">
                      <div className="w-1 bg-blue-500/40 rounded-full h-2" />
                      <div className="w-1 bg-blue-500/60 rounded-full h-3" />
                      <div className="w-1 bg-blue-500 rounded-full h-4" />
                    </div>
                  </div>
                </Card>
              ))}
        </section>

        {/* =================================================================
            INTERACTIVE REVENUE ANALYTICS & AUDIT STREAM (Grid 2-Column)
           ================================================================= */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Revenue Trends Interactive Chart (2 cols) */}
          <Card hoverable={false} className="p-6 lg:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Sales Velocity &amp; Revenue Trends
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Performance telemetry across order fulfillment cycles
                </p>
              </div>

              {/* Timeframe Toggle Pills */}
              <div className="flex items-center gap-1 rounded-xl bg-slate-100/80 p-1 dark:bg-slate-800/80">
                {(['7D', '30D', '90D'] as const).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setChartTimeframe(tf)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      chartTimeframe === tf
                        ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Summary Metrics */}
            <div className="mt-4 grid grid-cols-3 gap-4 border-b border-slate-100 pb-4 dark:border-slate-800 text-center sm:text-left">
              <div>
                <p className="text-[11px] font-medium text-slate-400">Avg. Order Value</p>
                <p className="text-base font-bold text-slate-900 dark:text-white">$69.80</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">Conversion Rate</p>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">3.4%</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">Fulfillment Speed</p>
                <p className="text-base font-bold text-blue-600 dark:text-blue-400">1.2 Days</p>
              </div>
            </div>

            {/* Custom Responsive SVG Area Chart */}
            <div className="mt-6 h-56 w-full">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 500 180">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Lines */}
                <line
                  x1="0"
                  y1="30"
                  x2="500"
                  y2="30"
                  stroke="currentColor"
                  className="text-slate-200/50 dark:text-slate-800/80"
                  strokeDasharray="4 4"
                />
                <line
                  x1="0"
                  y1="90"
                  x2="500"
                  y2="90"
                  stroke="currentColor"
                  className="text-slate-200/50 dark:text-slate-800/80"
                  strokeDasharray="4 4"
                />
                <line
                  x1="0"
                  y1="150"
                  x2="500"
                  y2="150"
                  stroke="currentColor"
                  className="text-slate-200/50 dark:text-slate-800/80"
                />

                {/* Area Gradient Fill */}
                {(() => {
                  const points = currentChart.revenue.map((val, idx) => {
                    const x = (idx / (currentChart.revenue.length - 1 || 1)) * 480 + 10
                    const y = 150 - (val / maxRevenue) * 120
                    return `${x},${y}`
                  })
                  const areaD = `M 10,150 L ${points.join(' L ')} L 490,150 Z`
                  const lineD = `M ${points.join(' L ')}`

                  return (
                    <>
                      <path d={areaD} fill="url(#chartGradient)" />
                      <path
                        d={lineD}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Data Point Markers */}
                      {currentChart.revenue.map((val, idx) => {
                        const x = (idx / (currentChart.revenue.length - 1 || 1)) * 480 + 10
                        const y = 150 - (val / maxRevenue) * 120
                        return (
                          <g key={idx} className="group cursor-pointer">
                            <circle
                              cx={x}
                              cy={y}
                              r="5"
                              className="fill-white stroke-blue-600 stroke-[3] transition-transform duration-200 group-hover:scale-150 dark:fill-slate-900"
                            />
                            <text
                              x={x}
                              y={y - 12}
                              textAnchor="middle"
                              className="opacity-0 group-hover:opacity-100 fill-slate-900 dark:fill-white text-[10px] font-bold transition-opacity"
                            >
                              ${val}
                            </text>
                          </g>
                        )
                      })}
                    </>
                  )
                })()}

                {/* X-Axis Labels */}
                {currentChart.labels.map((lbl, idx) => {
                  const x = (idx / (currentChart.labels.length - 1 || 1)) * 480 + 10
                  return (
                    <text
                      key={idx}
                      x={x}
                      y={172}
                      textAnchor="middle"
                      className="fill-slate-400 text-[11px] font-medium"
                    >
                      {lbl}
                    </text>
                  )
                })}
              </svg>
            </div>
          </Card>

          {/* Real-time Activity Stream & Audit Trail (1 col) */}
          <Card hoverable={false} className="p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Operations Audit Log
              </h3>
              <Badge variant="neutral" size="sm">
                Live
              </Badge>
            </div>

            <div className="mt-4 space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-bold ${
                      act.type === 'restock'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : act.type === 'order'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : act.type === 'alert'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                    }`}
                  >
                    {act.type === 'restock'
                      ? '↑'
                      : act.type === 'order'
                      ? '📦'
                      : act.type === 'alert'
                      ? '⚠️'
                      : '👤'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900 dark:text-white">{act.title}</p>
                      <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {act.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast('Full audit log exported to console.')}
              className="mt-6 w-full"
            >
              View Full Audit Trail
            </Button>
          </Card>
        </div>

        {/* =================================================================
            INVENTORY TABLE SECTION WITH INLINE STOCK ADJUSTMENTS
           ================================================================= */}
        <section className="mt-8">
          <Card hoverable={false} className="p-5 md:p-6">
            {/* Header Toolbar: Title, Tabs, Search, and Dropdown */}
            <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    Inventory &amp; Stock Velocity
                  </h3>
                  <Badge variant="neutral" size="sm">
                    {filteredProducts.length} items
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Quick stock counter adjustments (+ / -), status indicators, and actions
                </p>
              </div>

              {/* Day 4 Topic 8: Reusable Tabs for Filtering */}
              <Tabs tabs={inventoryTabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>

            {/* Filter and Actions Bar */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Accessible Search Input */}
              <div className="w-full sm:max-w-xs">
                <Input
                  type="text"
                  placeholder="Search by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<span>🔍</span>}
                  aria-label="Search products"
                />
              </div>

              {/* Actions Dropdown & Clear Filters */}
              <div className="flex items-center gap-3">
                <Dropdown
                  trigger={
                    <Button variant="secondary" size="md">
                      <span>Actions ▾</span>
                    </Button>
                  }
                  items={dropdownActions}
                />

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setSearchQuery('')
                    setActiveTab('all')
                  }}
                  disabled={!searchQuery && activeTab === 'all'}
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Inventory Table or Skeleton Placeholder */}
            {isLoading ? (
              <div className="py-2">
                <TableSkeleton rows={4} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="border-b border-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <tr>
                      <th className="pb-3.5 font-medium">Product Name</th>
                      <th className="pb-3.5 font-medium">Category</th>
                      <th className="pb-3.5 font-medium">Unit Price</th>
                      <th className="pb-3.5 font-medium">Stock Level</th>
                      <th className="pb-3.5 font-medium">Quick Adjust</th>
                      <th className="pb-3.5 font-medium">Status</th>
                      <th className="pb-3.5 font-medium text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                        >
                          <td className="py-3.5 font-semibold text-slate-900 dark:text-slate-100">
                            {product.name}
                          </td>
                          <td className="py-3.5">
                            <Badge variant="neutral" size="sm">
                              {product.category}
                            </Badge>
                          </td>
                          <td className="py-3.5 font-medium text-slate-600 dark:text-slate-300">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">
                            {product.stock} units
                          </td>

                          {/* Real-life Quick Stock Increment/Decrement */}
                          <td className="py-3.5">
                            <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white/60 p-0.5 dark:border-slate-700 dark:bg-slate-800/60">
                              <button
                                type="button"
                                onClick={() => handleStockChange(product.id, -1)}
                                className="flex h-6 w-6 items-center justify-center rounded-md font-bold text-slate-600 hover:bg-slate-100 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-700"
                                title="Decrease stock (-1)"
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {product.stock}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleStockChange(product.id, 1)}
                                className="flex h-6 w-6 items-center justify-center rounded-md font-bold text-slate-600 hover:bg-slate-100 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-700"
                                title="Increase stock (+1)"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          <td className="py-3.5">
                            <Badge
                              variant={product.status === 'In Stock' ? 'success' : 'warning'}
                              size="md"
                              dot
                            >
                              {product.status}
                            </Badge>
                          </td>

                          <td className="py-3.5 text-right">
                            <div className="inline-flex items-center gap-2">
                              {product.status === 'Low Stock' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStockChange(product.id, 20)}
                                  className="text-xs !py-1 text-emerald-600 border-emerald-500/50 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-500/30"
                                >
                                  + Restock
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setProducts((prev) => prev.filter((p) => p.id !== product.id))
                                  showToast(`Removed "${product.name}" from inventory.`)
                                }}
                                className="text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400"
                                title="Delete product"
                              >
                                ✕
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                        >
                          <p className="font-semibold">No products match your criteria.</p>
                          <p className="mt-1 text-xs text-slate-400">
                            Try adjusting your search terms or filter tabs.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </section>

        {/* =================================================================
            ADD PRODUCT MODAL DIALOG
           ================================================================= */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false)
            setNameError('')
          }}
          title="Add New Inventory Product"
          description="Enter product details to add a new stock item to your dashboard catalog."
          footer={
            <>
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setIsAddModalOpen(false)
                  setNameError('')
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={handleAddProductSubmit}>
                Save Product
              </Button>
            </>
          }
        >
          <form onSubmit={handleAddProductSubmit} className="space-y-4">
            <Input
              label="Product Name"
              placeholder="e.g. Ergonomic Desk Mat"
              value={newProductName}
              onChange={(e) => {
                setNewProductName(e.target.value)
                if (nameError) setNameError('')
              }}
              error={nameError}
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="product-category"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Category
                </label>
                <select
                  id="product-category"
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs transition-all duration-150 hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-600 dark:focus:border-blue-500"
                >
                  <option value="Accessories">Accessories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Peripherals">Peripherals</option>
                  <option value="Furniture">Furniture</option>
                </select>
              </div>

              <Input
                label="Unit Price ($)"
                type="number"
                step="0.01"
                min="0"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
                required
              />
            </div>

            <Input
              label="Initial Stock Quantity"
              type="number"
              min="0"
              value={newProductStock}
              onChange={(e) => setNewProductStock(e.target.value)}
              helperText="Items with 10 or fewer units will automatically trigger the Low Stock status."
              required
            />
          </form>
        </Modal>
      </main>
    </div>
  )
}

export default App