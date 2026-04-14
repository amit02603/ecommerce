"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Metadata } from "next";
import { getProducts } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { Product, Category } from "@/types";
import ProductGrid from "@/components/product/ProductGrid";
import Button from "@/components/ui/Button";

// How many products to show per page
const PRODUCTS_PER_PAGE = 12;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "-createdAt";
  const page = Number(searchParams.get("page")) || 1;

  const fetchProducts = useCallback(
    async function () {
      try {
        setIsLoading(true);
        const data = await getProducts({
          keyword: keyword || undefined,
          category: category || undefined,
          sort,
          page,
          limit: PRODUCTS_PER_PAGE,
        });
        setProducts(data.products);
        setTotalCount(data.totalCount);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [keyword, category, sort, page]
  );

  useEffect(
    function () {
      fetchProducts();
    },
    [fetchProducts]
  );

  useEffect(function () {
    getCategories()
      .then(function (data) {
        setCategories(data.categories);
      })
      .catch(function () {
        setCategories([]);
      });
  }, []);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to page 1 whenever a filter changes, but NOT when changing the page itself
    if (key !== "page") {
      params.delete("page");
    }
    router.push(`/products?${params.toString()}`);
  }

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  return (
    <div className="page-section">
      <div className="container">
        <div style={{ display: "flex", gap: "32px", alignItems: "start" }}>
          {/* Filter Sidebar */}
          <aside
            style={{
              width: 240,
              flexShrink: 0,
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--spacing-lg)",
            }}
          >
            <h2 style={{ fontWeight: 700, marginBottom: "var(--spacing-lg)" }}>
              Filters
            </h2>

            {/* Category filter */}
            <div style={{ marginBottom: "var(--spacing-lg)" }}>
              <h3
                style={{
                  fontSize: "var(--font-size-sm)",
                  fontWeight: 600,
                  marginBottom: "var(--spacing-sm)",
                  color: "var(--color-text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Category
              </h3>
              <button
                onClick={function () {
                  updateParam("category", "");
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 0",
                  fontSize: "var(--font-size-sm)",
                  color: !category ? "var(--color-primary)" : "var(--color-text-secondary)",
                  fontWeight: !category ? 600 : 400,
                }}
              >
                All Categories
              </button>
              {categories.map(function (cat) {
                return (
                  <button
                    key={cat._id}
                    onClick={function () {
                      updateParam("category", cat._id);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 0",
                      fontSize: "var(--font-size-sm)",
                      color: category === cat._id ? "var(--color-primary)" : "var(--color-text-secondary)",
                      fontWeight: category === cat._id ? 600 : 400,
                      borderBottom: "1px solid var(--color-border-light)",
                    }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Sort filter */}
            <div>
              <h3
                style={{
                  fontSize: "var(--font-size-sm)",
                  fontWeight: 600,
                  marginBottom: "var(--spacing-sm)",
                  color: "var(--color-text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Sort By
              </h3>
              {[
                { label: "Newest First", value: "-createdAt" },
                { label: "Price: Low to High", value: "price" },
                { label: "Price: High to Low", value: "-price" },
                { label: "Top Rated", value: "-ratings" },
              ].map(function (option) {
                return (
                  <button
                    key={option.value}
                    onClick={function () {
                      updateParam("sort", option.value);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 0",
                      fontSize: "var(--font-size-sm)",
                      color: sort === option.value ? "var(--color-primary)" : "var(--color-text-secondary)",
                      fontWeight: sort === option.value ? 600 : 400,
                      borderBottom: "1px solid var(--color-border-light)",
                    }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Product grid area */}
          <div style={{ flex: 1 }}>
            {/* Header row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "var(--spacing-xl)",
              }}
            >
              <h1 style={{ fontWeight: 700, fontSize: "var(--font-size-2xl)" }}>
                {keyword ? `Results for "${keyword}"` : "All Products"}
              </h1>
              <span style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
                {totalCount} products
              </span>
            </div>

            <ProductGrid products={products} isLoading={isLoading} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "var(--spacing-2xl)",
                }}
              >
                {Array.from({ length: totalPages }, function (_, i) {
                  return i + 1;
                }).map(function (pageNum) {
                  return (
                    <button
                      key={pageNum}
                      onClick={function () {
                        updateParam("page", String(pageNum));
                      }}
                      className={`btn ${pageNum === page ? "btn-primary" : "btn-outline"} btn-sm`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
