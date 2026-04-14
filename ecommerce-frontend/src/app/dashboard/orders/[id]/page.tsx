"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { getOrderById } from "@/services/orderService";
import { Order } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import { formatDate } from "@/utils/formatDate";
import { OrderStatusBadge } from "@/components/ui/Badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/ui/Spinner";
import { ArrowLeft, MapPin, CreditCard, Package } from "lucide-react";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  // Unwrap the params Promise before accessing properties (Next 15 standard)
  const { id } = use(params);
  
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(function () {
    if (!isAuthenticated) {
      if (!authLoading) setIsLoading(false);
      return;
    }
    
    getOrderById(id)
      .then(function (data) {
        setOrder(data.order);
      })
      .catch(function (error) {
        console.error("Failed to fetch order:", error);
        // If order doesn't exist or doesn't belong to the user, redirect to orders list
        if (error?.response?.status === 404 || error?.response?.status === 403) {
          router.push("/dashboard/orders");
        }
      })
      .finally(function () {
        setIsLoading(false);
      });
  }, [id, isAuthenticated, authLoading, router]);

  return (
    <ProtectedRoute>
      <div className="page-section">
        <div className="container" style={{ maxWidth: "800px" }}>
          
          <Link href="/dashboard/orders" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--color-text-secondary)", marginBottom: "var(--spacing-xl)", fontWeight: 500 }}>
            <ArrowLeft size={16} /> Back to Orders
          </Link>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "var(--spacing-3xl)" }}>
              <Spinner size="lg" />
            </div>
          ) : !order ? (
            <div className="empty-state">
              <p className="empty-state-title">Order Not Found</p>
              <p className="empty-state-text">The order you are looking for does not exist.</p>
              <Link href="/dashboard/orders" className="btn btn-primary btn-md" style={{ marginTop: "16px", display: "inline-block" }}>
                Return to My Orders
              </Link>
            </div>
          ) : (
            <div>
              {/* Order Header */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "var(--spacing-md)", marginBottom: "var(--spacing-xl)" }}>
                <div>
                  <h1 style={{ fontWeight: 700, fontSize: "var(--font-size-2xl)", marginBottom: "4px" }}>
                    Order Details
                  </h1>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>
                    Order #{order._id} • Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <OrderStatusBadge status={order.orderStatus} />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "var(--spacing-lg)",
                  alignItems: "start",
                }}
              >
                
                {/* Main Content Area: Items list */}
                <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "var(--spacing-xl)", marginBottom: "var(--spacing-lg)" }}>
                  <h2 style={{ fontWeight: 600, fontSize: "var(--font-size-lg)", marginBottom: "var(--spacing-lg)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Package size={20} /> Items Ordered
                  </h2>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
                    {order.items.map(function (item) {
                      return (
                        <div key={item.product?.toString()} style={{ display: "flex", gap: "var(--spacing-md)", paddingBottom: "var(--spacing-md)", borderBottom: "1px solid var(--color-border-light)" }}>
                          <Image
                            src={item.image || "/placeholder-product.png"}
                            alt={item.name}
                            width={70}
                            height={70}
                            style={{ borderRadius: "var(--radius-sm)", objectFit: "cover" }}
                          />
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <Link href={`/products/${item.product}`}>
                              <p style={{ fontWeight: 500 }}>{item.name}</p>
                            </Link>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>
                              <span>Qty: {item.quantity}</span>
                              <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sidebar Area: Summary, Shipping, Payment */}
                <div>
                  {/* Order Summary */}
                  <div className="cart-summary-card" style={{ marginBottom: "var(--spacing-lg)" }}>
                    <p className="cart-summary-title">Summary</p>
                    <div className="cart-summary-row">
                      <span>Items Subtotal</span>
                      <span>{formatPrice(order.itemsPrice)}</span>
                    </div>
                    <div className="cart-summary-row">
                      <span>Shipping</span>
                      <span>{order.shippingPrice === 0 ? "FREE" : formatPrice(order.shippingPrice)}</span>
                    </div>
                    <div className="cart-summary-row">
                      <span>Tax</span>
                      <span>{formatPrice(order.taxPrice)}</span>
                    </div>
                    <div className="cart-summary-total">
                      <span>Total</span>
                      <span>{formatPrice(order.totalPrice)}</span>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "var(--spacing-lg)", marginBottom: "var(--spacing-lg)" }}>
                    <h3 style={{ fontWeight: 600, fontSize: "var(--font-size-md)", marginBottom: "var(--spacing-md)", display: "flex", alignItems: "center", gap: "8px" }}>
                      <MapPin size={18} /> Shipping Address
                    </h3>
                    <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)", lineHeight: 1.6 }}>
                      <p>{order.shippingAddress.street}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "var(--spacing-lg)" }}>
                    <h3 style={{ fontWeight: 600, fontSize: "var(--font-size-md)", marginBottom: "var(--spacing-md)", display: "flex", alignItems: "center", gap: "8px" }}>
                      <CreditCard size={18} /> Payment
                    </h3>
                    <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>
                      <p style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span>Method:</span>
                        <span style={{ fontWeight: 500 }}>Stripe Card</span>
                      </p>
                      <p style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Status:</span>
                        <span style={{ fontWeight: 500, color: order.paymentInfo?.status === "succeeded" ? "var(--color-success)" : "var(--color-warning)" }}>
                          {order.paymentInfo?.status === "succeeded" ? "Paid" : "Pending"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
