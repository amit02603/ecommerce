"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Cart, CartItem } from "@/types";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "@/services/cartService";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  totalItems: number;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearAllItems: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load the cart whenever the user's auth state changes
  useEffect(
    function () {
      if (isAuthenticated) {
        refreshCart();
      } else {
        // Clear the cart state when the user logs out
        setCart(null);
      }
    },
    [isAuthenticated]
  );

  async function refreshCart() {
    try {
      setIsLoading(true);
      const data = await getCart();
      setCart(data.cart);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function addItem(productId: string, quantity: number) {
    const data = await addToCart(productId, quantity);
    setCart(data.cart);
  }

  async function updateItem(itemId: string, quantity: number) {
    const data = await updateCartItem(itemId, quantity);
    setCart(data.cart);
  }

  async function removeItem(itemId: string) {
    const data = await removeFromCart(itemId);
    setCart(data.cart);
  }

  async function clearAllItems() {
    await clearCart();
    setCart(null);
  }

  // Calculate total number of items in the cart (sum of all quantities)
  const totalItems = cart
    ? cart.items.reduce(function (sum, item) {
        return sum + item.quantity;
      }, 0)
    : 0;

  const value: CartContextType = {
    cart,
    isLoading,
    totalItems,
    addItem,
    updateItem,
    removeItem,
    clearAllItems,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return context;
}
