"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import { Product } from "@/types";
import Button from "@/components/ui/Button";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/ui/Spinner";
import { toast } from "react-toastify";
import { Package, User, MapPin, Heart, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, isLoading, removeProduct } = useWishlist();
  const { addItem } = useCart();

  async function handleMoveToCart(product: Product) {
    try {
      await addItem(product._id, 1);
      await removeProduct(product._id);
      toast.success("Moved to cart!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not move to cart.");
    }
  }

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
              <Link href="/dashboard/wishlist" className="dashboard-sidebar-link active">
                <Heart size={18} /> Wishlist
              </Link>
              <Link href="/dashboard/addresses" className="dashboard-sidebar-link">
                <MapPin size={18} /> Addresses
              </Link>
            </nav>

            <div className="dashboard-content">
              <h1 style={{ fontWeight: 700, fontSize: "var(--font-size-2xl)", marginBottom: "var(--spacing-xl)" }}>
                My Wishlist
              </h1>

              {isLoading ? (
                <div style={{ textAlign: "center", padding: "var(--spacing-2xl)" }}>
                  <Spinner size="md" />
                </div>
              ) : !wishlist || wishlist.products.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-state-title">Your wishlist is empty</p>
                  <p className="empty-state-text">Save items you love by clicking the heart icon on any product.</p>
                  <Link href="/products" className="btn btn-primary btn-md" style={{ marginTop: "16px", display: "inline-block" }}>
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
                  {wishlist.products.map(function (product) {
                    const productObj = product as Product;
                    const imageUrl = productObj.images && productObj.images.length > 0
                      ? productObj.images[0].url
                      : "/placeholder-product.png";

                    return (
                      <div
                        key={productObj._id}
                        style={{
                          display: "flex",
                          gap: "var(--spacing-md)",
                          padding: "var(--spacing-md)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius-md)",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          src={imageUrl}
                          alt={productObj.name}
                          width={80}
                          height={80}
                          style={{ borderRadius: "var(--radius-sm)", objectFit: "cover" }}
                        />
                        <div style={{ flex: 1 }}>
                          <Link href={`/products/${productObj.slug}`}>
                            <p style={{ fontWeight: 600, marginBottom: "4px" }}>{productObj.name}</p>
                          </Link>
                          <p style={{ color: "var(--color-primary)", fontWeight: 700 }}>
                            {formatPrice(productObj.price)}
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={function () {
                              handleMoveToCart(productObj);
                            }}
                          >
                            Add to Cart
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={function () {
                              removeProduct(productObj._id);
                            }}
                            style={{ color: "var(--color-error)" }}
                          >
                            <Trash2 size={16} />
                          </Button>
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
