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

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function () {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    getMyOrders()
      .then(function (data) {
        setOrders(data.orders);
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
            <nav className="dashboard-sidebar">
              <Link href="/dashboard" className="dashboard-sidebar-link">
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

            <div className="dashboard-content">
              <h1 style={{ fontWeight: 700, fontSize: "var(--font-size-2xl)", marginBottom: "var(--spacing-xl)" }}>
                My Orders
              </h1>

              {isLoading ? (
                <div style={{ textAlign: "center", padding: "var(--spacing-2xl)" }}>
                  <Spinner size="md" />
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-state-title">No orders yet</p>
                  <p className="empty-state-text">Your orders will appear here once you place one.</p>
                  <Link href="/products" className="btn btn-primary btn-md" style={{ marginTop: "16px", display: "inline-block" }}>
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div>
                  {orders.map(function (order) {
                    return (
                      <Link
                        key={order._id}
                        href={`/dashboard/orders/${order._id}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "var(--spacing-lg)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius-md)",
                          marginBottom: "var(--spacing-sm)",
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: 600, marginBottom: "4px" }}>
                            Order #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
                            {formatDate(order.createdAt)}
                          </p>
                          <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
                            {order.items.length} item(s)
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontWeight: 700, fontSize: "var(--font-size-lg)", marginBottom: "8px" }}>
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
    </ProtectedRoute>
  );
}
