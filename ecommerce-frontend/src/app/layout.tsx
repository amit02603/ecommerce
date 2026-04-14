import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ShopNest — Modern eCommerce Store",
    template: "%s | ShopNest",
  },
  description:
    "Shop the latest products across electronics, fashion, home decor, and more at ShopNest. Fast delivery, easy returns.",
  keywords: ["ecommerce", "online shopping", "buy online", "ShopNest"],
  openGraph: {
    type: "website",
    siteName: "ShopNest",
  },
};

// The root layout wraps every page in the app.
// We place all the context providers here so every component in the
// component tree can access auth, cart, and wishlist state.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main className="main-content">{children}</main>
              <Footer />
              {/* Toast notifications appear in the top-right corner */}
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                theme="light"
              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
