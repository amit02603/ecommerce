"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAllOrders } from "@/services/orderService";
import { getProducts } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { formatPrice } from "@/utils/formatPrice";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/ui/Spinner";
import { Package, ShoppingBag, Tag, DollarSign } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCategories: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function () {
    async function loadStats() {
      try {
        const [ordersData, productsData, categoriesData] = await Promise.all([
          getAllOrders().catch(function () { return { orders: [], totalRevenue: 0, count: 0, success: false }; }),
          getProducts({ limit: 1 }).catch(function () { return { products: [], count: 0, totalCount: 0, success: false }; }),
          getCategories().catch(function () { return { categories: [], count: 0, success: false }; }),
        ]);

        setStats({
          totalOrders: ordersData.count || 0,
          totalRevenue: ordersData.totalRevenue || 0,
          totalProducts: productsData.totalCount || 0,
          totalCategories: categoriesData.count || 0,
        });
      } catch (error) {
        console.error("Failed to load admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  const statCards = [
    { icon: <Package size={24} />, label: "Total Orders", value: stats.totalOrders, color: "#6366f1" },
    { icon: <DollarSign size={24} />, label: "Total Revenue", value: formatPrice(stats.totalRevenue), color: "#10b981" },
    { icon: <ShoppingBag size={24} />, label: "Total Products", value: stats.totalProducts, color: "#f59e0b" },
    { icon: <Tag size={24} />, label: "Categories", value: stats.totalCategories, color: "#3b82f6" },
  ];

  return (
    <ProtectedRoute adminOnly>
      <div className="page-section">
        <div className="container">
          {/* Admin Sidebar */}
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "var(--spacing-xl)", alignItems: "start" }}>
            <nav className="dashboard-sidebar">
              <Link href="/admin" className="dashboard-sidebar-link active">
                Overview
              </Link>
              <Link href="/admin/products" className="dashboard-sidebar-link">
                Products
              </Link>
              <Link href="/admin/orders" className="dashboard-sidebar-link">
                Orders
              </Link>
            </nav>

            <div>
              <h1 style={{ fontWeight: 700, fontSize: "var(--font-size-2xl)", marginBottom: "var(--spacing-xl)" }}>
                Admin Dashboard
              </h1>

              {isLoading ? (
                <div className="page-loader">
                  <Spinner size="md" />
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--spacing-lg)" }}>
                  {statCards.map(function (card) {
                    return (
                      <div
                        key={card.label}
                        style={{
                          background: "var(--color-surface)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius-lg)",
                          padding: "var(--spacing-xl)",
                          display: "flex",
                          gap: "var(--spacing-lg)",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: "var(--radius-md)",
                            background: `${card.color}20`,
                            color: card.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {card.icon}
                        </div>
                        <div>
                          <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)", marginBottom: "4px" }}>
                            {card.label}
                          </p>
                          <p style={{ fontWeight: 700, fontSize: "var(--font-size-2xl)" }}>
                            {card.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
