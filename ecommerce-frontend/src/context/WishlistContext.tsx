"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Wishlist, Product } from "@/types";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@/services/wishlistService";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
  wishlist: Wishlist | null;
  isLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  addProduct: (productId: string) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(
    function () {
      if (isAuthenticated) {
        loadWishlist();
      } else {
        setWishlist(null);
      }
    },
    [isAuthenticated]
  );

  async function loadWishlist() {
    try {
      setIsLoading(true);
      const data = await getWishlist();
      setWishlist(data.wishlist);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Check if a specific product is already in the wishlist
  function isInWishlist(productId: string): boolean {
    if (!wishlist || !wishlist.products) return false;
    return wishlist.products.some(function (product) {
      // The product might be a full object or just an ID depending on whether it's populated
      if (typeof product === "string") {
        return product === productId;
      }
      return (product as Product)._id === productId;
    });
  }

  async function addProduct(productId: string) {
    const data = await addToWishlist(productId);
    setWishlist(data.wishlist);
  }

  async function removeProduct(productId: string) {
    const data = await removeFromWishlist(productId);
    setWishlist(data.wishlist);
  }

  const value: WishlistContextType = {
    wishlist,
    isLoading,
    isInWishlist,
    addProduct,
    removeProduct,
  };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used inside a WishlistProvider");
  }
  return context;
}
