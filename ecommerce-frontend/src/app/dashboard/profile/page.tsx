"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/axios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Package, User, MapPin, Heart } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  async function onSubmit(data: ProfileFormData) {
    try {
      setIsLoading(true);
      await apiClient.put("/users/profile", data);
      toast.success("Profile updated successfully.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="page-section">
        <div className="container">
          <div className="dashboard-layout">
            <nav className="dashboard-sidebar">
              <Link href="/dashboard" className="dashboard-sidebar-link">
                <Package size={18} /> My Orders
              </Link>
              <Link href="/dashboard/profile" className="dashboard-sidebar-link active">
                <User size={18} /> Profile
              </Link>
              <Link href="/dashboard/wishlist" className="dashboard-sidebar-link">
                <Heart size={18} /> Wishlist
              </Link>
              <Link href="/dashboard/addresses" className="dashboard-sidebar-link">
                <MapPin size={18} /> Addresses
              </Link>
            </nav>

            <div className="dashboard-content">
              <h1 style={{ fontWeight: 700, fontSize: "var(--font-size-2xl)", marginBottom: "var(--spacing-xl)" }}>
                My Profile
              </h1>

              <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)", maxWidth: 500 }}
              >
                <Input
                  id="profile-name"
                  label="Full Name"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  id="profile-email"
                  label="Email Address"
                  type="email"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <div>
                  <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)", marginBottom: "8px" }}>
                    Role: <strong style={{ color: "var(--color-text-primary)" }}>{user?.role}</strong>
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                >
                  Save Changes
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
