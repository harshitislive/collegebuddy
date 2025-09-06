"use client";

import { useEffect, useState } from "react";
import { Subject, Course, Note, NoteCategory } from "@prisma/client";

interface CourseWithSubjects extends Course {
  subjects: Subject[];
}

export default function AdminNotesPage() {
  const [courses, setCourses] = useState<CourseWithSubjects[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const [notes, setNotes] = useState<Note[]>([]);

  // Popup state
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setCourses(data.courses);
      } catch (error) {
        console.log("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleAddNote = async (formData: FormData) => {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload note");

      const data = await res.json();
      setNotes((prev) => [...prev, data.note]);
      setShowPopup(false);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🗒️ Manage Notes</h1>
          <p className="mt-2 text-gray-600">View or delete subject notes.</p>
        </div>
      {/* Add Note Button */}
      <button
        onClick={() => setShowPopup(true)}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        ➕ Add Note
      </button>
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
                <div className="font-medium">{n.title}</div>
                <div className="flex gap-2">
                  <a
                    className="text-sm text-blue-600 hover:underline"
                    href={n.fileUrl}
                    target="_blank"
                  >
                    View
                  </a>
                  <button
                    onClick={() => deleteNote(n.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">Add New Note</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                await handleAddNote(formData);
              }}
              className="space-y-4"
            >
              {/* Course Selection */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Course
                </label>
                <select
                  name="courseId"
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
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Selection */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Subject
                </label>
                <select
                  name="subjectId"
                  className="w-full border rounded p-2"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  required
                >
                  <option value="">Select a subject</option>
                  {courses
                    .find((c) => c.id === selectedCourse)
                    ?.subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Note Title */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  className="w-full border rounded p-2"
                  placeholder="Enter note title"
                  required
                />
              </div>
              
              {/* Note Category */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Category
                </label>

                <select
                  name="category"
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="">Select a category</option>
                  {Object.entries(NoteCategory).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              {/* File URL */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  File URL
                </label>
                <input
                  type="text"
                  name="fileUrl"
                  className="w-full border rounded p-2"
                  placeholder="Enter file URL"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
