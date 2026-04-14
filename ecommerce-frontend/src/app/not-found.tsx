import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "var(--spacing-xl)",
      }}
    >
      <p style={{ fontSize: "6rem", fontWeight: 900, color: "var(--color-border)", lineHeight: 1, marginBottom: "var(--spacing-lg)" }}>
        404
      </p>
      <h1 style={{ fontSize: "var(--font-size-3xl)", fontWeight: 700, marginBottom: "var(--spacing-md)" }}>
        Page Not Found
      </h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--spacing-xl)", maxWidth: 400 }}>
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn btn-primary btn-lg">
        Go Back Home
      </Link>
    </div>
  );
}
