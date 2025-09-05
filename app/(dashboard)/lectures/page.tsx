"use client"

import { useState } from "react"

const lectures = [
  {
    id: "lec1",
    course: "DBMS",
    subject: "Database Systems",
    title: "ER Diagrams Explained",
    url: "https://www.youtube.com/embed/ztHopE5Wnpc",
  },
  {
    id: "lec2",
    course: "Operating System",
    subject: "OS Basics",
    title: "Process Management Basics",
    url: "https://www.youtube.com/embed/vBURTt97EkA",
  },
  {
    id: "lec3",
    course: "Networking",
    subject: "Computer Networks",
    title: "Introduction to Networking",
    url: "https://www.youtube.com/embed/qiQR5rTSshw",
  },
  {
    id: "lec4",
    course: "Java",
    subject: "Java Programming",
    title: "OOP Concepts in Java",
    url: "https://www.youtube.com/embed/8cm1x4bC610",
  },
  {
    id: "lec5",
    course: "DBMS",
    subject: "SQL",
    title: "SQL Queries Explained",
    url: "https://www.youtube.com/embed/27axs9dO7AE",
  },
]

const courses = ["DBMS", "Operating System", "Networking", "Java"]

export default function RecordedLecturesPage() {
  const [selectedCourse, setSelectedCourse] = useState("DBMS")

  const filteredLectures = lectures.filter(
    (lec) => lec.course === selectedCourse
  )

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">🎥 Recorded Lectures</h1>
      <p className="text-gray-600">Choose a course and watch recorded lectures in order.</p>

      {/* Course Selection */}
      <div className="flex flex-wrap gap-4">
        {courses.map((course) => (
          <button
            key={course}
            onClick={() => setSelectedCourse(course)}
            className={`px-5 py-2 rounded-full text-sm font-medium shadow transition ${
              selectedCourse === course
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {course}
          </button>
        ))}
      </div>

      {/* Lectures Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredLectures.map((lec) => (
          <div
            key={lec.id}
            className="bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <div className="aspect-video bg-black">
              <iframe
                src={lec.url}
                title={lec.title}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">{lec.title}</h2>
              <p className="text-sm text-gray-600">
                {lec.course} • {lec.subject}
              </p>
              <a
                href={lec.url.replace("embed/", "watch?v=")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow"
              >
                Open on YouTube
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
