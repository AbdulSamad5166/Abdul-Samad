
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Dropdown,
  Input,
  Modal,
} from "./components/ui";

interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
}

const initialProducts: Product[] = [
  { id: 1, name: "Wireless Mouse", category: "Accessories", stock: 85, price: 25 },
  { id: 2, name: "USB-C Hub", category: "Electronics", stock: 8, price: 45 },
  { id: 3, name: "Mechanical Keyboard", category: "Accessories", stock: 42, price: 75 },
  { id: 4, name: "Laptop Stand", category: "Office", stock: 5, price: 35 },
  { id: 5, name: "USB-C Cable", category: "Electronics", stock: 120, price: 12 },
];

const categories = ["All Categories", "Accessories", "Electronics", "Office"];

function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [modalOpen, setModalOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const [name, setName] = useState("");
  const [newCategory, setNewCategory] = useState("Accessories");
  const [stock, setStock] = useState("10");
  const [price, setPrice] = useState("20");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All Categories" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const totalUnits = products.reduce((sum, product) => sum + product.stock, 0);
  const inventoryValue = products.reduce(
    (sum, product) => sum + product.stock * product.price,
    0
  );
  const lowStockCount = products.filter((product) => product.stock <= 10).length;

  function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const quantity = Number(stock);
    const productPrice = Number(price);

    if (
      !name.trim() ||
      !Number.isInteger(quantity) ||
      quantity < 0 ||
      !Number.isFinite(productPrice) ||
      productPrice <= 0
    ) {
      setNotice("Enter a valid name, non-negative stock and price above zero.");
      return;
    }

    setProducts((current) => [
      ...current,
      {
        id: Date.now(),
        name: name.trim(),
        category: newCategory,
        stock: quantity,
        price: productPrice,
      },
    ]);

    setName("");
    setStock("10");
    setPrice("20");
    setNewCategory("Accessories");
    setModalOpen(false);
    setNotice("Product added successfully.");
  }

  function removeProduct(id: number) {
    setProducts((current) => current.filter((product) => product.id !== id));
    setNotice("Product removed.");
  }

  const navigation = [
    { label: "Dashboard", symbol: "▦", active: true },
    { label: "Products", symbol: "□", active: false },
    { label: "Sales", symbol: "↗", active: false },
    { label: "Reports", symbol: "▤", active: false },
    { label: "Settings", symbol: "⚙", active: false },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 md:flex">
      <aside className="border-b border-slate-800 bg-slate-900 p-5 md:min-h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        <a href="#dashboard" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">StockPilot</h1>
            <p className="text-xs text-slate-500">Inventory management</p>
          </div>
        </a>

        <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Workspace
        </p>

        <nav aria-label="Main navigation" className="flex gap-2 overflow-x-auto md:flex-col">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.label === "Dashboard" ? "#dashboard" : "#inventory"}
              aria-current={item.active ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                item.active
                  ? "bg-blue-600 font-medium text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span aria-hidden="true" className="text-lg">{item.symbol}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-8 hidden rounded-2xl border border-slate-800 bg-slate-950 p-4 md:block">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">Inventory health</span>
            <span className="text-xs text-emerald-400">Live demo</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{
                width: `${products.length ? Math.min(100, (products.filter((p) => p.stock > 10).length / products.length) * 100) : 0}%`,
              }}
            />
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Review low-stock items before they run out.
          </p>
        </div>

        <div className="mt-8 hidden items-center gap-3 border-t border-slate-800 pt-5 md:flex">
          <div className="flex size-10 items-center justify-center rounded-full bg-slate-700 font-semibold">
            SP
          </div>
          <div>
            <p className="text-sm font-medium">Store Manager</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
      </aside>

      <main id="dashboard" className="min-w-0 flex-1 p-5 md:p-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm text-slate-500">
              Workspace / Overview
            </p>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Dashboard Overview
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Monitor your products and inventory performance.
            </p>
          </div>

          <Button onClick={() => setModalOpen(true)}>
            <span aria-hidden="true">＋</span> Add Product
          </Button>
        </header>

        {notice && (
          <div className="mb-6">
            <Alert onClose={() => setNotice("")}>{notice}</Alert>
          </div>
        )}

        <section aria-label="Key metrics" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <div className="flex items-start justify-between">
              <p className="text-sm text-slate-400">Total Revenue</p>
              <span className="rounded-lg bg-emerald-500/10 px-3 py-2 text-emerald-400">↗</span>
            </div>
            <p className="mt-4 text-3xl font-bold">$24,850</p>
            <p className="mt-2 text-xs text-emerald-400">Demo sales figure</p>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <p className="text-sm text-slate-400">Total Products</p>
              <span className="rounded-lg bg-blue-500/10 px-3 py-2 text-blue-400">□</span>
            </div>
            <p className="mt-4 text-3xl font-bold">{products.length}</p>
            <p className="mt-2 text-xs text-slate-500">Products in catalogue</p>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <p className="text-sm text-slate-400">Units in Stock</p>
              <span className="rounded-lg bg-violet-500/10 px-3 py-2 text-violet-400">▤</span>
            </div>
            <p className="mt-4 text-3xl font-bold">{totalUnits.toLocaleString()}</p>
            <p className="mt-2 text-xs text-slate-500">Across all products</p>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <p className="text-sm text-slate-400">Low Stock Items</p>
              <span className="rounded-lg bg-amber-500/10 px-3 py-2 text-amber-400">!</span>
            </div>
            <p className="mt-4 text-3xl font-bold">{lowStockCount}</p>
            <p className="mt-2 text-xs text-amber-400">10 units or fewer</p>
          </Card>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">Inventory Overview</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Review and manage your product catalogue.
                </p>
              </div>
              <Badge tone="info">{products.length} products</Badge>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Search products"
                name="search"
                placeholder="Search by product name..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Dropdown
                label="Filter by category"
                name="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                options={categories}
              />
            </div>

            <div id="inventory" className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
                    <th scope="col" className="pb-4 pr-4 font-medium">Product</th>
                    <th scope="col" className="pb-4 pr-4 font-medium">Category</th>
                    <th scope="col" className="pb-4 pr-4 font-medium">Price</th>
                    <th scope="col" className="pb-4 pr-4 font-medium">Stock</th>
                    <th scope="col" className="pb-4 pr-4 font-medium">Status</th>
                    <th scope="col" className="pb-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredProducts.map((product) => {
                    const low = product.stock <= 10;

                    return (
                      <tr key={product.id} className="transition hover:bg-slate-800/30">
                        <td className="py-4 pr-4 font-medium text-slate-200">{product.name}</td>
                        <td className="py-4 pr-4 text-slate-400">{product.category}</td>
                        <td className="py-4 pr-4">${product.price.toFixed(2)}</td>
                        <td className="py-4 pr-4">{product.stock}</td>
                        <td className="py-4 pr-4">
                          <Badge tone={low ? "warning" : "success"}>
                            {low ? "Low Stock" : "In Stock"}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Button
                            variant="danger"
                            className="px-3 py-2"
                            aria-label={`Remove ${product.name}`}
                            onClick={() => removeProduct(product.id)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="py-10 text-center">
                  <p className="font-medium text-slate-300">No products found</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Try a different search or category.
                  </p>
                </div>
              )}
            </div>
          </Card>

          <div className="grid content-start gap-5">
            <Card>
              <h3 className="text-lg font-semibold">Inventory Value</h3>
              <p className="mt-2 text-sm text-slate-500">
                Estimated value at listed prices.
              </p>
              <p className="mt-5 text-3xl font-bold">
                ${inventoryValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </p>
              <div className="mt-5 border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Healthy stock</span>
                  <span className="font-medium">
                    {products.filter((p) => p.stock > 10).length}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-400">Needs attention</span>
                  <span className="font-medium text-amber-400">{lowStockCount}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <p className="mt-1 text-sm text-slate-500">
                Manage your inventory.
              </p>
              <div className="mt-5 grid gap-3">
                <Button onClick={() => setModalOpen(true)}>
                  ＋ Add a new product
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch("");
                    setCategory("All Categories");
                    setNotice("Search and category filters have been reset.");
                  }}
                >
                  Reset filters
                </Button>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">Stock Alerts</h3>
                <Badge tone={lowStockCount > 0 ? "warning" : "success"}>
                  {lowStockCount} alerts
                </Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {lowStockCount > 0
                  ? "Some products have 10 units or fewer. Consider replenishing them."
                  : "All products are above the low-stock threshold."}
              </p>
            </Card>
          </div>
        </section>

        <footer className="py-8 text-center text-xs text-slate-600">
          StockPilot · Sales & Inventory Dashboard · Learning Project
        </footer>
      </main>

      {modalOpen && (
        <Modal
          title="Add New Product"
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={addProduct} className="grid gap-5">
            <Input
              label="Product name"
              name="productName"
              placeholder="e.g. Wireless Headphones"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoFocus
              maxLength={100}
            />

            <Dropdown
              label="Category"
              name="productCategory"
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              options={categories.filter((item) => item !== "All Categories")}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Stock quantity"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                required
              />
              <Input
                label="Unit price ($)"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Product</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default App;
