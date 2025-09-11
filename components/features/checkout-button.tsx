"use client";
import React, { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { createOrderId } from "@/utils/create-order-id";
import type { Course } from "@prisma/client";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (
        event: "payment.failed",
        callback: (response: { error: unknown }) => void
      ) => void;
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

  // ✅ Apply discount (assuming discount is percentage)
  const finalPrice = course.price - (course.price * (course.discount || 0)) / 100;

  const handlePayment = async () => {
    setIsLoading(true);

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

      // ✅ Step 2: Create Razorpay Order with discounted price
      const orderId: string = await createOrderId(finalPrice * 100, "INR");

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: finalPrice * 100,
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

            if (!verifyResponse.ok)
              throw new Error("Payment verification failed");

            alert("Payment Successful!");
            router.push("/dashboard");
          } catch (error) {
            alert("Payment verification failed. Please contact support.");
            console.error(error);
          }
        },
        prefill: {
          name: "YOUR_USER_NAME",
          email: "YOUR_USER_EMAIL",
        },
        theme: {
          color: "#3399cc",
        },
      };

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
        {isLoading
          ? "Processing..."
          : `Enroll in ₹${finalPrice.toFixed(2)} ${
              course.discount > 0 ? `(Saved ${course.discount}%)` : ""
            }`}
      </button>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
    </>
  );
}
