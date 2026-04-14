import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

export default function Spinner({ size = "md" }: SpinnerProps) {
  const sizeClass: Record<string, string> = {
    sm: "spinner-sm",
    md: "spinner-md",
    lg: "spinner-lg",
  };

  return (
    <div
      className={`spinner ${sizeClass[size]}`}
      role="status"
      aria-label="Loading..."
    />
  );
}

// A full-page loading overlay used while waiting for data
export function PageLoader() {
  return (
    <div className="page-loader">
      <Spinner size="lg" />
    </div>
  );
}
