// app/super-admin/page.tsx
import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export default async function SuperAdminDashboard() {
  // Always fetch fresh data (avoid static caching)
  noStore();

  // Pull live numbers in parallel
  const [adminCount, userCount, courseCount, upcomingLiveCount] = await Promise.all([
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count(),
    prisma.course.count(),
    prisma.liveSession.count({ where: { date: { gte: new Date() } } }), // upcoming sessions only
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold">🚀 Super Admin Dashboard</h1>
      <p className="mt-4 text-gray-700">Quick overview of the platform:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard title="Admins" value={adminCount} />
        <StatCard title="Users" value={userCount} />
        <StatCard title="Courses" value={courseCount} />
        <StatCard title="Live Classes" value={upcomingLiveCount} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
