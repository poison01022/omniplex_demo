"use client";

import React from "react";
import stripePromise from "@/lib/stripeClient";

export default function CheckoutButton() {
  const handleClick = async () => {
    const stripe = await stripePromise;

    if (!stripe) {
      console.error("Stripe failed to initialize.");
      return;
    }

    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: "price_1234567890abcdef", quantity: 1 }], // Replace with your Stripe Price ID
      mode: "payment",
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cancel`,
    });

    if (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        backgroundColor: "#6772e5",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "4px",
        border: "none",
        cursor: "pointer",
      }}
    >
      Buy Pro Plan
    </button>
  );
}
