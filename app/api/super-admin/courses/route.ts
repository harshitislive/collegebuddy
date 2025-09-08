import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET → list all courses with subjects
export async function GET() {
  const courses = await prisma.course.findMany({
    include: { subjects: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(courses);
}

// POST → create new course
export async function POST(req: Request) {
  try {
    const { title, code } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Course title is required" }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: { title, code },
    });

    return NextResponse.json(course);
  } catch (err) {
    console.error("Error creating course:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

// PUT → update existing course
export async function PUT(req: Request) {
  try {
    const { id, title, code } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const updated = await prisma.course.update({
      where: { id },
      data: { title, code },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating course:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

// DELETE → remove a course (and cascade delete subjects)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    // First delete subjects linked to this course
    await prisma.subject.deleteMany({ where: { courseId: id } });

    // Then delete the course itself
    await prisma.course.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting course:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
