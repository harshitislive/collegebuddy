"use client";

import { useEffect, useState } from "react";
import type { Course } from "@prisma/client";
import CheckoutButton from "@/components/features/checkout-button";

export default function EnrollmentPage() {
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data.courses || []));
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Enroll in a Course</h1>
          <p className="text-gray-500 text-sm mt-1">
            Choose your course and proceed to secure payment
          </p>
        </div>

        {/* Course Dropdown */}
        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Select Course:</label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            <option value="">-- Select a course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Checkout Button */}
        <div className="pt-4">
          {courseId ? (
            <CheckoutButton course={courses.find((c) => c.id === courseId)!} />
          ) : (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 font-semibold px-4 py-2 rounded-xl cursor-not-allowed"
            >
              Select a course to continue
            </button>
          )}
        </div>

        {/* Extra Info */}
        <p className="text-xs text-gray-400 text-center">
          Secure payments are powered by Razorpay 🔒
        </p>
      </div>
    </main>
  );
}
