import React from "react";
import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

// Renders a responsive grid of product cards
export default function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    // Show placeholder skeleton cards while products are loading
    return (
      <div className="product-grid">
        {Array.from({ length: 8 }).map(function (_, index) {
          return <div key={index} className="product-card-skeleton" />;
        })}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">No products found</p>
        <p className="empty-state-text">
          Try adjusting your search or filter to find what you are looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map(function (product) {
        return <ProductCard key={product._id} product={product} />;
      })}
    </div>
  );
}
