import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getProducts } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import ProductGrid from "@/components/product/ProductGrid";

export const metadata: Metadata = {
  title: "ShopNest — Modern eCommerce Store",
  description: "Shop the latest products across electronics, fashion, home and more.",
};

// This is a Server Component (no "use client" at the top).
// Next.js App Router fetches data on the server so the page is SEO-friendly.
export default async function HomePage() {
  // Fetch featured products and categories on the server
  const [productsData, categoriesData] = await Promise.all([
    getProducts({ limit: 8, sort: "-createdAt" }).catch(function () {
      return { success: false, products: [], count: 0, totalCount: 0 };
    }),
    getCategories().catch(function () {
      return { success: false, categories: [], count: 0 };
    }),
  ]);

  const products = productsData.products || [];
  const categories = categoriesData.categories || [];

  return (
    <>
      {/* Hero Banner */}
      <section className="hero">
        <div className="container fade-in">
          <h1 className="hero-title">
            Everything You Need,<br />In One Place
          </h1>
          <p className="hero-subtitle">
            Shop thousands of products across hundreds of categories. Fast delivery, easy returns.
          </p>
          <div className="hero-actions">
            <Link href="/products" className="btn btn-lg" style={{ background: "white", color: "#6366f1" }}>
              Shop Now
            </Link>
            <Link href="/register" className="btn btn-lg btn-outline" style={{ borderColor: "rgba(255,255,255,0.6)", color: "white" }}>
              Join Free
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="page-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Shop by Category</h2>
              <Link href="/products" className="section-link">View all →</Link>
            </div>
            <div className="category-grid">
              {categories.slice(0, 6).map(function (category) {
                return (
                  <Link
                    key={category._id}
                    href={`/products?category=${category._id}`}
                    className="category-card"
                  >
                    <span style={{ fontSize: "2rem" }}>🛍️</span>
                    <span className="category-card-name">{category.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      <section className="page-section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">New Arrivals</h2>
            <Link href="/products?sort=-createdAt" className="section-link">
              View all →
            </Link>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>

      {/* Value proposition banner */}
      <section className="page-section">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              textAlign: "center",
            }}
          >
            {[
              { icon: "🚚", title: "Free Delivery", text: "On orders above ₹500" },
              { icon: "↩️", title: "Easy Returns", text: "30-day return policy" },
              { icon: "🔒", title: "Secure Payments", text: "Powered by Stripe" },
            ].map(function (item) {
              return (
                <div
                  key={item.title}
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--spacing-xl)",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "var(--spacing-sm)" }}>{item.icon}</div>
                  <h3 style={{ fontWeight: 600, marginBottom: "4px" }}>{item.title}</h3>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
