"use client";

import { useEffect, useState } from "react";

type Lecture = {
  id: string;
  title: string;
  url: string;
  course: string;
  subject: string;
};

export default function LecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("All");

  // Fetch first lectures of all courses on mount
  useEffect(() => {
    const fetchFirstLectures = async () => {
      try {
        const response = await fetch("/api/lectures?first=true");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data: Lecture[] = await response.json();
        setLectures(data);

        // Extract unique courses
        const uniqueCourses = Array.from(new Set(data.map((lec) => lec.course)));
        setCourses(["All", ...uniqueCourses]);
      } catch (error) {
        console.error("Error fetching lectures:", error);
      }
    };

    fetchFirstLectures();
  }, []);

  // Fetch lectures for selected course
  useEffect(() => {
    if (selectedCourse === "All") return; // Already fetched first lectures

    const fetchCourseLectures = async () => {
      try {
        const response = await fetch(`/api/lectures?course=${encodeURIComponent(selectedCourse)}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data: Lecture[] = await response.json();
        setLectures(data);
      } catch (error) {
        console.error("Error fetching lectures:", error);
      }
    };

    fetchCourseLectures();
  }, [selectedCourse]);

  const filteredLectures =
    selectedCourse === "All"
      ? lectures
      : lectures.filter((lec) => lec.course === selectedCourse);

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
      {filteredLectures.length === 0 ? (
        <p className="text-gray-500">No lectures found for this course.</p>
      ) : (
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
      )}
    </div>
  );
}
