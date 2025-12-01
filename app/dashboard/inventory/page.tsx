"use client";

import { useState } from "react";
import { useStore, Product } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Package, Plus, Search, Filter, Sparkles } from "lucide-react";

export default function InventoryPage() {
  const { products, currentBusinessId, addProduct, updateProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    cost: "",
    stock: "",
  });

  const currentProducts = products.filter((p) => p.businessId === currentBusinessId);

  const filteredProducts = currentProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(currentProducts.map((p) => p.category)));

  const handleAISuggestPrice = () => {
    const cost = parseFloat(formData.cost);
    if (!isNaN(cost)) {
      const suggestedPrice = Math.round((cost * 1.5) / 1000) * 1000;
      setFormData((prev) => ({ ...prev, price: suggestedPrice.toString() }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        stock: parseInt(formData.stock),
      });
    } else {
      addProduct({
        id: `prod-${Date.now()}`,
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        stock: parseInt(formData.stock),
        businessId: currentBusinessId || "",
      });
    }
    setFormData({ name: "", category: "", price: "", cost: "", stock: "" });
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock: product.stock.toString(),
    });
    setShowAddForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory</h1>
          <p className="text-slate-500">Manage your products and stock</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Product Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Category</label>
                  <Input
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Cost (HPP)</label>
                  <Input
                    type="number"
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, cost: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Selling Price</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, price: e.target.value }))
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAISuggestPrice}
                      title="AI Suggest Price (Cost × 1.5)"
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Stock</label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, stock: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingProduct ? "Update" : "Add"} Product</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                    setFormData({ name: "", category: "", price: "", cost: "", stock: "" });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                    Cost
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`border-b border-slate-100 transition-colors hover:bg-slate-50 ${
                      product.stock < 5 ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{product.category}</Badge>
                    </td>
                    <td className="px-4 py-3">{formatCurrency(product.cost)}</td>
                    <td className="px-4 py-3 font-medium text-primary">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={product.stock < 5 ? "danger" : "success"}
                      >
                        {product.stock}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


