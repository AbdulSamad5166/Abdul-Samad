import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { initialProducts, type Product } from "../data/products";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => Product;
  updateProduct: (id: number, updated: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  getProductById: (id: number) => Product | undefined;
  updateStock: (id: number, delta: number) => void;
  currency: string;
  setCurrency: (curr: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const STORAGE_KEY = "sales_app_inventory_data_v2";
const CURRENCY_KEY = "sales_app_currency_pref";

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback if localStorage parsing fails
    }
    return initialProducts;
  });

  const [currency, setCurrencyState] = useState<string>(() => {
    try {
      return localStorage.getItem(CURRENCY_KEY) || "Rs.";
    } catch {
      return "Rs.";
    }
  });

  const setCurrency = (curr: string) => {
    setCurrencyState(curr);
    try {
      localStorage.setItem(CURRENCY_KEY, curr);
    } catch {
      // Ignore storage errors
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      // Ignore storage errors
    }
  }, [products]);

  const addProduct = (productData: Omit<Product, "id">): Product => {
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct: Product = {
      ...productData,
      id: newId,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: number, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const updateStock = (id: number, delta: number) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + delta);
          return { ...item, stock: newStock };
        }
        return item;
      })
    );
  };

  const getProductById = (id: number): Product | undefined => {
    return products.find((item) => item.id === id);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        updateStock,
        currency,
        setCurrency,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
