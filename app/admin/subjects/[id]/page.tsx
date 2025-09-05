import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import SubjectManager from "./subject-manager";

export default async function SubjectDetailPage({ params }: { params: { id: string } }) {
  noStore();
  const subject = await prisma.subject.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      course: { select: { id: true, title: true } },
    },
  });

  if (!subject) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold">Subject not found</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{subject.name}</h1>
      <p className="text-gray-600 mt-1">Course: {subject.course.title}</p>

      {/* Client manager for CRUD */}
      <div className="mt-6">
        <SubjectManager subjectId={subject.id} />
      </div>
    </div>
  );
}
