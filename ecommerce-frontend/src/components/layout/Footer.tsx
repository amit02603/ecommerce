import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h3 className="footer-logo">ShopNest</h3>
          <p className="footer-tagline">
            Your one-stop shop for everything you need, delivered fast.
          </p>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Shop</h4>
          <ul className="footer-links">
            <li><Link href="/products">All Products</Link></li>
            <li><Link href="/products?sort=newest">New Arrivals</Link></li>
            <li><Link href="/products?sort=-ratings">Best Sellers</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Account</h4>
          <ul className="footer-links">
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/register">Register</Link></li>
            <li><Link href="/dashboard">My Orders</Link></li>
            <li><Link href="/dashboard/wishlist">Wishlist</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Help</h4>
          <ul className="footer-links">
            <li><Link href="#">Shipping Info</Link></li>
            <li><Link href="#">Returns</Link></li>
            <li><Link href="#">Contact Us</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} ShopNest. All rights reserved.</p>
      </div>
    </footer>
  );
}
