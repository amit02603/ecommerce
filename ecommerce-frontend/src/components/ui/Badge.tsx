import React from "react";

type BadgeVariant = "success" | "warning" | "error" | "info" | "default";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export default function Badge({ children, variant = "default" }: BadgeProps) {
  const variantClass: Record<BadgeVariant, string> = {
    success: "badge-success",
    warning: "badge-warning",
    error: "badge-error",
    info: "badge-info",
    default: "badge-default",
  };

  return (
    <span className={`badge ${variantClass[variant]}`}>{children}</span>
  );
}

// Maps order status to the correct badge colour
export function OrderStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, BadgeVariant> = {
    processing: "warning",
    shipped: "info",
    delivered: "success",
    cancelled: "error",
  };

  const variant = statusMap[status] || "default";
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return <Badge variant={variant}>{label}</Badge>;
}
