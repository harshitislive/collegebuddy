"use client"

import { useState } from "react"

const classes = [
  {
    id: "c1",
    course: "DBMS",
    subject: "SQL Basics",
    teacher: "Prof. Sharma",
    date: "2025-08-28",
    time: "6:00 PM",
    link: "https://meet.google.com/example-dbms",
    status: "Upcoming",
  },
  {
    id: "c2",
    course: "Operating System",
    subject: "Deadlock Handling",
    teacher: "Dr. Verma",
    date: "2025-08-29",
    time: "7:30 PM",
    link: "https://zoom.us/example-os",
    status: "Upcoming",
  },
  {
    id: "c3",
    course: "Networking",
    subject: "IP Addressing",
    teacher: "Prof. Singh",
    date: "2025-08-27",
    time: "5:00 PM",
    link: "https://meet.google.com/example-networking",
    status: "Ongoing",
  },
]

const courses = ["All", "DBMS", "Operating System", "Networking", "Java"]

export default function LiveClassesPage() {
  const [selectedCourse, setSelectedCourse] = useState("All")

  const filteredClasses =
    selectedCourse === "All"
      ? classes
      : classes.filter((cls) => cls.course === selectedCourse)

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">📡 Live Classes</h1>
      <p className="text-gray-600">
        Join ongoing or upcoming live sessions directly from here.
      </p>

      {/* Course Filter */}
      <div className="flex flex-wrap gap-4">
        {courses.map((course) => (
          <button
            key={course}
            onClick={() => setSelectedCourse(course)}
            className={`px-5 py-2 rounded-full text-sm font-medium shadow transition ${
              selectedCourse === course
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {course}
          </button>
        ))}
      </div>

      {/* Classes List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-white border rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{cls.subject}</h2>
              <p className="text-sm text-gray-500">
                {cls.course} • {cls.teacher}
              </p>
              <p className="mt-2 text-gray-700">
                📅 {cls.date} • 🕕 {cls.time}
              </p>
              <span
                className={`inline-block mt-3 px-3 py-1 text-xs rounded-full ${
                  cls.status === "Ongoing"
                    ? "bg-red-100 text-red-600"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {cls.status}
              </span>
            </div>
            <a
              href={cls.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 px-4 py-2 rounded-lg text-center font-medium shadow ${
                cls.status === "Ongoing"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {cls.status === "Ongoing" ? "Join Now" : "Set Reminder"}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
