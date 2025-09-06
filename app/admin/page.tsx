import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export default async function AdminHome() {
  noStore();

  // For now, show totals across all subjects.
  // Later we can scope to subjects that belong to this Admin.
  const [subjectCount, noteCount, lectureCount, upcomingLiveCount, assignmentCount] = await Promise.all([
    prisma.subject.count(),
    prisma.note.count(),
    prisma.lecture.count(),
    prisma.liveSession.count({ where: { date: { gte: new Date() } } }),
    prisma.assignment.count(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold">👨‍🏫 Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">Quick glance at your content.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
        <Stat title="Subjects" value={subjectCount} />
        <Stat title="Notes" value={noteCount} />
        <Stat title="Lectures" value={lectureCount} />
        <Stat title="Upcoming Live" value={upcomingLiveCount} />
        <Stat title="Assignments" value={assignmentCount} />
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Next steps</h2>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Go to <Link href="/admin/subjects" className="text-blue-600 hover:underline">Subjects</Link> and pick a subject to manage.</li>
          <li>Add Notes (PDF links), Lectures (YouTube URLs), Live Sessions (Meet links), Assignments (with due dates).</li>
        </ul>
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}
