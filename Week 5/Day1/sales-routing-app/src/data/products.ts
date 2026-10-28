export interface Product {
  id: number;
  name: string;
  category: "Electronics" | "Furniture" | "Accessories" | "Wearables" | "Office";
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  sku: string;
  rating: number;
}

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Wireless Ergonomic Mouse",
    category: "Electronics",
    price: 2500,
    stock: 25,
    description: "High-precision optical mouse with ergonomic palm rest, silent click switches, and dual Bluetooth / 2.4G wireless connectivity.",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
    sku: "EL-MS-001",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Mechanical Gaming Keyboard",
    category: "Electronics",
    price: 6500,
    stock: 12,
    description: "Compact 75% layout with hot-swappable RGB mechanical switches, durable PBT keycaps, and aircraft-grade aluminum top plate.",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    sku: "EL-KB-002",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Ergonomic Executive Office Chair",
    category: "Furniture",
    price: 18000,
    stock: 8,
    description: "Breathable mesh back with adjustable lumbar support, 3D armrests, smooth-rolling polyurethane casters, and 135-degree recline.",
    imageUrl: "https://images.unsplash.com/photo-1580481077195-c268801d9f82?auto=format&fit=crop&w=600&q=80",
    sku: "FN-CH-003",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Adjustable Aluminum Laptop Stand",
    category: "Accessories",
    price: 3200,
    stock: 0,
    description: "Foldable, lightweight aluminum stand with ventilated heat dissipation and 6-level angle adjustment for laptops up to 17 inches.",
    imageUrl: "https://images.unsplash.com/photo-1616353071588-708dcff912e2?auto=format&fit=crop&w=600&q=80",
    sku: "AC-LS-004",
    rating: 4.5,
  },
  {
    id: 5,
    name: "Active Noise-Cancelling Headphones",
    category: "Electronics",
    price: 12500,
    stock: 18,
    description: "Premium over-ear headphones with 40mm neodymium drivers, 40-hour battery life, and adaptive environmental noise suppression.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    sku: "EL-HP-005",
    rating: 4.9,
  },
  {
    id: 6,
    name: "Smart Health & Fitness Tracker",
    category: "Wearables",
    price: 4800,
    stock: 15,
    description: "AMOLED touch display with 24/7 heart-rate and SpO2 monitoring, 50-meter water resistance, and up to 14 days of battery endurance.",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    sku: "WR-WT-006",
    rating: 4.6,
  },
];

// Preserved for backwards compatibility
export const products = initialProducts;