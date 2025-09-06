"use client";
import React, { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { createOrderId } from "@/utils/create-order-id";

import type { Course } from "@prisma/client";

// ✅ Types for Razorpay
type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: "payment.failed", callback: (response: { error: unknown }) => void) => void;
    };
  }
}

type RazorpayOptions = {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
};

export default function CheckoutButton({ course }: { course: Course }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    const price = course.price || 0;

    try {
      // ✅ Step 1: Create enrollment
      const enrollmentResponse = await fetch(`/api/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });

      const enrollmentData = await enrollmentResponse.json();
      if (!enrollmentResponse.ok) throw new Error(enrollmentResponse.statusText);

      const enrollment = enrollmentData.enrollment;
      if (!enrollment) {
        alert("Something went wrong. Please try again.");
        return;
      }

      // ✅ Step 2: Create Razorpay Order
      const orderId: string = await createOrderId(price * 100, "INR");

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: price * 100,
        currency: "INR",
        name: "College Buddy",
        description: "Payment for course enrollment",
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            // ✅ Step 3: Verify payment
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                enrollmentId: enrollment.id,
              }),
            });

            if (!verifyResponse.ok) throw new Error("Payment verification failed");

            alert("Payment Successful!");
            router.push("/dashboard");
          } catch (error) {
            alert("Payment verification failed. Please contact support.");
            console.error(error);
          }
        },
        prefill: {
          name: "YOUR_USER_NAME", // Replace with actual user data
          email: "YOUR_USER_EMAIL", // Replace with actual user data
        },
        theme: {
          color: "#3399cc",
        },
      };

      // ✅ Step 4: Open Razorpay Checkout
      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        alert("Payment failed");
        console.error(response.error);
      });
      razorpay.open();
    } catch (error) {
      alert("Payment failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="bg-emerald-700 w-full text-white font-semibold px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
        onClick={handlePayment}
        disabled={isLoading || !course?.id}
      >
        {isLoading ? "Processing..." : `Enroll in ₹${course.price.toFixed(2)}`}
      </button>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
}
