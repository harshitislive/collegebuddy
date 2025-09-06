"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import UnlockContent from "@/components/features/unlock-content";

type LiveSession = {
  id: string;
  title: string;
  date: string;
  meetLink: string;
  liveNotes?: string | null;
  subject: {
    name: string;
    course: {
      title: string;
    };
  };
};

export default function LiveClassesPage() {
  const [isLocked, setIsLocked] = useState(false);
  const [courses, setCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [liveClasses, setLiveClasses] = useState<LiveSession[]>([]);

  useEffect(() => {
    const fetchLiveClasses = async () => {
      try {
        const response = await fetch("/api/live-sessions");

        if (response.status === 403) {
          setIsLocked(true);
          return;
        }

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const sessions: LiveSession[] = data.liveSessions || [];

        setLiveClasses(sessions);

        // extract unique courses
        const uniqueCourses = Array.from(new Set(sessions.map((s) => s.subject.course.title)));
        setCourses(["All", ...uniqueCourses]);
      } catch (error) {
        console.error("Error fetching live classes:", error);
      }
    };

    fetchLiveClasses();
  }, []);

  const filteredClasses =
    selectedCourse === "All"
      ? liveClasses
      : liveClasses.filter((cls) => cls.subject.course.title === selectedCourse);

  return (
    <UnlockContent isLocked={isLocked} fullPage>
      <div className="relative space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">📡 Live Classes</h1>
      <p className="text-gray-600">
        Join ongoing or upcoming live sessions directly from here.
      </p>

      {/* Course Filter */}
      <div className="flex flex-wrap gap-3">
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
      {filteredClasses.length === 0 ? (
        <p className="text-gray-500">No live sessions found for this course.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((cls) => {
            const date = new Date(cls.date);
            const isOngoing =
              date <= new Date() && date >= new Date(Date.now() - 60 * 60 * 1000);
            const isUpcoming = date > new Date();

            return (
              <div
                key={cls.id}
                className="bg-white border rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{cls.title}</h2>
                  <p className="text-sm text-gray-500">
                    {cls.subject.course.title} • {cls.subject.name}
                  </p>
                  <p className="mt-2 text-gray-700">
                    📅 {format(date, "PPP")} • 🕒 {format(date, "p")}
                  </p>
                  <span
                    className={`inline-block mt-3 px-3 py-1 text-xs rounded-full ${
                      isOngoing
                        ? "bg-red-100 text-red-600"
                        : isUpcoming
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isOngoing ? "Ongoing" : isUpcoming ? "Upcoming" : "Completed"}
                  </span>
                </div>
                <a
                  href={cls.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 px-4 py-2 rounded-lg text-center font-medium shadow ${
                    isOngoing
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : isUpcoming
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
                >
                  {isOngoing ? "Join Now" : isUpcoming ? "Set Reminder" : "Ended"}
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
    </UnlockContent>
  );
}
