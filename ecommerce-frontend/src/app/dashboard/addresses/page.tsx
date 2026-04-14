"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { addAddress, deleteAddress } from "@/services/userService";
import ProtectedRoute from "@/components/ProtectedRoute";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Package, User, MapPin, Heart, Trash2, Plus } from "lucide-react";
import { Address } from "@/types";

const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function AddressesPage() {
  const { user, updateUser } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: "India" },
  });

  async function onSubmit(data: AddressFormData) {
    try {
      setIsSubmitting(true);
      const response = await addAddress(data);
      if (user) {
        updateUser({ ...user, addresses: response.addresses });
      }
      toast.success("Address added successfully!");
      setIsAdding(false);
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add address.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setDeleteLoadingId(id);
      const response = await deleteAddress(id);
      if (user) {
        updateUser({ ...user, addresses: response.addresses });
      }
      toast.success("Address deleted.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete address.");
    } finally {
      setDeleteLoadingId(null);
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
              <Link href="/dashboard/profile" className="dashboard-sidebar-link">
                <User size={18} /> Profile
              </Link>
              <Link href="/dashboard/wishlist" className="dashboard-sidebar-link">
                <Heart size={18} /> Wishlist
              </Link>
              <Link href="/dashboard/addresses" className="dashboard-sidebar-link active">
                <MapPin size={18} /> Addresses
              </Link>
            </nav>

            <div className="dashboard-content">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-xl)" }}>
                <h1 style={{ fontWeight: 700, fontSize: "var(--font-size-2xl)" }}>
                  Saved Addresses
                </h1>
                {!isAdding && (
                  <Button variant="primary" size="sm" onClick={() => setIsAdding(true)}>
                    <Plus size={16} /> Add New
                  </Button>
                )}
              </div>

              {isAdding && (
                <div style={{ background: "var(--color-surface)", padding: "var(--spacing-lg)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", marginBottom: "var(--spacing-xl)" }}>
                  <h2 style={{ fontWeight: 600, marginBottom: "var(--spacing-md)" }}>Add New Address</h2>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Input id="street" label="Street Address" placeholder="123 MG Road" error={errors.street?.message} {...register("street")} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
                      <Input id="city" label="City" placeholder="Mumbai" error={errors.city?.message} {...register("city")} />
                      <Input id="state" label="State" placeholder="Maharashtra" error={errors.state?.message} {...register("state")} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
                      <Input id="postalCode" label="Postal Code" placeholder="400001" error={errors.postalCode?.message} {...register("postalCode")} />
                      <Input id="country" label="Country" placeholder="India" error={errors.country?.message} {...register("country")} />
                    </div>
                    <div style={{ display: "flex", gap: "var(--spacing-md)", marginTop: "var(--spacing-md)" }}>
                      <Button type="button" variant="outline" size="md" onClick={() => setIsAdding(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
                        Save Address
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {user?.addresses && user.addresses.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--spacing-md)" }}>
                  {user.addresses.map((address: Address) => (
                    <div key={address._id} style={{ padding: "var(--spacing-lg)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", position: "relative" }}>
                      <p style={{ fontWeight: 600, marginBottom: "8px" }}>{address.street}</p>
                      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)", marginBottom: "4px" }}>
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>
                        {address.country}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(address._id)} 
                        isLoading={deleteLoadingId === address._id}
                        style={{ position: "absolute", top: "12px", right: "12px", color: "var(--color-error)" }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                !isAdding && (
                  <div className="empty-state">
                    <p className="empty-state-title">No saved addresses</p>
                    <p className="empty-state-text">Add your home or work address for faster checkout.</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
