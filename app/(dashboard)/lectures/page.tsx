"use client";

import UnlockContent from "@/components/features/unlock-content";
import { useEffect, useState } from "react";

type Lecture = {
  id: string;
  title: string;
  url: string;
  subject: string;
  courseId: string;
  courseTitle: string;
};

type CourseOption = {
  id: string;
  title: string;
};

export default function LecturesPage() {
  const [isLocked, setIsLocked] = useState(false);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseOption | null>(null);

  // Fetch first lectures of all courses on mount
  useEffect(() => {
    const fetchAllLectures = async () => {
      try {
        const response = await fetch("/api/lectures");

        if (response.status === 403) {
          setIsLocked(true);
          return;
        }

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();

        // flatten subject + course
        const formatted: Lecture[] = data.lectures.map((lec: Lecture) => ({
          id: lec.id,
          title: lec.title,
          url: lec.url,
          courseId: lec.courseId,
          courseTitle: lec.courseTitle,
          subject: lec.subject,
        }));

        setLectures(formatted);

        // Extract unique courses (id + title)
        const uniqueCoursesMap = new Map<string, string>();
        formatted.forEach((lec) => {
          uniqueCoursesMap.set(lec.courseId, lec.courseTitle);
        });

        const uniqueCourses: CourseOption[] = [
          { id: "All", title: "All" },
          ...Array.from(uniqueCoursesMap, ([id, title]) => ({ id, title })),
        ];

        setCourses(uniqueCourses);
        setSelectedCourse(uniqueCourses[0]); // default: All
      } catch (error) {
        console.error("Error fetching lectures:", error);
      }
    };

    fetchAllLectures();
  }, []);

  // Fetch lectures for selected course
  useEffect(() => {
    if (!selectedCourse || selectedCourse.id === "All") return; // Already have first lectures

    const fetchCourseLectures = async () => {
      try {
        console.log(`Fetching lectures for course: ${selectedCourse.id}`);
        const response = await fetch(`/api/lectures?course=${encodeURIComponent(selectedCourse.id)}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();

        const formatted: Lecture[] = data.lectures.map((lec: Lecture) => ({
          id: lec.id,
          title: lec.title,
          url: lec.url,
          courseId: lec.courseId,
          courseTitle: lec.courseTitle,
          subject: lec.subject,
        }));

        setLectures(formatted);
      } catch (error) {
        console.error("Error fetching lectures:", error);
      }
    };

    fetchCourseLectures();
  }, [selectedCourse]);

  const filteredLectures =
    !selectedCourse || selectedCourse.id === "All"
      ? lectures
      : lectures.filter((lec) => lec.courseId === selectedCourse.id);

  return (
    <UnlockContent isLocked={isLocked} fullPage>
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">🎥 Recorded Lectures</h1>
        <p className="text-gray-600">Choose a course and watch recorded lectures in order.</p>

        {/* Course Selection */}
        <div className="flex flex-wrap gap-4">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className={`px-5 py-2 rounded-full text-sm font-medium shadow transition ${
                selectedCourse?.id === course.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {course.title}
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
                    {lec.courseTitle} • {lec.subject}
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
    </UnlockContent>
  );
}
