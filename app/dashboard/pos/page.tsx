"use client";

import { useState } from "react";
import { useStore, Sale } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Plus, Minus, Trash2, Receipt, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function POSPage() {
  const { products, currentBusinessId, addSale } = useStore();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);

  const currentProducts = products.filter(
    (p) => p.businessId === currentBusinessId && p.stock > 0
  );

  const addToCart = (product: typeof products[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.productId === productId);
      if (!item) return prev;

      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        return prev.filter((i) => i.productId !== productId);
      }

      return prev.map((i) =>
        i.productId === productId ? { ...i, quantity: newQuantity } : i
      );
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const sale: Sale = {
      id: `sale-${Date.now()}`,
      businessId: currentBusinessId || "",
      items: cart.map((item) => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      timestamp: new Date().toISOString(),
    };

    addSale(sale);
    setShowReceipt(true);
    setCart([]);

    // Auto-hide receipt after 3 seconds
    setTimeout(() => setShowReceipt(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Point of Sale</h1>
        <p className="text-slate-500">Cashier mode - Process transactions</p>
      </div>

      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Receipt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-slate-500">Transaction completed!</p>
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
              <Button
                className="mt-4 w-full"
                onClick={() => setShowReceipt(false)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Products Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {currentProducts.map((product, index) => (
                  <motion.button
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => addToCart(product)}
                    className="group rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-primary hover:shadow-md active:scale-95"
                  >
                    <div className="mb-2 flex h-24 items-center justify-center rounded-lg bg-slate-100">
                      <Package className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="font-medium text-slate-900">{product.name}</h3>
                    <p className="text-sm text-slate-500">{product.category}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-primary">
                        {formatCurrency(product.price)}
                      </span>
                      <Badge variant={product.stock < 5 ? "warning" : "secondary"}>
                        Stock: {product.stock}
                      </Badge>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  Cart is empty. Select products to add.
                </p>
              ) : (
                <>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    <AnimatePresence>
                      {cart.map((item) => (
                        <motion.div
                          key={item.productId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                        >
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {formatCurrency(item.price)} × {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    <Button
                      className="mt-4 w-full"
                      size="lg"
                      onClick={handleCheckout}
                    >
                      Checkout
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

