"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine(function (data) {
    return data.password === data.confirmPassword;
  }, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // useForm must be called unconditionally (Rules of Hooks)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Redirect already-logged-in users away from the register page
  useEffect(
    function () {
      if (!isAuthLoading && isAuthenticated) {
        router.replace("/");
      }
    },
    [isAuthenticated, isAuthLoading, router]
  );

  // While auth state is being determined, render nothing to avoid a flash
  if (isAuthLoading || isAuthenticated) {
    return null;
  }

  async function onSubmit(data: RegisterFormData) {
    try {
      setIsLoading(true);
      await registerUser(data.name, data.email, data.password);
      toast.success("Account created! Welcome to ShopNest.");
      router.push("/");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create an account</h1>
        <p className="auth-subtitle">Join thousands of happy shoppers on ShopNest</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="register-name"
            label="Full name"
            type="text"
            placeholder="Your full name"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            id="register-email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            id="register-password"
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            id="register-confirm-password"
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            style={{ width: "100%", marginTop: "8px" }}
          >
            Create Account
          </Button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
