"use client";

import React, { useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { getProductBySlug } from "@/services/productService";
import { formatPrice, getDiscountPercent } from "@/utils/formatPrice";
import { formatDate } from "@/utils/formatDate";
import { OrderStatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useEffect } from "react";
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";

interface ProductPageProps {
  params: { slug: string };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { isInWishlist, addProduct, removeProduct } = useWishlist();
  const router = useRouter();

  useEffect(
    function () {
      async function loadProduct() {
        try {
          const data = await getProductBySlug(params.slug);
          setProduct(data.product);
        } catch (error) {
          setProduct(null);
        } finally {
          setIsLoading(false);
        }
      }
      loadProduct();
    },
    [params.slug]
  );

  if (isLoading) {
    return (
      <div className="page-loader">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[selectedImage]?.url || product.images[0].url
      : "/placeholder-product.png";

  const inWishlist = isInWishlist(product._id);
  const activePrice =
    product.discountedPrice && product.discountedPrice > 0
      ? product.discountedPrice
      : product.price;
  const discountPercent = getDiscountPercent(product.price, product.discountedPrice || 0);
  const isOutOfStock = product.stock === 0;

  async function handleAddToCart() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      setIsAddingToCart(true);
      await addItem(product!._id, quantity);
      toast.success("Added to cart!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not add to cart.");
    } finally {
      setIsAddingToCart(false);
    }
  }

  async function handleWishlistToggle() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (inWishlist) {
      await removeProduct(product!._id);
      toast.info("Removed from wishlist.");
    } else {
      await addProduct(product!._id);
      toast.success("Added to wishlist!");
    }
  }

  return (
    <div className="page-section">
      <div className="container">
        {/* Product details grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--spacing-3xl)",
            marginBottom: "var(--spacing-3xl)",
          }}
        >
          {/* Image gallery */}
          <div>
            <div
              style={{
                position: "relative",
                aspectRatio: "1 / 1",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                background: "var(--color-border-light)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              <Image
                src={mainImage}
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              {discountPercent > 0 && (
                <span className="product-discount-badge">{discountPercent}% OFF</span>
              )}
            </div>

            {/* Thumbnail row */}
            {product.images.length > 1 && (
              <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
                {product.images.map(function (img, index) {
                  return (
                    <button
                      key={img.public_id}
                      onClick={function () {
                        setSelectedImage(index);
                      }}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: "var(--radius-sm)",
                        overflow: "hidden",
                        border: index === selectedImage ? "2px solid var(--color-primary)" : "2px solid var(--color-border)",
                        position: "relative",
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={img.url}
                        alt={`${product.name} image ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)", marginBottom: "var(--spacing-sm)" }}>
              {product.category?.name}
            </p>

            <h1
              style={{
                fontSize: "var(--font-size-3xl)",
                fontWeight: 700,
                marginBottom: "var(--spacing-md)",
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-lg)" }}>
              <span style={{ color: "var(--color-secondary)", fontSize: "1.1rem" }}>
                {"★".repeat(Math.round(product.ratings))}{"☆".repeat(5 - Math.round(product.ratings))}
              </span>
              <span style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
                {product.numReviews} reviews
              </span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: "var(--spacing-lg)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "var(--spacing-sm)" }}>
                <span style={{ fontSize: "var(--font-size-4xl)", fontWeight: 800, color: "var(--color-text-primary)" }}>
                  {formatPrice(activePrice)}
                </span>
                {discountPercent > 0 && (
                  <span style={{ fontSize: "var(--font-size-xl)", color: "var(--color-text-muted)", textDecoration: "line-through" }}>
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              {discountPercent > 0 && (
                <p style={{ color: "var(--color-success)", fontWeight: 600, fontSize: "var(--font-size-sm)", marginTop: "4px" }}>
                  You save {formatPrice(product.price - activePrice)} ({discountPercent}%)
                </p>
              )}
            </div>

            {/* Stock info */}
            <p style={{ fontSize: "var(--font-size-sm)", marginBottom: "var(--spacing-lg)", color: isOutOfStock ? "var(--color-error)" : "var(--color-success)", fontWeight: 500 }}>
              {isOutOfStock ? "Out of Stock" : `In Stock (${product.stock} available)`}
            </p>

            {/* Quantity picker */}
            {!isOutOfStock && (
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
                <span style={{ fontWeight: 500, fontSize: "var(--font-size-sm)" }}>Quantity:</span>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                  <button
                    className="qty-btn"
                    onClick={function () {
                      setQuantity(function (q) {
                        return Math.max(1, q - 1);
                      });
                    }}
                  >
                    −
                  </button>
                  <span className="qty-display">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={function () {
                      setQuantity(function (q) {
                        return Math.min(product!.stock, q + 1);
                      });
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                isLoading={isAddingToCart}
                disabled={isOutOfStock}
                style={{ flex: 1 }}
              >
                <ShoppingCart size={18} />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleWishlistToggle}
                style={{ color: inWishlist ? "var(--color-error)" : undefined, borderColor: inWishlist ? "var(--color-error)" : undefined }}
              >
                <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
              </Button>
            </div>

            {/* Description */}
            <div>
              <h2 style={{ fontWeight: 600, fontSize: "var(--font-size-lg)", marginBottom: "var(--spacing-sm)" }}>
                Product Description
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        {product.reviews && product.reviews.length > 0 && (
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "var(--font-size-2xl)", marginBottom: "var(--spacing-xl)" }}>
              Customer Reviews ({product.numReviews})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
              {product.reviews.map(function (review) {
                return (
                  <div
                    key={review._id}
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      padding: "var(--spacing-lg)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--spacing-sm)" }}>
                      <div>
                        <p style={{ fontWeight: 600 }}>{review.name}</p>
                        <span style={{ color: "var(--color-secondary)" }}>
                          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      <span style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <p style={{ color: "var(--color-text-secondary)" }}>{review.comment}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
