import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

export default async function AdminSubjectsList() {
  noStore();

  // For now: show all courses + subjects. (Later: filter to this admin's subjects.)
  const courses = await prisma.course.findMany({
    include: {
      subjects: {
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">📚 Subjects</h1>
      <p className="mt-2 text-gray-600">
        Pick a subject to manage Notes, Lectures, Live Sessions, and Assignments.
      </p>

      {courses.length === 0 ? (
        <p className="mt-6 text-gray-500">No courses/subjects yet.</p>
      ) : (
        <div className="mt-6 space-y-6">
          {courses.map((c) => (
            <div key={c.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{c.title}</h2>
                <span className="text-sm text-gray-500">{c.subjects.length} subject(s)</span>
              </div>
              {c.subjects.length === 0 ? (
                <p className="text-sm text-gray-500 mt-2">No subjects in this course.</p>
              ) : (
                <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {c.subjects.map((s) => (
                    <li key={s.id} className="border rounded-lg p-3 hover:bg-slate-50">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-medium">{s.name}</div>
                        <Link
                          href={`/admin/subjects/${s.id}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Manage →
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
