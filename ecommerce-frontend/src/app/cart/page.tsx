"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import Button from "@/components/ui/Button";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, isLoading, updateItem, removeItem } = useCart();
  const router = useRouter();

  async function handleQuantityChange(itemId: string, newQuantity: number) {
    try {
      await updateItem(itemId, newQuantity);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not update quantity.");
    }
  }

  async function handleRemoveItem(itemId: string) {
    try {
      await removeItem(itemId);
      toast.info("Item removed from cart.");
    } catch (error) {
      toast.error("Could not remove item.");
    }
  }

  const shippingCharge = cart && cart.totalAmount > 500 ? 0 : 50;
  const taxAmount = cart ? Math.round(cart.totalAmount * 0.18) : 0;
  const grandTotal = cart ? cart.totalAmount + shippingCharge + taxAmount : 0;

  return (
    <ProtectedRoute>
      <div className="page-section">
        <div className="container">
          <h1 className="cart-title">My Cart</h1>

          {isLoading ? (
            <div className="page-loader">
              <Spinner size="lg" />
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="empty-state">
              <p style={{ fontSize: "4rem", marginBottom: "16px" }}>🛒</p>
              <p className="empty-state-title">Your cart is empty</p>
              <p className="empty-state-text" style={{ marginBottom: "24px" }}>
                Browse our products and add something you like!
              </p>
              <Link href="/products" className="btn btn-primary btn-md">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              {/* Cart items list */}
              <div>
                {cart.items.map(function (item) {
                  const itemImage =
                    item.product.images && item.product.images.length > 0
                      ? item.product.images[0].url
                      : "/placeholder-product.png";

                  return (
                    <div key={item._id} className="cart-item fade-in">
                      <Image
                        src={itemImage}
                        alt={item.product.name}
                        width={90}
                        height={90}
                        className="cart-item-image"
                        style={{ borderRadius: "var(--radius-sm)", objectFit: "cover" }}
                      />
                      <div className="cart-item-info">
                        <Link href={`/products/${item.product.slug}`}>
                          <p className="cart-item-name">{item.product.name}</p>
                        </Link>
                        <p className="cart-item-price">
                          {formatPrice(item.price)} each
                        </p>
                        <div className="cart-item-controls">
                          <button
                            className="qty-btn"
                            onClick={function () {
                              handleQuantityChange(item._id, item.quantity - 1);
                            }}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="qty-display">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={function () {
                              handleQuantityChange(item._id, item.quantity + 1);
                            }}
                            disabled={item.quantity >= item.product.stock}
                          >
                            +
                          </button>
                          <button
                            onClick={function () {
                              handleRemoveItem(item._id);
                            }}
                            style={{ marginLeft: "auto", color: "var(--color-error)" }}
                            title="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: "var(--font-size-lg)" }}>
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cart summary */}
              <div className="cart-summary-card">
                <p className="cart-summary-title">Order Summary</p>

                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.totalAmount)}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Shipping</span>
                  <span>
                    {shippingCharge === 0 ? (
                      <span style={{ color: "var(--color-success)", fontWeight: 500 }}>FREE</span>
                    ) : (
                      formatPrice(shippingCharge)
                    )}
                  </span>
                </div>
                <div className="cart-summary-row">
                  <span>GST (18%)</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
                <div className="cart-summary-total">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>

                {shippingCharge > 0 && (
                  <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", marginBottom: "var(--spacing-md)", textAlign: "center" }}>
                    Add {formatPrice(500 - cart.totalAmount)} more for free shipping
                  </p>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  onClick={function () {
                    router.push("/checkout");
                  }}
                  style={{ width: "100%" }}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
