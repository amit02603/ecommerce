"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getMyOrders } from "@/services/orderService";
import { Order } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import { formatDate } from "@/utils/formatDate";
import { OrderStatusBadge } from "@/components/ui/Badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/ui/Spinner";
import { Package, User, MapPin, Heart } from "lucide-react";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Only fetch orders once we know the user is authenticated.
  // Without this guard, the fetch runs before the token is set and gets a 401.
  useEffect(function () {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    getMyOrders()
      .then(function (data) {
        // Only show the 3 most recent orders on the dashboard overview
        setRecentOrders(data.orders.slice(0, 3));
      })
      .catch(function (error) {
        console.error("Failed to load orders:", error);
      })
      .finally(function () {
        setIsLoading(false);
      });
  }, [isAuthenticated]);

  return (
    <ProtectedRoute>
      <div className="page-section">
        <div className="container">
          <div className="dashboard-layout">
            {/* Sidebar navigation */}
            <nav className="dashboard-sidebar">
              <Link href="/dashboard" className="dashboard-sidebar-link active">
                <Package size={18} /> My Orders
              </Link>
              <Link href="/dashboard/profile" className="dashboard-sidebar-link">
                <User size={18} /> Profile
              </Link>
              <Link href="/dashboard/wishlist" className="dashboard-sidebar-link">
                <Heart size={18} /> Wishlist
              </Link>
              <Link href="/dashboard/addresses" className="dashboard-sidebar-link">
                <MapPin size={18} /> Addresses
              </Link>
            </nav>

            {/* Main content area */}
            <div>
              <div className="dashboard-content" style={{ marginBottom: "var(--spacing-lg)" }}>
                <h1 style={{ fontWeight: 700, fontSize: "var(--font-size-2xl)", marginBottom: "var(--spacing-xs)" }}>
                  Hello, {user?.name?.split(" ")[0]} 👋
                </h1>
                <p style={{ color: "var(--color-text-secondary)" }}>
                  Welcome to your account dashboard.
                </p>
              </div>

              {/* Recent Orders */}
              <div className="dashboard-content">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-lg)" }}>
                  <h2 style={{ fontWeight: 700, fontSize: "var(--font-size-xl)" }}>Recent Orders</h2>
                  <Link href="/dashboard/orders" style={{ color: "var(--color-primary)", fontSize: "var(--font-size-sm)" }}>
                    View all →
                  </Link>
                </div>

                {isLoading ? (
                  <div style={{ textAlign: "center", padding: "var(--spacing-xl)" }}>
                    <Spinner size="md" />
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="empty-state">
                    <p className="empty-state-title">No orders yet</p>
                    <p className="empty-state-text">
                      When you place your first order, it will show up here.
                    </p>
                    <Link href="/products" className="btn btn-primary btn-md" style={{ marginTop: "16px", display: "inline-block" }}>
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div>
                    {recentOrders.map(function (order) {
                      return (
                        <Link
                          key={order._id}
                          href={`/dashboard/orders/${order._id}`}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "var(--spacing-md)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "var(--radius-md)",
                            marginBottom: "var(--spacing-sm)",
                            transition: "background var(--transition-fast)",
                          }}
                          className="hover-bg"
                        >
                          <div>
                            <p style={{ fontWeight: 600, marginBottom: "4px" }}>
                              Order #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
                              {formatDate(order.createdAt)} · {order.items.length} item(s)
                            </p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontWeight: 700, marginBottom: "4px" }}>
                              {formatPrice(order.totalPrice)}
                            </p>
                            <OrderStatusBadge status={order.orderStatus} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
