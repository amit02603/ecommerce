"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, getDiscountPercent } from "@/utils/formatPrice";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addProduct, removeProduct } = useWishlist();
  const router = useRouter();

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0].url
      : "/placeholder-product.png";

  const inWishlist = isInWishlist(product._id);
  const discountPercent = getDiscountPercent(
    product.price,
    product.discountedPrice || 0
  );

  async function handleWishlistToggle(e: React.MouseEvent) {
    e.preventDefault(); // Prevent navigating to the product page
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (inWishlist) {
      await removeProduct(product._id);
    } else {
      await addProduct(product._id);
    }
  }

  const activePrice =
    product.discountedPrice && product.discountedPrice > 0
      ? product.discountedPrice
      : product.price;

  return (
    <Link href={`/products/${product.slug}`} className="product-card">
      <div className="product-card-image-wrapper">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="product-card-image"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {discountPercent > 0 && (
          <span className="product-discount-badge">{discountPercent}% OFF</span>
        )}
        {product.stock === 0 && (
          <div className="product-out-of-stock-overlay">Out of Stock</div>
        )}

        {/* Wishlist button */}
        <button
          className={`product-wishlist-btn ${inWishlist ? "active" : ""}`}
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="product-card-body">
        <p className="product-card-category">
          {product.category?.name || "Uncategorized"}
        </p>
        <h3 className="product-card-name">{product.name}</h3>

        <div className="product-card-rating">
          <span className="stars">{"★".repeat(Math.round(product.ratings))}{"☆".repeat(5 - Math.round(product.ratings))}</span>
          <span className="review-count">({product.numReviews})</span>
        </div>

        <div className="product-card-pricing">
          <span className="product-active-price">{formatPrice(activePrice)}</span>
          {discountPercent > 0 && (
            <span className="product-original-price">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
