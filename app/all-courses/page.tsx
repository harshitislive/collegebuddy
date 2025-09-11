"use client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

type Course = {
  id: string;
  title: string;
  code?: string;
  price: number;
  discount: number;
  _count?: { enrollments: number };
};

export default function AllCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // ✅ correct place

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/all-courses");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setCourses(data);
      } catch (err: any) {
        console.error("Error fetching courses:", err);
        toast.error(err.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-pink-50 p-8">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8 text-center">
          🎓 Explore Our Courses
        </h1>

        {loading ? (
          <p className="text-slate-600 text-center">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-slate-500 text-center">No courses available yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const finalPrice = course.discount
                ? course.price - (course.price * course.discount) / 100
                : course.price;

              return (
                <div
                  key={course.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 overflow-hidden"
                >
                  {/* Banner */}
                  <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg font-semibold">
                    {course.code ? `Code: ${course.code}` : "New Course"}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {course.title}
                    </h2>

                    <div>
                      {course.discount > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-blue-600">
                            ₹{finalPrice}
                          </span>
                          <span className="line-through text-slate-400">
                            ₹{course.price}
                          </span>
                          <span className="text-green-600 text-sm font-medium">
                            {course.discount}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-slate-800">
                          ₹{course.price}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500">
                      {course._count?.enrollments || 0} students enrolled
                    </p>

                    {/* Enroll Button */}
                    <button
                      onClick={() => router.push(`/enrollment/${course.id}`)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Enroll Now 🚀
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
