"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, User, LogOut, Package, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          ShopNest
        </Link>

        {/* Desktop search bar */}
        <form
          className="navbar-search"
          onSubmit={function (e) {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const keyword = formData.get("keyword");
            if (keyword) {
              router.push(`/products?keyword=${keyword}`);
            }
          }}
        >
          <input
            type="text"
            name="keyword"
            placeholder="Search for products..."
            className="navbar-search-input"
          />
          <button type="submit" className="navbar-search-btn">
            Search
          </button>
        </form>

        {/* Desktop navigation icons */}
        <nav className="navbar-actions">
          {/* Wishlist link */}
          {isAuthenticated && (
            <Link href="/dashboard/wishlist" className="nav-icon-btn" title="Wishlist">
              <Heart size={22} />
            </Link>
          )}

          {/* Cart link with item count badge */}
          <Link href="/cart" className="nav-icon-btn" title="Cart">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="nav-badge">{totalItems}</span>
            )}
          </Link>

          {/* User menu */}
          {isAuthenticated ? (
            <div className="user-menu-wrapper">
              <button
                className="nav-icon-btn"
                onClick={function () {
                  setUserMenuOpen(function (prev) {
                    return !prev;
                  });
                }}
                title="Account"
              >
                <User size={22} />
              </button>

              {userMenuOpen && (
                <div className="user-dropdown">
                  <p className="user-dropdown-name">{user?.name}</p>
                  <Link
                    href="/dashboard"
                    className="user-dropdown-item"
                    onClick={function () {
                      setUserMenuOpen(false);
                    }}
                  >
                    <Package size={16} />
                    My Orders
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className="user-dropdown-item"
                      onClick={function () {
                        setUserMenuOpen(false);
                      }}
                    >
                      <Settings size={16} />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    className="user-dropdown-item user-dropdown-logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="mobile-menu-btn"
            onClick={function () {
              setMobileMenuOpen(function (prev) {
                return !prev;
              });
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <form
            onSubmit={function (e) {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const keyword = formData.get("keyword");
              if (keyword) {
                router.push(`/products?keyword=${keyword}`);
                setMobileMenuOpen(false);
              }
            }}
          >
            <input
              type="text"
              name="keyword"
              placeholder="Search products..."
              className="mobile-search-input"
            />
          </form>
          <Link href="/products" className="mobile-nav-link" onClick={function () { setMobileMenuOpen(false); }}>
            All Products
          </Link>
          <Link href="/cart" className="mobile-nav-link" onClick={function () { setMobileMenuOpen(false); }}>
            Cart ({totalItems})
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="mobile-nav-link" onClick={function () { setMobileMenuOpen(false); }}>
                My Account
              </Link>
              <button className="mobile-nav-link mobile-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="mobile-nav-link" onClick={function () { setMobileMenuOpen(false); }}>
              Login / Register
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
