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
                    <CategoryIcon name={category.name} />
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

// ─── Category Icon Component ───────────────────────────────────────────────────
// Returns a clean, simple SVG icon matching the category name.
// Falls back to a generic shopping-bag icon for unknown categories.
function CategoryIcon({ name }: { name: string }) {
  const key = name.toLowerCase();

  const iconStyle: React.CSSProperties = {
    width: "2rem",
    height: "2rem",
    strokeWidth: 1.6,
    stroke: "currentColor",
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    flexShrink: 0,
  };

  // Electronics — circuit / chip
  if (key.includes("electronic")) {
    return (
      <svg viewBox="0 0 24 24" style={iconStyle} aria-hidden="true">
        <rect x="5" y="5" width="14" height="14" rx="2" />
        <path d="M9 9h6v6H9z" />
        <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
      </svg>
    );
  }

  // Fashion — hanger / shirt
  if (key.includes("fashion")) {
    return (
      <svg viewBox="0 0 24 24" style={iconStyle} aria-hidden="true">
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.13z" />
      </svg>
    );
  }

  // Home & Kitchen — house
  if (key.includes("home") || key.includes("kitchen")) {
    return (
      <svg viewBox="0 0 24 24" style={iconStyle} aria-hidden="true">
        <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    );
  }

  // Books — open book
  if (key.includes("book")) {
    return (
      <svg viewBox="0 0 24 24" style={iconStyle} aria-hidden="true">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3z" />
      </svg>
    );
  }

  // Sports — dumbbell
  if (key.includes("sport")) {
    return (
      <svg viewBox="0 0 24 24" style={iconStyle} aria-hidden="true">
        <path d="M6.5 6.5h11M6.5 17.5h11" />
        <path d="M3 9.5h2.5v5H3zM18.5 9.5H21v5h-2.5z" />
        <path d="M5.5 7.5v9M18.5 7.5v9" />
        <line x1="5.5" y1="12" x2="18.5" y2="12" />
      </svg>
    );
  }

  // Beauty — lipstick / sparkle
  if (key.includes("beauty") || key.includes("cosmetic")) {
    return (
      <svg viewBox="0 0 24 24" style={iconStyle} aria-hidden="true">
        <path d="M12 2a5 5 0 0 1 5 5c0 2.76-5 11-5 11S7 9.76 7 7a5 5 0 0 1 5-5z" />
        <circle cx="12" cy="7" r="2" />
        <path d="M5 20c0-2 3-3 7-3s7 1 7 3" />
      </svg>
    );
  }

  // Fallback — shopping bag
  return (
    <svg viewBox="0 0 24 24" style={iconStyle} aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
