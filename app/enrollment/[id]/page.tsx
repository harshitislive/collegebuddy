"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CheckoutButton from "@/components/features/checkout-button";
import { Course } from "@prisma/client";

export default function EnrollmentDetailPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    fetch(`/api/student-course/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading course...</p>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 font-semibold">Course not found ❌</p>
      </main>
    );
  }

const finalPrice = course.discount
  ? Math.round(course.price - (course.price * course.discount) / 100)
  : course.price;


  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
          {course.code && <p className="text-gray-500 text-sm mt-1">Code: {course.code}</p>}
        </div>

        <div className="text-center">
          {course.discount > 0 ? (
            <div className="flex justify-center gap-2 items-center">
              <span className="text-2xl font-bold text-blue-600">₹{finalPrice}</span>
              <span className="line-through text-gray-400">₹{course.price}</span>
              <span className="text-green-600 text-sm font-medium">{course.discount}% OFF</span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-gray-800">₹{finalPrice}</span>
          )}
        </div>

        <CheckoutButton course={course} />

        <p className="text-xs text-gray-400 text-center">
          Secure payments are powered by Razorpay 🔒
        </p>
      </div>
    </main>
  );
}
