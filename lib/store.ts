import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import React from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  image?: string;
  businessId: string;
}

export interface Sale {
  id: string;
  businessId: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  timestamp: string;
}

export interface Business {
  id: string;
  name: string;
  type: string;
  description: string;
}

interface AppState {
  businesses: Business[];
  currentBusinessId: string | null;
  products: Product[];
  sales: Sale[];
  folders: Array<{ id: string; name: string; parentId: string | null }>;
  
  setCurrentBusiness: (id: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addSale: (sale: Sale) => void;
  addFolder: (folder: { id: string; name: string; parentId: string | null }) => void;
  updateFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
}

const seedData = {
  businesses: [
    {
      id: 'biz-1',
      name: 'Kopi Senja',
      type: 'Coffee Shop',
      description: 'Premium coffee and pastries',
    },
    {
      id: 'biz-2',
      name: 'Outfit Keren',
      type: 'Fashion',
      description: 'Trendy fashion and accessories',
    },
  ] as Business[],
  products: [
    // Kopi Senja products
    { id: 'prod-1', name: 'Espresso', category: 'Beverages', price: 15000, cost: 5000, stock: 50, businessId: 'biz-1' },
    { id: 'prod-2', name: 'Cappuccino', category: 'Beverages', price: 20000, cost: 7000, stock: 45, businessId: 'biz-1' },
    { id: 'prod-3', name: 'Latte', category: 'Beverages', price: 22000, cost: 8000, stock: 40, businessId: 'biz-1' },
    { id: 'prod-4', name: 'Croissant', category: 'Pastries', price: 18000, cost: 6000, stock: 30, businessId: 'biz-1' },
    { id: 'prod-5', name: 'Chocolate Cake', category: 'Pastries', price: 35000, cost: 12000, stock: 15, businessId: 'biz-1' },
    { id: 'prod-6', name: 'Matcha Latte', category: 'Beverages', price: 25000, cost: 9000, stock: 35, businessId: 'biz-1' },
    { id: 'prod-7', name: 'Iced Coffee', category: 'Beverages', price: 18000, cost: 6000, stock: 60, businessId: 'biz-1' },
    { id: 'prod-8', name: 'Bagel', category: 'Pastries', price: 15000, cost: 5000, stock: 25, businessId: 'biz-1' },
    
    // Outfit Keren products
    { id: 'prod-9', name: 'White T-Shirt', category: 'Tops', price: 150000, cost: 60000, stock: 20, businessId: 'biz-2' },
    { id: 'prod-10', name: 'Denim Jeans', category: 'Bottoms', price: 350000, cost: 150000, stock: 15, businessId: 'biz-2' },
    { id: 'prod-11', name: 'Sneakers', category: 'Footwear', price: 500000, cost: 200000, stock: 10, businessId: 'biz-2' },
    { id: 'prod-12', name: 'Leather Jacket', category: 'Outerwear', price: 800000, cost: 350000, stock: 8, businessId: 'biz-2' },
    { id: 'prod-13', name: 'Summer Dress', category: 'Dresses', price: 250000, cost: 100000, stock: 12, businessId: 'biz-2' },
    { id: 'prod-14', name: 'Backpack', category: 'Accessories', price: 200000, cost: 80000, stock: 18, businessId: 'biz-2' },
    { id: 'prod-15', name: 'Watch', category: 'Accessories', price: 400000, cost: 150000, stock: 5, businessId: 'biz-2' },
    { id: 'prod-16', name: 'Sunglasses', category: 'Accessories', price: 120000, cost: 40000, stock: 22, businessId: 'biz-2' },
  ] as Product[],
  sales: [
    // Recent sales for Kopi Senja (high frequency)
    { id: 'sale-1', businessId: 'biz-1', items: [{ productId: 'prod-1', productName: 'Espresso', quantity: 2, price: 15000 }], total: 30000, timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'sale-2', businessId: 'biz-1', items: [{ productId: 'prod-2', productName: 'Cappuccino', quantity: 1, price: 20000 }], total: 20000, timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 'sale-3', businessId: 'biz-1', items: [{ productId: 'prod-3', productName: 'Latte', quantity: 1, price: 22000 }, { productId: 'prod-4', productName: 'Croissant', quantity: 1, price: 18000 }], total: 40000, timestamp: new Date(Date.now() - 10800000).toISOString() },
    
    // Recent sales for Outfit Keren (high margin)
    { id: 'sale-4', businessId: 'biz-2', items: [{ productId: 'prod-12', productName: 'Leather Jacket', quantity: 1, price: 800000 }], total: 800000, timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 'sale-5', businessId: 'biz-2', items: [{ productId: 'prod-11', productName: 'Sneakers', quantity: 1, price: 500000 }], total: 500000, timestamp: new Date(Date.now() - 172800000).toISOString() },
  ] as Sale[],
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      businesses: seedData.businesses,
      currentBusinessId: seedData.businesses[0]?.id || null,
      products: seedData.products,
      sales: seedData.sales,
      folders: [
        { id: 'folder-1', name: 'Reports', parentId: null },
        { id: 'folder-2', name: 'Invoices', parentId: null },
        { id: 'folder-3', name: 'Q1 2024', parentId: 'folder-1' },
      ],

      setCurrentBusiness: (id) => set({ currentBusinessId: id }),

      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, product],
        })),

      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      addSale: (sale) =>
        set((state) => {
          // Deduct stock for each item in the sale
          const updatedProducts = state.products.map((product) => {
            const saleItem = sale.items.find((item) => item.productId === product.id);
            if (saleItem) {
              return { ...product, stock: Math.max(0, product.stock - saleItem.quantity) };
            }
            return product;
          });

          return {
            sales: [sale, ...state.sales],
            products: updatedProducts,
          };
        }),

      addFolder: (folder) =>
        set((state) => ({
          folders: [...state.folders, folder],
        })),

      updateFolder: (id, name) =>
        set((state) => ({
          folders: state.folders.map((f) => (f.id === id ? { ...f, name } : f)),
        })),

      deleteFolder: (id) =>
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
        })),
    }),
    {
      name: 'bizness-storage',
    }
  )
);

// Hook to safely use store on client side
export function useClientStore() {
  const [hasMounted, setHasMounted] = React.useState(false);
  const store = useStore();

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return {
      ...store,
      currentBusinessId: store.businesses[0]?.id || null,
    };
  }

  return store;
}

