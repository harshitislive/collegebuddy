// app/admin/notes/page.tsx
"use client";

import { useEffect, useState } from "react";

type Course = {
  id: string;
  title: string;
  subjects: { id: string; name: string }[];
};
type Note = {
  id: string;
  title: string;
  fileUrl: string;
};

export default function AdminNotesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([]);

  // Load courses & subjects
  useEffect(() => {
    async function loadCourses() {
      const res = await fetch("/api/admin/courses");
      const data = await res.json();
      setCourses(data);
      if (data.length > 0) {
        setSelectedCourse(data[0].id);
        if (data[0].subjects.length > 0) {
          setSelectedSubject(data[0].subjects[0].id);
        }
      }
    }
    loadCourses();
  }, []);

  // Load notes when subject changes
  useEffect(() => {
    if (!selectedSubject) return;
    async function loadNotes() {
      const res = await fetch(`/api/admin/notes?subjectId=${selectedSubject}`);
      setNotes(await res.json());
    }
    loadNotes();
  }, [selectedSubject]);

  async function deleteNote(id: string) {
    if (!confirm("Delete this note?")) return;
    await fetch("/api/admin/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const res = await fetch(`/api/admin/notes?subjectId=${selectedSubject}`);
    setNotes(await res.json());
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">🗒️ Manage Notes</h1>
      <p className="mt-2 text-gray-600">View or delete subject notes.</p>

      {/* Course + Subject Selection */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="text-sm text-gray-600">Course</label>
          <select
            className="w-full border rounded p-2"
            value={selectedCourse}
            onChange={(e) => {
              const courseId = e.target.value;
              setSelectedCourse(courseId);
              const course = courses.find((c) => c.id === courseId);
              if (course && course.subjects.length > 0) {
                setSelectedSubject(course.subjects[0].id);
              } else {
                setSelectedSubject("");
              }
            }}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Subject</label>
          <select
            className="w-full border rounded p-2"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {courses
              .find((c) => c.id === selectedCourse)
              ?.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Notes List */}
      <div className="mt-6 bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Notes</h2>
        {notes.length === 0 ? (
          <p className="text-sm text-gray-500">No notes uploaded yet.</p>
        ) : (
          <ul className="divide-y">
            {notes.map((n) => (
              <li
                key={n.id}
                className="py-2 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-medium">{n.title}</div>
                  <a
                    className="text-sm text-blue-600 hover:underline"
                    href={n.fileUrl}
                    target="_blank"
                  >
                    View
                  </a>
                </div>
                <button
                  onClick={() => deleteNote(n.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
