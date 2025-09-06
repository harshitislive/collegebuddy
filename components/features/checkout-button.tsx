"use client";
import React from "react";
import { useState } from "react";
import axios from "axios";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { createOrderId } from "@/utils/create-order-id";
import { Course, User } from "@prisma/client";

export default function CheckoutButton({ course }: { course: Course }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    const price = course.price * 100 || 0;
    try {
      const enrollmentResponse = await fetch(`/api/enrollments`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          courseId: course.id,
        })
      });

      const enrollmentData = await enrollmentResponse.json();

      if(!enrollmentResponse.ok) throw new Error(enrollmentResponse.statusText);

      const enrollment = enrollmentData.enrollment;

      const orderId: string = await createOrderId(price, "INR");
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: price * 100,
        currency: "INR",
        name: "YOUR_COMPANY_NAME", // Replace with dynamic company name
        description: "Payment for your order", // Replace with dynamic order description
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const paymentResponse = await axios.post("/api/payment/verify", {
              razorpay_order_id: orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              enrollmentId: enrollment.id,
            });

            alert("Payment Successful!");
            router.push('/dashboard');
            console.log(paymentResponse.data);
          } catch (error) {
            alert("Payment verification failed. Please contact support.");
            console.error(error);
          }
        },
        prefill: {
          name: "YOUR_USER_NAME", // Replace with dynamic user data
          email: "YOUR_USER_EMAIL", // Replace with dynamic user data
        },
        theme: {
          color: "#3399cc",
        },
      };

      if(!enrollment) {
        alert("Something went wrong. Please try again.");
        return
      }

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
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
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
    </>
  );
}