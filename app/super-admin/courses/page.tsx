"use client";

import { useEffect, useState } from "react";

type Course = {
  id: string;
  title: string;
  code?: string | null;
  subjects: { id: string; name: string }[];
};

export default function ManageCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState({ id: "", title: "", code: "" });
  const [editing, setEditing] = useState(false);

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
    setForm({ id: "", title: "", code: "" });
    setEditing(false);
    load();
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
    <div>
      <h1 className="text-2xl font-bold">📘 Manage Courses</h1>
      <p className="mt-2 text-gray-600">Create courses and manage subjects inline.</p>

      {/* Course form */}
      <form onSubmit={saveCourse} className="mt-6 bg-white shadow p-6 rounded-lg space-y-4">
        <h2 className="text-lg font-semibold">
          {editing ? "✏️ Edit Course" : "➕ Add New Course"}
        </h2>
        <input
          className="w-full border rounded p-2"
          placeholder="Course Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Course Code (optional)"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />
        <button className="bg-blue-600 text-white rounded px-4 py-2">
          {editing ? "Update Course" : "Create Course"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setForm({ id: "", title: "", code: "" });
            }}
            className="ml-2 bg-slate-200 text-slate-900 rounded px-4 py-2"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Course cards with subjects */}
      <div className="mt-6 space-y-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {course.title} {course.code ? <span className="text-gray-500">({course.code})</span> : null}
                </h2>
                <p className="text-sm text-gray-500">{course.subjects.length} subject(s)</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setForm({ id: course.id, title: course.title, code: course.code || "" });
                    setEditing(true);
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
                    <li key={s.id} className="py-2 flex flex-wrap gap-2 items-center justify-between">
                      <span>{s.name}</span>
                      <div className="space-x-2">
                        <button
                          onClick={async () => {
                            const name = prompt("Rename subject", s.name)?.trim();
                            if (name && name !== s.name) await renameSubject(s.id, name);
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
                  const target = e.currentTarget as HTMLFormElement & { subjectName: { value: string } };
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
    </div>
  );
}
