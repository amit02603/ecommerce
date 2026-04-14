"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAllOrders, updateOrderStatus } from "@/services/orderService";
import { Order } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import { formatDate } from "@/utils/formatDate";
import { OrderStatusBadge } from "@/components/ui/Badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/ui/Spinner";
import { toast } from "react-toastify";

const ORDER_STATUSES = ["processing", "shipped", "delivered", "cancelled"] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(function () {
    getAllOrders()
      .then(function (data) {
        setOrders(data.orders);
      })
      .catch(function (error) {
        console.error("Failed to load orders:", error);
      })
      .finally(function () {
        setIsLoading(false);
      });
  }, []);

  async function handleStatusChange(orderId: string, status: Order["orderStatus"]) {
    try {
      setUpdatingId(orderId);
      const data = await updateOrderStatus(orderId, status);
      setOrders(function (prev) {
        return prev.map(function (o) {
          return o._id === orderId ? data.order : o;
        });
      });
      toast.success("Order status updated.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="page-section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "var(--spacing-xl)", alignItems: "start" }}>
            <nav className="dashboard-sidebar">
              <Link href="/admin" className="dashboard-sidebar-link">Overview</Link>
              <Link href="/admin/products" className="dashboard-sidebar-link">Products</Link>
              <Link href="/admin/orders" className="dashboard-sidebar-link active">Orders</Link>
            </nav>

            <div>
              <h1 style={{ fontWeight: 700, fontSize: "var(--font-size-2xl)", marginBottom: "var(--spacing-xl)" }}>
                All Orders
              </h1>

              {isLoading ? (
                <div className="page-loader"><Spinner size="md" /></div>
              ) : (
                <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Update Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(function (order) {
                        const customer = typeof order.user === "object" ? order.user : null;
                        return (
                          <tr key={order._id}>
                            <td style={{ fontWeight: 500 }}>#{order._id.slice(-8).toUpperCase()}</td>
                            <td>{customer ? customer.name : "—"}</td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td style={{ fontWeight: 600 }}>{formatPrice(order.totalPrice)}</td>
                            <td><OrderStatusBadge status={order.orderStatus} /></td>
                            <td>
                              <select
                                value={order.orderStatus}
                                onChange={function (e) {
                                  handleStatusChange(order._id, e.target.value as Order["orderStatus"]);
                                }}
                                disabled={updatingId === order._id || order.orderStatus === "delivered" || order.orderStatus === "cancelled"}
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: "var(--radius-sm)",
                                  border: "1px solid var(--color-border)",
                                  fontSize: "var(--font-size-sm)",
                                  background: "var(--color-surface)",
                                }}
                              >
                                {ORDER_STATUSES.map(function (status) {
                                  return (
                                    <option key={status} value={status}>
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {orders.length === 0 && (
                    <div className="empty-state" style={{ padding: "var(--spacing-2xl)" }}>
                      <p className="empty-state-title">No orders yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
