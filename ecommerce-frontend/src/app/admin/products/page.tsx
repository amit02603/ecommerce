"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, deleteProduct } from "@/services/productService";
import { Product } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import Button from "@/components/ui/Button";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/ui/Spinner";
import { toast } from "react-toastify";
import { Trash2, Plus } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(function () {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setIsLoading(true);
      const data = await getProducts({ limit: 100 });
      setProducts(data.products);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(productId: string) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeletingId(productId);
      await deleteProduct(productId);
      setProducts(function (prev) {
        return prev.filter(function (p) {
          return p._id !== productId;
        });
      });
      toast.success("Product deleted.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="page-section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "var(--spacing-xl)", alignItems: "start" }}>
            <nav className="dashboard-sidebar">
              <Link href="/admin" className="dashboard-sidebar-link">Overview</Link>
              <Link href="/admin/products" className="dashboard-sidebar-link active">Products</Link>
              <Link href="/admin/orders" className="dashboard-sidebar-link">Orders</Link>
            </nav>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-xl)" }}>
                <h1 style={{ fontWeight: 700, fontSize: "var(--font-size-2xl)" }}>Products</h1>
              </div>

              {isLoading ? (
                <div className="page-loader"><Spinner size="md" /></div>
              ) : (
                <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(function (product) {
                        return (
                          <tr key={product._id}>
                            <td>
                              <Link href={`/products/${product.slug}`} style={{ fontWeight: 500, color: "var(--color-primary)" }}>
                                {product.name}
                              </Link>
                            </td>
                            <td>{product.category?.name || "—"}</td>
                            <td>{formatPrice(product.price)}</td>
                            <td>
                              <span style={{ color: product.stock === 0 ? "var(--color-error)" : "var(--color-success)", fontWeight: 500 }}>
                                {product.stock}
                              </span>
                            </td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={function () { handleDelete(product._id); }}
                                isLoading={deletingId === product._id}
                              >
                                <Trash2 size={14} />
                                Delete
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {products.length === 0 && (
                    <div className="empty-state" style={{ padding: "var(--spacing-2xl)" }}>
                      <p className="empty-state-title">No products found</p>
                      <p className="empty-state-text">Use the API to create your first product.</p>
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
