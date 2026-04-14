"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PageLoader } from "./ui/Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  // If adminOnly is true, only admins can see the page
  adminOnly?: boolean;
}

// Wraps any page that requires the user to be logged in.
// If the user is not logged in, they are redirected to /login.
// If adminOnly is true, non-admin users are sent to the home page.
export default function ProtectedRoute({
  children,
  adminOnly = false,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(
    function () {
      if (isLoading) return;

      if (!isAuthenticated) {
        router.replace("/login");
        return;
      }

      if (adminOnly && user?.role !== "admin") {
        router.replace("/");
      }
    },
    [isAuthenticated, isLoading, adminOnly, user, router]
  );

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (adminOnly && user?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
