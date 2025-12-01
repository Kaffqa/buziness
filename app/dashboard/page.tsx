"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Sparkles,
  ArrowRight,
  Trophy,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const { products, sales, currentBusinessId } = useStore();

  const currentProducts = products.filter(
    (p) => p.businessId === currentBusinessId
  );
  const currentSales = sales.filter((s) => s.businessId === currentBusinessId);

  const revenueData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
        revenue: 0,
      };
    });

    currentSales.forEach((sale) => {
      const saleDate = new Date(sale.timestamp);
      const dayIndex = Math.floor(
        (Date.now() - saleDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (dayIndex >= 0 && dayIndex < 7) {
        last7Days[6 - dayIndex].revenue += sale.total;
      }
    });

    return last7Days;
  }, [currentSales]);

  const totalRevenue = currentSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProducts = currentProducts.length;
  const lowStockCount = currentProducts.filter((p) => p.stock < 5).length;

  // Calculate business health score (0-100)
  const healthScore = useMemo(() => {
    let score = 85; // Base score
    if (lowStockCount > 0) score -= lowStockCount * 5;
    if (currentSales.length === 0) score -= 10;
    return Math.max(0, Math.min(100, score));
  }, [lowStockCount, currentSales.length]);

  // Gamification rank
  const getRank = (score: number) => {
    if (score >= 90) return { name: "Juragan Besar", next: 100, progress: 100 };
    if (score >= 75) return { name: "Juragan Muda", next: 90, progress: (score - 75) / 15 * 100 };
    if (score >= 60) return { name: "Pengusaha", next: 75, progress: (score - 60) / 15 * 100 };
    return { name: "Pemula", next: 60, progress: (score / 60) * 100 };
  };

  const rank = getRank(healthScore);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Overview of your business performance</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Health Score Card - Large */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Business Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <div className="text-5xl font-bold text-primary">
                  {healthScore}
                  <span className="text-2xl text-slate-400">/100</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Overall business performance
                </p>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-success transition-all"
                    style={{ width: `${healthScore}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-4 w-4 text-success" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {currentSales.length} transactions
            </p>
            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Products Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-4 w-4 text-primary" />
              Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {totalProducts}
            </div>
            <p className="mt-1 text-xs text-slate-500">Total items</p>
            {lowStockCount > 0 && (
              <Badge variant="warning" className="mt-2">
                {lowStockCount} low stock
              </Badge>
            )}
          </CardContent>
        </Card>
        </motion.div>

        {/* Gamification Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Current Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-2xl font-bold text-slate-900">
                  {rank.name}
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Next level: {rank.next}/100
                </p>
                <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all"
                    style={{ width: `${rank.progress}%` }}
                  />
                </div>
              </div>
              <Trophy className="h-12 w-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard/pos">
                <Button className="w-full gap-2" size="lg">
                  <ShoppingCart className="h-4 w-4" />
                  New Sale
                </Button>
              </Link>
              <Link href="/dashboard/inventory">
                <Button className="w-full gap-2" size="lg" variant="outline">
                  <Package className="h-4 w-4" />
                  Add Stock
                </Button>
              </Link>
              <Link href="/dashboard/ai-tools">
                <Button className="w-full gap-2" size="lg" variant="outline">
                  <Sparkles className="h-4 w-4" />
                  Ask AI
                </Button>
              </Link>
              <Link href="/dashboard/reports">
                <Button className="w-full gap-2" size="lg" variant="outline">
                  <Activity className="h-4 w-4" />
                  View Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Recent Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ fill: "#4F46E5", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </div>
  );
}

