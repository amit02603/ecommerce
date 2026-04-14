"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import { placeOrder } from "@/services/orderService";
import { createPaymentIntent } from "@/services/paymentService";
import ProtectedRoute from "@/components/ProtectedRoute";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// Load Stripe outside of the component to avoid re-creating on each render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

type AddressFormData = z.infer<typeof addressSchema>;

// The actual checkout form — must be a child of <Elements> to use Stripe hooks
function CheckoutForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { cart, clearAllItems } = useCart();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: "India" },
  });

  const shippingCharge = cart && cart.totalAmount > 500 ? 0 : 50;
  const taxAmount = cart ? Math.round(cart.totalAmount * 0.18) : 0;
  const grandTotal = cart ? cart.totalAmount + shippingCharge + taxAmount : 0;

  async function onSubmit(addressData: AddressFormData) {
    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet. Please try again.");
      return;
    }

    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      setIsLoading(true);

      // Step 1: Ask our backend to create a Stripe PaymentIntent
      const { clientSecret } = await createPaymentIntent(grandTotal);

      // Step 2: Confirm the payment with Stripe using the card details
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        toast.error(result.error.message || "Payment failed. Please try again.");
        return;
      }

      const paymentIntent = result.paymentIntent;

      // Step 3: Create the order in our database
      const orderItems = cart.items.map(function (item) {
        return { product: item.product._id, quantity: item.quantity };
      });

      await placeOrder({
        items: orderItems,
        shippingAddress: addressData,
        paymentInfo: { id: paymentIntent.id, status: paymentIntent.status },
      });

      // Cart is cleared by the backend, but we also update local state
      await clearAllItems();

      toast.success("Order placed successfully!");
      router.push("/dashboard/orders");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Order placement failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "var(--spacing-2xl)",
          alignItems: "start",
        }}
      >
        {/* Left: Address + Payment */}
        <div>
          {/* Shipping Address */}
          <div
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--spacing-xl)",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            <h2 style={{ fontWeight: 700, marginBottom: "var(--spacing-lg)" }}>
              Shipping Address
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
              <Input id="checkout-street" label="Street Address" placeholder="123 MG Road" error={errors.street?.message} {...register("street")} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
                <Input id="checkout-city" label="City" placeholder="Mumbai" error={errors.city?.message} {...register("city")} />
                <Input id="checkout-state" label="State" placeholder="Maharashtra" error={errors.state?.message} {...register("state")} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
                <Input id="checkout-postal" label="Postal Code" placeholder="400001" error={errors.postalCode?.message} {...register("postalCode")} />
                <Input id="checkout-country" label="Country" placeholder="India" error={errors.country?.message} {...register("country")} />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--spacing-xl)",
            }}
          >
            <h2 style={{ fontWeight: 700, marginBottom: "var(--spacing-lg)" }}>
              Payment Details
            </h2>
            <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)", marginBottom: "var(--spacing-md)" }}>
              Use Stripe test card: <code>4242 4242 4242 4242</code>, any future date, any CVC.
            </p>
            <div
              style={{
                padding: "14px",
                border: "1.5px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#0f172a",
                      fontFamily: "Inter, sans-serif",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="cart-summary-card">
          <p className="cart-summary-title">Order Summary</p>

          {cart?.items.map(function (item) {
            return (
              <div key={item._id} className="cart-summary-row">
                <span>{item.product.name} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            );
          })}

          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>
              {shippingCharge === 0 ? (
                <span style={{ color: "var(--color-success)", fontWeight: 500 }}>FREE</span>
              ) : (
                formatPrice(shippingCharge)
              )}
            </span>
          </div>
          <div className="cart-summary-row">
            <span>GST (18%)</span>
            <span>{formatPrice(taxAmount)}</span>
          </div>
          <div className="cart-summary-total">
            <span>Total</span>
            <span>{formatPrice(grandTotal)}</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            style={{ width: "100%", marginTop: "var(--spacing-md)" }}
          >
            Pay {formatPrice(grandTotal)}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <div className="page-section">
        <div className="container">
          <h1 style={{ fontWeight: 700, fontSize: "var(--font-size-2xl)", marginBottom: "var(--spacing-xl)" }}>
            Checkout
          </h1>
          {/* Wrap the form in Stripe's Elements provider */}
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </ProtectedRoute>
  );
}
