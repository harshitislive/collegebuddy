"use client";

import { useEffect, useState } from "react";

type Course = {
  id: string;
  title: string;
  code?: string | null;
  subjects: { id: string; name: string }[];
  price: number;
  discount: number;
  referralComission: number;
  createdAt: string;
};

export default function ManageCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState({
    id: "",
    title: "",
    code: "",
    price: 0,
    discount: 0,
    referralComission: 0,
  });
  const [editing, setEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  async function load() {
    const res = await fetch("/api/super-admin/courses");
    const data = await res.json();
    setCourses(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function saveCourse(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    await fetch("/api/super-admin/courses", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    resetForm();
    setShowPopup(false);
    load();
  }

  function resetForm() {
    setForm({
      id: "",
      title: "",
      code: "",
      price: 0,
      discount: 0,
      referralComission: 0,
    });
    setEditing(false);
  }

  async function deleteCourse(id: string) {
    if (!confirm("Delete this course (and its subjects)?")) return;
    await fetch("/api/super-admin/courses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  async function addSubject(courseId: string, name: string) {
    await fetch("/api/super-admin/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, name }),
    });
    load();
  }

  async function renameSubject(id: string, name: string) {
    await fetch("/api/super-admin/subjects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name }),
    });
    load();
  }

  async function deleteSubject(id: string) {
    if (!confirm("Delete this subject and its content?")) return;
    await fetch("/api/super-admin/subjects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">📘 Manage Courses</h1>
          <p className="mt-2 text-gray-600">
            Create courses, manage pricing, discounts, and subjects.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowPopup(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          ➕ Add Course
        </button>
      </div>

      {/* Course cards with subjects */}
      <div className="mt-6 space-y-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {course.title}{" "}
                  {course.code ? (
                    <span className="text-gray-500">({course.code})</span>
                  ) : null}
                </h2>
                <p className="text-sm text-gray-500">
                  {course.subjects.length} subject(s) • 💰 ₹{course.price} • 🎟️{" "}
                  {course.discount}% off • 🤝 Referral {course.referralComission}%
                </p>
                <p className="text-xs text-gray-400">
                  Created: {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setForm({
                      id: course.id,
                      title: course.title,
                      code: course.code || "",
                      price: course.price,
                      discount: course.discount,
                      referralComission: course.referralComission,
                    });
                    setEditing(true);
                    setShowPopup(true);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCourse(course.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Subjects list */}
            <div className="mt-4">
              <h3 className="font-semibold">Subjects</h3>
              {course.subjects.length === 0 ? (
                <p className="text-gray-500 text-sm">No subjects yet.</p>
              ) : (
                <ul className="divide-y">
                  {course.subjects.map((s) => (
                    <li
                      key={s.id}
                      className="py-2 flex flex-wrap gap-2 items-center justify-between"
                    >
                      <span>{s.name}</span>
                      <div className="space-x-2">
                        <button
                          onClick={async () => {
                            const name = prompt("Rename subject", s.name)?.trim();
                            if (name && name !== s.name)
                              await renameSubject(s.id, name);
                          }}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => deleteSubject(s.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Add subject inline */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const target = e.currentTarget as HTMLFormElement & {
                    subjectName: { value: string };
                  };
                  const name = target.subjectName.value.trim();
                  if (!name) return;
                  await addSubject(course.id, name);
                  target.reset();
                }}
                className="mt-3 flex gap-2"
              >
                <input
                  name="subjectName"
                  placeholder="New Subject"
                  className="flex-1 border rounded p-2 text-sm"
                  required
                />
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                  Add
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">
              {editing ? "✏️ Edit Course" : "➕ Add Course"}
            </h2>
            <form onSubmit={saveCourse} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Course Title
                </label>
                <input
                  className="w-full border rounded p-2"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              {/* Code */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Course Code (optional)
                </label>
                <input
                  className="w-full border rounded p-2"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Price</label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={form.discount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      discount: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              {/* Referral Commission */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Referral Commission (%)
                </label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={form.referralComission}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      referralComission: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowPopup(false);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editing ? "Update Course" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
